# Car Lease & Loan Negotiator AI 🚗💰

A comprehensive AI-powered assistant designed to help users analyze, understand, and negotiate car lease and loan contracts. This application uses Optical Character Recognition (OCR), LayoutLM, and Large Language Models (LLMs) to extract key financial terms, detect hidden fees, calculate a fairness score, and generate professional negotiation emails.

---

## 🚀 Key Features

*   **📄 Contract Analysis**: Instantly extracts 15+ key data points (APR, Monthly Payment, Residual Value, etc.) from PDF or image contracts.
*   **⚖️ Fairness Score**: Auto-calculates a score (0-100) based on Price, Risk (APR), and Fees.
    *   **Price Score**: Compares payment to market average.
    *   **Risk Score**: Penalizes high interest rates.
    *   **Fee Score**: Flags "junk" fees like VIN Etching or Dealer Prep.
*   **🤖 AI Negotiation Assistant**:
    *   **Email Generator**: Auto-generates a counter-offer email to the dealer with "Copy to Clipboard" functionality.
    *   **Chatbot**: Ask questions like "How do I lower my monthly payment?" or "Is this APR fair?".
*   **📊 Contract Comparison**: Upload two contracts to see a side-by-side comparison of fairness scores and missing data.
*   **🔍 VIN Assistant**: Decode VINs to get vehicle details (uses NHTSA API).

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

1.  **Python 3.8+**: [Download Here](https://www.python.org/downloads/)
2.  **Tesseract OCR**: Required for reading text from images/PDFs.
    *   **Windows**: [Download Installer](https://github.com/UB-Mannheim/tesseract/wiki) (Install to default path `C:\Program Files\Tesseract-OCR`)
    *   **Mac**: `brew install tesseract`
    *   **Linux**: `sudo apt install tesseract-ocr`
3.  **Git**: [Download Here](https://git-scm.com/downloads)

---

## ⚙️ Installation & Setup

Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd car-lease-loan-ai-assistant
```

### 2. Create a Virtual Environment
It's recommended to use a virtual environment to manage dependencies.
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```
*Note: If you encounter issues with `pyperclip` or `streamlit`, ensure you are in the virtual environment.*

### 4. Configure Environment Variables
Create a `.env` file in the root directory and add your keys:
```ini
# Database (SQLite is default, or use PostgreSQL)
DATABASE_URL=sqlite:///./contract_assistant.db

# HuggingFace Token (Required for AI features)
HUGGINGFACE_API_KEY=your_huggingface_token_here

# Optional: NHTSA API (Free, no key needed usually)
```

---

## ▶️ How to Run

You need to run the **Backend** and **Frontend** in separate terminals.

### Terminal 1: Backend (API)
This handles the logic, DB, and AI processing.
```bash
# Make sure venv is active
venv\Scripts\activate

# Run the server
python backend/main.py
```
*The server will start at `http://localhost:8000`*

### Terminal 2: Frontend (Dashboard)
This launches the user interface.
```bash
# Make sure venv is active
venv\Scripts\activate

# Run Streamlit
streamlit run frontend/app_streamlit.py
```
*The app will open in your browser at `http://localhost:8501` (or 8502).*

---

## 📖 Usage Guide

### 1. Analyzing a Contract
- Go to **"Contract Analysis"** in the sidebar.
- Upload your lease or loan agreement (PDF/Image).
- Wait for the AI to extract terms.
- **Review Results**: Check the extracted APR, payments, and the **Fairness Score**.
- **Download**: You can export the extracted data to CSV.

### 2. Generating a Negotiation Email
- After analysis, look for the red bar: **"📧 AI Email Generator & Negotiator"**.
- Click it to generate a strategy based on your specific contract flaws (e.g., high APR, junk fees).
- Click **"📋 Copy Email to Clipboard"** and paste it into your email client.

### 3. Comparing Contracts
- Go to **"Contract Comparison"**.
- Upload "Contract A" and "Contract B".
- The AI will tell you which one is better and why (e.g., "Contract A is better by 15 points").
- You can generate negotiation emails for *both* contracts from this view.

### 4. AI Chat Assistant
- Use the **Chatbots** section to ask free-form questions.
- Example: *"What is the residual value?"* or *"How can I get them to remove the documentation fee?"*

---

## ❓ Troubleshooting

*   **"Tesseract Not Found"**: Ensure Tesseract OCR is installed and added to your system PATH, or update the path in `backend/services/ocr_service.py`.
*   **"Internal Server Error"**: check the backend terminal for logs.
*   **"Copy to Clipboard failed"**: The app uses `pyperclip` for local copying. If running on a remote server, this feature helps via manual copy fallback.

---

**Enjoy getting the best deal on your car! 🚘**
