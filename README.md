# Car Lease & Loan AI Assistant 🚗💰

A full-stack AI application for predicting car prices, analyzing fairness, and managing lease contracts.

## 🚀 Features & Milestones Completed

### ✅ Milestone 1: Backend & Database Setup
- Built FastAPI backend connected to SQLite/PostgreSQL.
- Integrated User Authentication (Login/Signup).

### ✅ Milestone 2: Dashboard & UI
- Developed a React Frontend with a responsive Dashboard.
- Added visual charts for loan vs. lease comparison.

### ✅ Milestone 3: AI Price Prediction (NEW) 🔮
- **Real-time Valuation:** Connected to NHTSA API for accurate vehicle details.
- **Fair Price Analysis:** Uses Google Gemini AI to estimate market value based on VIN & mileage.
- **Visual Interface:** Created a dedicated "Price Predictor" page with green/red fairness indicators.

### ✅ Milestone 4: Document Analysis (OCR)
- Upload feature for Lease Contracts (PDFs).
- OCR processing to extract text from contracts.

---

## 🛠️ Setup Instructions

### Backend
1. Navigate to the folder: `cd backend`
2. Create/Activate virtual environment.
3. Install dependencies: `pip install -r requirements.txt`
4. Run server: `uvicorn main:app --reload`

### Frontend
1. Navigate to the folder: `cd frontend`
2. Install packages: `npm install`
3. Start React app: `npm start`