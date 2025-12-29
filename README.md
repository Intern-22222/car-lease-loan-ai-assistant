# car-lease-loan-ai-assistant  
## Car Lease / Loan Contract Review and Negotiation AI Assistant

An AI assistant designed to review car lease and loan contracts by extracting text from PDF documents, cleaning the extracted content, and storing it for further analysis and negotiation support using AI models.

---

## 📌 Internship Contribution

**Intern C – OCR & Text Processing**

This repository contains my internship work focused on building the OCR and text processing pipeline.

---

## 🎯 Assigned Tasks (Intern C)

### ✅ Task 1: Integrate OCR Service
- Implemented a reusable OCR service function
- Handled all required OCR dependencies
- Converted PDF pages into images
- Extracted text from each page using OCR
- Connected OCR output to a database for storage

### ✅ Task 2: Text Processing
- Applied noise reduction on OCR output
- Handled layout-related issues in extracted text
- Performed validation checks
- Prepared clean text for downstream AI processing

---

## 📁 Project Structure

```text
carlease/
│
├── data/
│   └── (empty)                     # Reserved for processed / cleaned output
│
├── Database/
│   ├── ocr.db                      # SQLite database storing extracted text
│   ├── db_helper.py                # Database connection and insert logic
│   └── __init__.py
│
├── ocr/
│   ├── ocr_fun.py                  # Main OCR function (PDF → Image → Text)
│   ├── text_processing.py          # Noise reduction & text cleanup
│   ├── test_ocr.py                 # Test script to run OCR pipeline
│   └── __init__.py
│
├── pdfs/
│   └── test.pdf                    # Sample contract PDF for OCR testing
│
├── .gitignore
├── README.md
└── myenv/                          # Virtual environment (ignored in Git)


