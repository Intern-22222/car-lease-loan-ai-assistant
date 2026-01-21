# 🚗 Car Lease & Loan AI Assistant

**Milestone 4: Intelligence, Negotiation & Automation**
*A Full-Stack AI application to analyze lease contracts and automate dealer negotiations.*

---

## 🚀 Key Features (Milestone 4)

### 1. 📊 Visual Fairness Score
* **The Engine:** A custom algorithm analyzes APR, Termination Fees, and Terms.
* **The Visual:** Implemented a **Circular Gauge** (Green/Yellow/Red) to give users an instant "Health Check" of the deal.

### 2. ⚖️ Smart Comparison System
* **Dual-Ingestion:** Supports uploading two PDFs simultaneously (`Contract A` vs `Contract B`).
* **Context Awareness:** Automatically detects if the user is comparing the *same* car (Price focus) or *different* cars (Feature focus).

### 3. 🤖 AI Chatbot & Negotiation Assistant
* **Floating Chatbot:** A real-time assistant that answers questions about the contract terms.
* **Auto-Draft Emailer:** Generates a professional negotiation email based on the Fairness Score and sends it via the Backend API.

---

## 🛠️ Technical Stack
* **Frontend:** React.js, `react-circular-progressbar`, Axios
* **Backend:** Python (FastAPI), Pydantic Models
* **Integration:** REST API connecting React UI to Python Logic

## 📸 How to Run
1.  **Start Backend:** `cd backend` -> `uvicorn main:app --reload`
2.  **Start Frontend:** `cd frontend` -> `npm start`