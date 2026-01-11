## Problem Statement
Car lease and loan contracts are long and difficult for users to understand. Many users are unaware of the interest rates, hidden penalties, and whether the deal offered by the dealer is fair. This lack of clarity makes negotiation difficult.

## Solution
This project provides an AI-based assistant that allows users to upload car lease or loan contracts. The system extracts key contract details, summarizes them in a simple format, and helps users negotiate better deals.

## SLA Fields to Extract
The following key fields will be extracted from car lease or loan contracts:

- Interest Rate (APR)
- Lease Term (in months)
- Monthly Payment Amount
- Down Payment
- Mileage Limit
- Penalties / Late Fees
- Early Termination Clause

These fields are fixed for the initial version of the project and will be used for contract analysis and negotiation assistance.

 ---

## Milestone 1

1. Upload Car Lease / Loan PDF  
2. Backend receives the file  
3. OCR performed using **pdfplumber**  
4. Extracted text cleaned and processed  
5. Text saved as `.txt` file  
6. Extracted text returned via API  

## 🔍 OCR Tool Used

- **pdfplumber**
- Used for extracting text from PDF contract documents
- Selected for its accuracy on text-based PDFs and easy integration

## Backend Implementation

### Technologies Used
- Python  
- Flask  
- pdfplumber  
- Flask-CORS
- POSTMAN(get,post)

---
## 📌 Milestone 2 
Setup **Frontend, Backend, and OCR service**
- Implement complete data flow:
  **Frontend → Backend → OCR → Extracted Text → Frontend**
- Perform OCR preprocessing on PDF contracts
- Display extracted text on the web interface
- Create OCR sandbox for isolated testing
- Test APIs using Postman

---

## 🖥️ Frontend Development (Completed)

- Developed frontend using:
  - **HTML**
  - **CSS**
  - **JavaScript**
- Web page allows users to:
  - Upload car lease / loan PDF
  - Click **Upload & Extract**
  - View extracted contract text directly on the web page
- Frontend is fully connected to backend APIs and is **working correctly**

## 📌 Milestone 2 – Completed ✅
