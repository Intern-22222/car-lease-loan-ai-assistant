# car-lease-loan-ai-assistant
Car Lease/Loan Contract Review and Negotiation AI Assistant
<br>
AI assistant to review car lease/loan contracts, extract key terms, compare market prices &amp; assist with negotiation using LLMs and public vehicle data.

## 🚀 Milestone 1:
## 🚀 Features (OCR Module)
* **Tesseract OCR Integration:** High-accuracy text extraction from PDF contracts.
* **Multi-page Support:** Seamlessly processes contracts of any length using `pdf2image`.
* **Smart Preprocessing:** Converts PDF pages to high-resolution images (300 DPI) before reading.
* **Text Cleanup:** Regex-based cleaning to fix broken paragraphs and remove excess whitespace.
* **API Ready:** The core engine accepts raw file bytes, ready for FastAPI integration.

## 📁 Project Structure

```text
car-lease-loan-ai-assistant/
├── docs/
│   ├── run_local.md          # Local setup guide (Tesseract/Poppler)
│   └── OCR_Module.md         # Deep-dive documentation
├── ocr/
│   └── test_ocr.py           # Week 1: Manual prototype script
├── backend/
│   └── app/
│       └── ocr.py            # Week 2: Production OCR module
├── tests/
│   └── test_ocr.py           # Week 2: Automated unit tests
├── samples/                  # PDF contracts for testing
├── requirements.txt          # Python dependencies
└── README.md

🛠️ Installation1.
1.Prerequisites
  Python 3.8+
  Tesseract OCR (Must be installed on OS and added to PATH)
  Poppler (Must be installed on OS and added to PATH)
2. Quick Start
Clone the repository
   git clone [https://github.com/Intern-22222/car-lease-loan-ai-assistant.git](https://github.com/Intern-22222/car-lease-loan-ai-assistant.git)
cd car-lease-loan-ai-assistant

Install Python dependencies
  pip install -r requirements.txt

📖 Usage
1. Run Manual Test (Week 1)
Convert all PDFs in the samples/ folder to text files in data/.
    python ocr/test_ocr.py
2. Run Automated Tests (Week 2)
 Verify the engine works on all sample files (checks for valid output > 100 chars).
     pytest -s tests/test_ocr.py
3. Using the Module in Code (Backend Integration)

   from backend.app.ocr import process_pdf
   # Simulate reading a file upload as bytes
   with open("samples/contract.pdf", "rb") as f:
      file_bytes = f.read()
   # Process the bytes directly
    clean_text = process_pdf(file_bytes)
    print(clean_text)

📋 Week 1 & 2 Deliverables (Intern C)
  Week 1 ✅
    docs/run_local.md - Setup guide for Tesseract & Poppler.
    ocr/test_ocr.py - Prototype script for batch processing local files.
    requirements.txt - Dependency management.
Week 2 ✅
    backend/app/ocr.py - Production-ready module:
         Accepts raw bytes (for API compatibility).
         Implements Regex cleaning.
         Handles exceptions gracefully.
    tests/test_ocr.py - Automated Pytest suite:
         Parametrized to test all PDFs in samples/.
         Validates output length and type.
    docs/OCR_Module.md - Technical documentation.<br>


* **🚀 Milestone 2**:

   Advanced Processing & Storage (Weeks 3 & 4)

Goal: Improve OCR accuracy on noisy documents and implement persistent data storage.

✨ Key Updates
1.  Noise Reduction (Computer Vision):
    * Integrated OpenCV to preprocess contract images before reading them.
    * Uses Adaptive Thresholding to remove shadows, coffee stains, and uneven lighting.
    * Converts images to high-contrast Grayscale/Binary for optimal Tesseract performance.

2.  Database Integration:
    * Added SQLAlchemy to connect the Python backend to a database.
    * Automatically saves every scanned filename and its extracted text to a local SQLite database (ocr_data.db).
    * Ensures parsed contracts are stored permanently for retrieval.

3.  Layout Handling:
    * Configured Tesseract with Page Segmentation Modes (PSM).
    * Optimized for uniform text blocks (Contracts) to prevent column misalignment.

📂 New & Updated Files

car-lease-loan-ai-assistant/
├── docs/
│   ├── run_local.md          # Local setup guide (Tesseract/Poppler)
│   └── OCR_Module.md         # Technical documentation
├── ocr/
│   └── test_ocr.py           # M1: Manual prototype script
├── backend/
│   └── app/
│       ├── ocr.py            # Main Engine: Orchestrates Preprocessing -> OCR -> DB
│       ├── preprocessing.py  # M2: OpenCV image cleaning logic
│       └── database.py       # M2: SQLite connection & schema
├── tests/
│   └── test_ocr.py           # Automated unit tests
├── samples/                  # PDF contracts for testing
├── check_db.py               # Utility to view saved database records
├── requirements.txt          # Python dependencies
└── README.md

 🛠️ How to Test Milestone 2

## 🧪 verification Tools (Milestone 2)

To ensure the Computer Vision (OpenCV) module is actually improving OCR quality, we created two specific test scripts.

1. Visual Debugging Test (visual_test.py)
Purpose: Generates "Before" vs. "After" images to visually verify that shadows, noise, and colors are being removed correctly.

How to Run:
    
    python visual_test.py

 2. Accuracy Comparison Test (accuracy_test.py)
Purpose:Quantifies the improvement by comparing the character count of OCR on the raw image vs. the cleaned image.

How to Run:
    
    python accuracy_test.py

3. Run the Full Pipeline
This runs the OCR on sample files and saves the results to the database.

    python -m pytest -s tests/test_ocr.py

4.Verify Database Storage
Run this script to peek inside the ocr_data.db file and confirm the text was saved.

     python check_db.py

✅ Milestone 2 Checklist
1.Install OpenCV & SQLAlchemy (pip install opencv-python-headless sqlalchemy)
2. Create preprocessing.py for image noise reduction
3. Create database.py for SQLite connection
4. Integrate Preprocessing & DB logic into ocr.py
5. Verify data persistence with check_db.py
