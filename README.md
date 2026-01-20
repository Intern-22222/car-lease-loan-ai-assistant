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


---






## 🚀 Milestone 3 – Contract Comparison Dashboard & Insights View

### Overview
Milestone 3 focuses on building the **user interface layer** for comparing multiple car lease/loan contracts and providing actionable insights. This milestone implements a **contract comparison dashboard** and an **insights view** that allow users to upload multiple lease contract PDFs, extract key SLA parameters, and compare them side-by-side.

The goal is to improve transparency, simplify decision-making, and support negotiation readiness for users.

### Features Implemented

#### 1. Multi-PDF Upload
- Users can upload **two or more lease contract PDFs** simultaneously.
- Supported format: `.pdf`

#### 2. Automatic SLA Extraction
From each uploaded contract, the system extracts the following fields:
- Interest Rate / APR  
- Lease Term Duration  
- Monthly Payment  
- Down Payment  
- Residual Value  
- Mileage Allowance & Overage Charges  
- Early Termination Clause  
- Purchase Option (Buyout Price)  
- Maintenance Responsibilities  
- Warranty and Insurance Coverage  
- Penalties or Late Fee Clauses  

> Extraction is currently regex-based for prototyping and will be replaced by LLM-based extraction in the next milestone.


### 3. Contract Comparison Dashboard
- Displays **side-by-side comparison** of all uploaded contracts.
- Each contract is shown as a column and each SLA parameter as a row.
- Enables quick visual comparison similar to e-commerce product comparison platforms.


### 4. Insights View
For each contract, the system provides:
- **Key metrics** (APR, Monthly Payment, Down Payment, Mileage, etc.)
- **Red flags detection**, such as:
  - Missing APR
  - Unclear maintenance responsibility
  - Strict early termination clauses
  - High penalties or late fees
- Highlights potential risks and unclear clauses to support better decision-making.


### Technical Implementation

- **Frontend/UI:** Streamlit  
- **PDF Processing:** pdfplumber  
- **Data Handling:** Pandas DataFrames  
- **Extraction Layer:** Regex-based (LLM-ready architecture)  

---

### How to Run (Milestone 3 UI)

1. Install dependencies:
     pip install streamlit pandas pdfplumber

Run the application:
     streamlit run streamlit_app.py

✅Deliverables for Milestone 3:
1.Working contract comparison dashboard
2.Insights view with red flags and highlights
3.Multi-PDF upload support
4.Real-time extraction and rendering of SLA parameters








* **🚀 Milestone 4**:
 AI Negotiation Assistant & Logic Validation
1. Overview:
In this milestone, the application evolves from a static contract analyzer into an interactive Negotiation Assistant. The system now uses Generative AI (Google Gemini) to:
a)Extract hidden data (like Junk Fees) that simple regex misses.
b)Calculate a "Fairness Score" to instantly grade a contract.
c)Chat with the user, providing real-time coaching and drafting counter-offers.
d)Validate Logic to ensure the scoring algorithm is accurate and robust.

2. Key Features Implemented:
A. Fairness Score Algorithm (Task 1)
   A proprietary scoring engine that grades a lease contract from 0 (Bad) to 100 (Perfect).
     a)Purpose: To give users an instant "at-a-glance" understanding of deal quality.
     b)Input Data: Interest Rate (APR), Monthly Payment, Mileage Limit, Hidden Fees.
     c)Scoring Logic:
        i)Base Score: 100 Points.
        ii)High APR Penalty: -25 points if APR > 10%.
        iii)Bad Monthly Payment: -10 points if Payment > $800.
        iv)Low Mileage: -5 points if Mileage < 12,000/yr.
        v)Junk Fees: -15 points per hidden fee found (e.g., Nitrogen, Doc Prep).

B. AI-Powered Extraction (Task 2)
Integration with Google Gemini 1.5 Flash to extract complex, unstructured data that traditional OCR misses.
 a)Prompt Engineering: The AI is instructed to act as a "Legal Auditor" and output strict JSON.
 b)Capabilities:
    i)Identifies "Junk Fees" hidden in fine print.
    ii)Extracts "Money Factor" and converts it to APR.
    iii)Standardizes inconsistent field names (e.g., "Rent Charge" vs. "Finance Charge").

C. Negotiation Chatbot (Task 3)
A context-aware AI assistant that helps users actively negotiate with dealers.
 a)Architecture:
    i)Context Window: The chatbot is fed the specific JSON data of the uploaded contract.
    ii)Role: Acts as a "Shark Negotiator" (polite but firm).
    iii)Functionality:
         1)Drafts email/text replies to dealers.
         2)Suggests leverage points (e.g., "This APR is 3% above market average").
         3)Maintains conversation history for follow-up questions.
 b)UI: A dedicated "Negotiator" dashboard with a WhatsApp-style chat interface.

D. Logic Validation (Task 4)
A robust testing framework to prove the algorithm works correctly.
 a)Visual Validation: A UI card that changes color (Green/Orange/Red) based on the score.
 b)Automated Testing: A Python script (tests/test_logic.py) that feeds "Perfect" and "Terrible" fake contracts into the system to verify that the score drops appropriately.

3. Technical Architecture:
File Structure

infosys-car-loan-project/
├── backend/
│   ├── app/
│   │   ├── logic.py            # The Fairness Score Algorithm (Task 1 & 4)
│   │   ├── llm_service.py      # Google Gemini Integration (Task 2 & 3)
│   │   └── main.py             # FastAPI backend (optional if using pure Streamlit)
├── frontend/
│   ├── dashboard.py            # Main Comparison Dashboard
│   └── pages/
│       └── negotiator.py       # New Chatbot Interface (Task 3)
├── samples/                    # Folder for PDF Contracts
└── tests/
    ├── test_logic.py           # Automated Validation Script (Task 4)
    └── test_prompt.py          # AI Extraction Test Script

Dependencies:
a)streamlit: For the Dashboard and Chat UI.
b)google-generativeai: For accessing Gemini 1.5 Flash.
c)pytesseract / pdf2image: For OCR text extraction.
d)pandas: For data organization in the dashboard.

4. Usage Guide:
How to Run the Application
a)Start the Dashboard:
       streamlit run frontend/dashboard.py
b)Upload Contracts:
       i)Navigate to the sidebar and upload PDF lease agreements.
       ii)The app will automatically extract data and calculate the Fairness Score.
c)Use the Negotiator:
       i)Click on the "Negotiator" page in the sidebar.
       ii)Upload the specific contract you want to fight for.
       iii)Ask the AI: "Write an email asking them to remove the Nitrogen fee."

5. How to Run the Tests:
To verify the system logic for the milestone submission:
     python tests/test_logic.py
Expected Output: 🏆 SUCCESS: Logic is verified!
