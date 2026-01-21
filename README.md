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

## 📌 Milestone 3: Frontend Structure & Navigation

### 🎯 Objective
The objective of Milestone 3 was to design and implement the core **ReactJS frontend structure**, including user authentication screens and smooth navigation between key application sections.

---

### ✅ Tasks Completed

#### 1. ReactJS Application Structure
- Created a scalable **ReactJS project structure**.
- Implemented a **Login screen** for user authentication.
- Developed a **Document Upload screen** to allow users to upload contract PDF files.
- Applied reusable components and clean folder organization.

#### 2. Navigation & Routing
- Implemented basic navigation between:
  - Login screen
  - Dashboard
  - Document upload section
- Ensured smooth screen transitions using React routing logic.
- Maintained application state to control authenticated access.

---

### 🧪 Testing & Validation
- Verified successful navigation between all screens.
- Tested login flow and upload screen rendering.
- Ensured UI components load correctly without errors.

---

### 🏁 Outcome
Milestone 3 successfully established a functional and user-friendly frontend foundation, enabling users to log in, upload documents, and navigate seamlessly across the application.

---


## 📌 Milestone 4: Fairness Validation & Logic Verification

### 🎯 Objective
The goal of Milestone 4 was to validate the end-to-end logic of the AI system by ensuring that the fairness scoring, hidden fee detection, and negotiation assistant outputs are accurate, consistent, and reliable.

---

### ✅ Tasks Completed

#### 1. Fairness Score Algorithm Validation
- Verified the fairness score calculation by combining:
  - **Risk factors** (penalties, termination clauses, interest rate risks)
  - **Price-related factors** (hidden fees, additional charges)
- Ensured the final score is normalized on a **0–100 scale**.
- Classified contracts into ratings such as **Fair**, **Moderate**, or **Unfair** based on thresholds.

#### 2. Hidden Fee Extraction Verification
- Validated LLM prompt outputs to ensure:
  - Hidden or junk fees are extracted accurately
  - Output follows a **structured JSON format**
- Confirmed consistency across different contract samples.

#### 3. Negotiation Assistant Output Testing
- Tested auto-generated counter-negotiation emails.
- Ensured emails are:
  - Context-aware
  - Professional and polite
  - Aligned with detected unfair clauses and fees

#### 4. End-to-End Logic Validation
- Tested complete workflow:
  1. PDF upload
  2. OCR text extraction
  3. Clause and fee analysis
  4. Fairness score generation
  5. Negotiation email creation
- Verified correct data flow between **React frontend** and **Flask backend** via REST APIs.

---

### 🧪 Testing & Validation
- Manual test cases with multiple contract samples
- Edge-case testing for:
  - Missing data
  - Extremely high-risk clauses
  - No hidden fee scenarios
- API validation using Postman

---

### 🏁 Outcome
Milestone 4 successfully validated the system’s logic, ensuring the AI assistant produces accurate fairness scores, reliable fee detection, and meaningful negotiation recommendations, making the solution production-ready.

---

