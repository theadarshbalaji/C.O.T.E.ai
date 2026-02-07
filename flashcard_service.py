import os
import json
from typing import List, Dict
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.messages import HumanMessage, SystemMessage
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type
)
from dotenv import load_dotenv

load_dotenv(override=True)

# --- CONFIG ---
CHROMA_PATH = "./chroma_db"
LOCAL_EMBEDDINGS = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)

@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type(Exception),
    before_sleep=lambda retry_state: print(f"⚠️ API Limit hit (Flashcards). Retrying in {retry_state.next_action.sleep} seconds...")
)
def generate_ai_response(messages):
    try:
        return llm.invoke(messages)
    except Exception as e:
        print(f"DEBUG: API call failed with error: {str(e)}")
        raise e

FLASHCARD_SYSTEM_PROMPT = """
You are an expert educational content creator. Your goal is to extract the main topics from a provided text and create concise, high-impact revision summaries for each topic.

Rules for your response:
1. **Extraction**: Identify the 5-8 most important core topics or concepts from the provided text.
2. **Conciseness**: Each summary MUST be short and punchy (max 100 words per topic).
3. **Format**: Return a JSON object with a list called "flashcards". Each item should have:
   - "topic": The name of the concept.
   - "summary": The concise revision notes for that topic.
4. **Style**: Use bullet points and bold text for key terms within the summary.
5. **JSON ONLY**: Your entire response MUST be a valid JSON object. Do not include any markdown formatting like ```json ... ``` tags.
"""

def generate_flashcards(session_id: str):
    """
    Generates topic-wise revision summaries from the ingested materials of a session.
    """
    flashcard_cache_path = os.path.join("uploads", session_id, "flashcards.json")
    
    # Check if already generated
    if os.path.exists(flashcard_cache_path):
        try:
            with open(flashcard_cache_path, "r") as f:
                return json.load(f)["flashcards"]
        except Exception as e:
            print(f"⚠️ Error reading flashcard cache: {e}")

    # 1. Connect to DB
    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=LOCAL_EMBEDDINGS,
        collection_name="hackathon_collection"
    )

    # 2. Retrieve all unique chunks for this session
    print(f"🔍 Retrieving material for flashcards in session: {session_id}")
    # We retrieve more chunks to get a broader overview for topic extraction
    results = db.get(
        where={"session_id": session_id},
        include=["documents"]
    )
    
    docs = results.get("documents", [])
    if not docs:
        print(f"⚠️ No documents found for session {session_id}")
        return []

    # Combine docs (capped to avoid context limit)
    full_context = "\n\n".join(docs[:15])

    # 3. Generate with AI
    prompt = f"Extract topics and generate revision flashcards from this text:\n\n{full_context}"
    
    messages = [
        SystemMessage(content=FLASHCARD_SYSTEM_PROMPT),
        HumanMessage(content=prompt)
    ]

    print(f"🪄 Generating flashcards via AI for session {session_id}...")
    response = generate_ai_response(messages)
    
    try:
        # Clean response if AI adds markdown
        clean_content = response.content.replace('```json', '').replace('```', '').strip()
        data = json.loads(clean_content)
        
        # Cache for future use
        os.makedirs(os.path.dirname(flashcard_cache_path), exist_ok=True)
        with open(flashcard_cache_path, "w") as f:
            json.dump(data, f)
            
        return data.get("flashcards", [])
    except Exception as e:
        print(f"❌ Failed to parse flashcard JSON: {e}")
        print(f"RAW CONTENT: {response.content}")
        return []

if __name__ == "__main__":
    # Test logic
    # print(generate_flashcards("test_session"))
    pass
