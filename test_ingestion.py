import os
from ingestion_pipeline import ingest_directory

if __name__ == "__main__":
    # Test directory configuration
    TEST_DIR = "./docs"
    
    if os.path.exists(TEST_DIR):
        print(f"🚀 Starting standalone test ingestion for: {TEST_DIR}")
        ingest_directory(TEST_DIR)
    else:
        print(f"⚠️ Test directory {TEST_DIR} not found.")
        print(f"Please create a folder named '{TEST_DIR}' and add some PDFs to test.")
