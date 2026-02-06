from retrieval_service import get_doubt_assistant_response

if __name__ == "__main__":
    # If you used the './docs' folder for ingestion, the session_id will be 'docs'
    SESSION_ID = "docs" 
    QUERY = "Can you explain the main concepts from the uploaded document?"
    
    print(f"🔍 Testing Retrieval for Session: {SESSION_ID}")
    print(f"Question: {QUERY}")
    
    try:
        print("\n--- ENGLISH TEST ---")
        res_en = get_doubt_assistant_response(QUERY, SESSION_ID, language="english")
        print(res_en[:200] + "...")

        print("\n--- HINDI TEST ---")
        res_hi = get_doubt_assistant_response(QUERY, SESSION_ID, language="hindi")
        print(res_hi[:200] + "...")
    except Exception as e:
        print(f"❌ Test failed: {e}")
        print("Note: Ensure you have run 'test_ingestion.py' first so the 'docs' session exists in ChromaDB.")
