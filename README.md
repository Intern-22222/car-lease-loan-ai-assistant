# car-lease-loan-ai-assistant  
## Car Lease / Loan Contract Review and Negotiation AI Assistant

An AI assistant designed to review car lease and loan contracts by extracting text from PDF documents, cleaning the extracted content, and storing it for further analysis and negotiation support using AI models.

---

## 📌 Internship Contribution

**Intern C – OCR & Preprocessing Engineer**

This repository contains my internship work focused on building the OCR, preprocessing, and text storage pipeline for car lease and loan contract documents.

---

## 🧩 Project Milestones

### ✅ Milestone 1: OCR Pipeline Development (Completed)
**Role:** Intern C — OCR & Preprocessing Engineer  
**Focus:** OCR pipeline (Tesseract / pdftoppm), PDF → Text

- Designed and implemented an end-to-end OCR pipeline  
- Converted PDF contract documents into images using **pdftoppm (Poppler)**  
- Extracted text from images using **Tesseract OCR**  
- Built reusable OCR functions for consistent PDF-to-text conversion  
- Established the base for downstream AI-based contract analysis  

---

### ✅ Milestone 2: OCR Integration, Text Processing & Storage (Completed)
**Role:** Intern C  
**Focus:** OCR service integration, preprocessing, validation, and database storage  

**Task 1: Integrate OCR Service**
- Created a reusable OCR service function  
- Handled and configured all required OCR dependencies  
- Established database connectivity  
- Stored extracted OCR text into a SQLite database  

**Task 2: Text Processing**
- Applied noise reduction techniques on raw OCR output  
- Handled layout and formatting inconsistencies in extracted text  
- Performed validation checks to ensure accuracy and completeness  
- Prepared clean text for downstream AI processing and negotiation modules  

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



```
## ▶️ How to Run the OCR Module

1. Ensure all required dependencies are installed (Tesseract, Poppler, Python packages).
2. Place the input PDF file inside the `pdfs/` folder.
3. Run the OCR test script using the command below:

python ocr/test_ocr.py

## Output

Extracted and cleaned text is stored in the SQLite database:

Database/ocr.db

## 🛠️ Technologies Used

Python

Tesseract OCR

Poppler (PDF to Image Conversion)

SQLite

Git & GitHub

## 📌 Notes

The data/ directory is intentionally left empty for future processed or cleaned outputs.

The database file is lightweight and used only to store OCR results.

Virtual environment (myenv/) and cache files are excluded using .gitignore.

This OCR module acts as the foundation for future AI-based contract analysis and negotiation features.

