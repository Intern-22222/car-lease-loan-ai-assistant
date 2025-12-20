# car-lease-loan-ai-assistant
Car Lease/Loan Contract Review and Negotiation AI Assistant
<br>
AI assistant to review car lease/loan contracts, extract key terms, compare market prices &amp; assist with negotiation using LLMs and public vehicle data.



# Current focus: building a reliable OCR (Optical Character Recognition) module.

# Features (OCR Module)
•	Tesseract OCR – Extracts text from scanned PDF contracts
•	Multi-page Support – Processes all pages of a contract
•	High Accuracy – Converts PDFs to high-resolution images (300 DPI)
•	Text Cleaning – Fixes broken lines and extra spaces using regex
•	API Ready – Designed to work with FastAPI using raw file bytes

# Project Structure
````text
car-lease-loan-ai-assistant/
├── docs/
│   ├── run_local.md          # Local setup guide (Tesseract & Poppler)
├── ocr/
│   └── test_ocr.py           # Week 1: Manual OCR prototype
├── backend/
│   └── app/
│       └── ocr.py            # Week 2: Production OCR module
├── tests/
│   └── test_ocr.py           # Week 2: Automated tests
├── samples/                  # Sample PDF contracts
├── requirements.txt          # Python dependencies
└── README.md
````
# Installation
```text
1. Prerequisites
•	Python 3.8+
•	Tesseract OCR (installed and added to PATH)
•	Poppler (installed and added to PATH)
2. Quick Start
git clone https://github.com/Intern-22222/car-lease-loan-ai-assistant.git
cd car-lease-loan-ai-assistant
pip install -r requirements.txt
For detailed setup steps, see:
docs/run_local.md

Usage
1. Run Manual OCR (Week 1)
Converts all PDFs in the samples/ folder into text files.
python ocr/test_ocr.py

2. Run Automated Tests (Week 2)
Checks OCR output validity and length.
pytest -s tests/test_ocr.py
```

# Week 1
•	docs/run_local.md – OCR environment setup guide
•	ocr/test_ocr.py – Manual OCR prototype
•	requirements.txt – Dependency list
# Week 2
•	backend/app/ocr.py – Production OCR module
o	Accepts raw file bytes
o	Cleans extracted text
o	Handles errors safely
•	tests/test_ocr.py – Automated Pytest suite
o	Tests all PDFs
o	Validates output type and length
•	docs/OCR_Module.md – Technical OCR documentation
