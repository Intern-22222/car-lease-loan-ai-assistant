Car Lease / Loan AI Assistant 
📌Project Overview

This project is an AI-assisted backend system that allows users to upload car lease or loan PDF contracts, extract text using OCR, and store the extracted content for further analysis (like identifying key contract terms in future stages).


 **MILESTONE-1**

## Week 1: Project Setup & Backend Foundation

### Project Setup
- Created a structured project folder:
  - **backend/** – backend code
  - **data/uploads/** – uploaded PDF files
  - **data/sample_contracts/** – sample PDFs for testing
  - **data/extracted_text/** – extracted text output files
- Initialized the Git repository and pushed the code to GitHub.

### Python Environment
- Created and activated a virtual environment (**venv**).
- Installed required packages:
  - **Flask**
  - **pdfplumber**
- Managed dependencies using **requirements.txt**.

### Backend Application
- Built a basic Flask backend application.
- Verified the backend runs successfully at:  
  **http://127.0.0.1:5000/**

---

## Week 2: OCR Pipeline (Intern c - OCR & preprocessing engineer--Focus on OCR pipepline)

### File Upload API
- Created a **/upload** API endpoint-**used POSTMAN**.
- Accepts PDF files via **POST** requests.
- Saves uploaded PDFs into **data/uploads/**.

### OCR Integration
- Integrated **pdfplumber** to extract text from uploaded PDFs.
- Successfully converted PDF contracts into readable text.

### OCR Testing
- Used **Postman** to upload PDF files.
- Verified:
  - PDF upload works correctly
  - OCR extracts text accurately
  - No backend errors during processing

### Store Extracted Text
- Saved extracted text into **.txt** files inside:
  - **data/extracted_text/**
- Each uploaded PDF generates a corresponding text file.

### End-to-End Flow Verified
- **Upload PDF → OCR Processing → Text Extraction → Text Saved**
- Full OCR pipeline works successfully.

## 🎯 Current Status
- ✔ Backend running successfully
- ✔ File upload API working
- ✔ OCR pipeline functioning correctly
- ✔ Text extracted and stored properly


  **Intern C (OCR & preprocessing engineer--Focus on OCR pipepline) tasks completed**

  ---
