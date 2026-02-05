# EduPortal - Study Assistant Bot 🎓🤖

EduPortal is a comprehensive AI-powered learning platform designed for both teachers and students. It features an ingestion pipeline for educational PDFs, a RAG-based doubt assistant, and a modern, high-fidelity web interface.

## ✨ Features

- **Dual Portals**: Dedicated experiences for Teachers and Students.
- **AI Material Processing**: Intelligent PDF ingestion and topic mapping.
- **Interactive Learning**:
  - **3D Flashcards**: High-performance revision cards with smooth animations.
  - **Self-Assessments**: Automatically generated quizzes to test knowledge.
- **Doubt Assistant**: A floating, glassmorphism UI chatbot that leverages RAG (Retrieval-Augmented Generation) to answer doubts from uploaded materials.
- **Modern UI**: Built with Vite, React, Tailwind CSS 4, and Framer Motion for a premium, responsive experience.

## 🏗️ Project Structure

```text
.
├── frontend/             # Vite + React (TypeScript + Tailwind CSS 4)
│   ├── src/app/          # Core layout and role selection
│   ├── src/components/   # Navbar, Sidebar, Chatbot, etc.
│   └── src/styles/       # Design system and theme configuration
├── api/                  # FastAPI Backend (Python)
│   ├── ingestion_pipeline.py  # PDF processing (Ollama/Multi-modal support)
│   ├── retrieval_service.py   # RAG-based query engine
│   └── backend_upload_endpoint.py # API endpoints for file uploads
├── chroma_db/            # Vector database for AI retrieval
└── uploads/              # Storage for student/teacher materials
```

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 20+
- Ollama (for local AI processing)

### Setting up the Backend
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: .\venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the API:
   ```bash
   uvicorn backend_upload_endpoint:app --reload
   ```

### Setting up the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS 4, Lucide React, Framer Motion.
- **Backend**: FastAPI, LangChain, ChromaDB, Hugging-Face Embeddings.
- **AI Models**: GEMINI-2.5-flash, Multi-modal PDF processing using UNSTRUCTURED.

## 📄 License
MIT License
