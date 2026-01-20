# car-lease-loan-ai-assistant  
## Car Lease / Loan Contract Review and Negotiation AI Assistant

An AI assistant designed to review car lease and loan contracts by extracting text from PDF documents, cleaning the extracted content, and storing it for further analysis and negotiation support using AI models.

---

## 📌 Internship Contribution 

**Intern C – OCR, Preprocessing & UI Support Engineer**

This repository contains my internship work focused on building the OCR pipeline, preprocessing contract text, and contributing to UI improvements for contract comparison and insights views.

---

## 🧩 Project Milestones

### ✅ Milestone 1: OCR Pipeline Development (Completed)
**Role:** Intern C — OCR & Preprocessing Engineer  
**Focus:** OCR pipeline (Tesseract / pdftoppm), PDF → Text

- Designed and implemented an end-to-end OCR pipeline  
- Converted PDF contract documents into images using **pdftoppm (Poppler)**  
- Extracted text from images using **Tesseract OCR**  
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

### ✅ Milestone 3: Contract Comparison Dashboard & Insights UI Improvements (Completed)
**Role:** Intern C  
**Focus:** UI improvements for contract comparison and insights view  

- Improved UI layout for the contract comparison dashboard  
- Enhanced readability and alignment of key contract parameters  
- Supported insights view to help users easily interpret lease terms  
- Ensured extracted contract data is presented clearly for comparison  
- Tested UI changes using sample contract data and user flows  

---

## 📁 Project Structure

```text
carlease/
│
├── ocr/
│   ├── ocr_fun.py                  # PDF → Image → Text OCR
│   ├── text_processing.py          # OCR cleanup & normalization
│   └── test_ocr.py                 # OCR test script
│
├── Database/
│   ├── ocr.db                      # SQLite database for OCR output
│   ├── db_helper.py
│   └── __init__.py
│
├── pdfs/
│   └── test.pdf                    # Sample contract PDF
│
├── data/
│   └── (reserved)                  # Future processed outputs
│
├── contract-ui/
│   ├── src/
│   │   ├── constants/
│   │   │   ├── enums.js
│   │   │   └── ratingConfig.js
│   │   │
│   │   ├── utils/
│   │   │   └── fieldMapping.js
│   │   │
│   │   ├── pages/
│   │   │   ├── ContractComparison.jsx
│   │   │   └── ContractComparison.css
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── public/
│   │   └── index.html
│   │
│   ├── package.json
│   └── .gitignore
│
├── README.md
└── .gitignore