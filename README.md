# Car Lease Contract Review Backend

## Milestone 1 (week 2)
## Intern B: Backend Engineer – Upload + OCR + DB

**Implemented by**: Harshitha Javvadi

**Status**: ✅ **Complete - End-to-end flow working**

---

## 1. Assigned Tasks (Week 2)

| Day | Task | Status |
|-----|------|--------|
| **6-7** | `POST /upload`: Multipart file upload → Local/S3 storage (env config) | ✅ |
| **8** | `POST /ocr/{file_id}`: Trigger OCR worker (synchronous OK for PoC) | ✅ |
| **9-10** | Persist extracted text to DB `contracts` table (`file_id`, `s3_path`, `raw_text`, `ingested_at`) | ✅ |

**Acceptance**:  
Upload + OCR flow works locally end‑to‑end:
`upload file → /ocr → DB record with raw_text stored`.



## 2. Project Structure

backend/
├── app/                 
│   ├── main.py         
│   ├── database.py     
│   ├── models.py       
│   ├── schemas.py      
│   └── ocr.py          
├── data/                
├── infra/               
├── requirements.txt    
└── .env                



## 3. Environment & Setup

.env

    DATABASE_URL=postgresql://user:password@localhost:5432/contract_db
    STORAGE_BACKEND=local     # or 's3' in future
    LOCAL_DATA_DIR=./data

### Start Services
```
    # 1) Start Postgres
    cd backend/infra
    docker-compose up -d db

    # 2) Install dependencies
    cd ..
    python -m venv .venv
    source .venv/bin/activate          # Windows: .venv\Scripts\activate
    pip install -r requirements.txt

    # 3) Run FastAPI app
    uvicorn app.main:app --reload
```

API docs: `http://127.0.0.1:8000/docs`


## 4. API Endpoints
   
#### 4.1 Health Check

* GET `/health`
* Verifies backend is running.
* Response: `{"status": "ok", "message": "Service is running"}`

#### 4.2 Upload Contract

* POST `/upload`
* Input: multipart/form-data, field name `file` (PDF or image).
* Behavior:
    * Saves file into `LOCAL_DATA_DIR (data/)` with UUID filename.
    * Creates a `contracts` row with `file_id`, `filename`, and `s3_path` (local path for now).
* Response (JSON):
 ``` 
{
  "file_id": "<uuid>",
  "filename": "contract.pdf"
}
```

#### 4.3 Run OCR and Store Text

* POST `/ocr/{file_id}`
* Input: `file_id` returned from `/upload`.
* Behavior:
    * Looks up the contract in DB.
    * Uses stored `s3_path` to find the file on disk.
    * Images: Tesseract OCR (via `pytesseract`).
    * PDFs: Text extraction using PyMuPDF (`fitz`).
    * Stores full extracted text in `contracts.raw_text`.
    * Sets `ingested_at` to current time.
* Response (JSON):

 ```
{
  "file_id": "<uuid>",
  "text_extracted": true,
  "full_text": "Vehicle Sale Agreement ... (full contract text)"
}
```

## 5. Database Model (Contracts Table)
`app/models.py` defines the `Contract` ORM model, which maps to the `contracts` table:

    class Contract(Base):
        __tablename__ = "contracts"
        id = Column(Integer, primary_key=True, index=True)
      file_id = Column(String, unique=True, index=True, nullable=False)
      filename = Column(String, nullable=False)
      s3_path = Column(String, nullable=True)   # local path or S3 path
      text_path = Column(String, nullable=True) # reserved for future .txt files
      raw_text = Column(Text, nullable=True)    # OCR result
      ingested_at = Column(DateTime, default=datetime.utcnow)
    
After running `/upload` and `/ocr/{file_id}`, a typical record looks like:
```
file_id     = "48365ed9-6d42-478c-9a13-24cd18995b4f"
filename    = "Sample_contract.pdf"
s3_path     = "data/48365ed9-6d42-478c-9a13-24cd18995b4f.pdf"
raw_text    = "<full extracted contract text...>"
ingested_at = "2025-12-29 13:50:00"
```

## 6. How This Meets Week 2 Acceptance
   
Upload: `POST /upload` accepts multipart files and saves them to `data/` based on env config (`STORAGE_BACKEND`, `LOCAL_DATA_DIR`).

OCR Worker: `POST /ocr/{file_id}` runs OCR synchronously for both images and PDFs, using helper functions in `ocr.py`.

DB Persistence:

`file_id` and `s3_path` captured at upload.

`raw_text` and `ingested_at` filled after OCR.

Data is stored in contracts table via the SQLAlchemy Contract model.

Result:
The flow `upload file → /ocr/{file_id} → DB record with raw_text stored` works end-to-end locally, satisfying all Week 2 deliverables for milestone-1.

---

## Milestone 2 (week 2)
## Intern B: Backend Engineer – Document Upload & Text Storage

**uploading contract documents and saving their extracted plain‑text into the database.**

---

## 1.Responsibilities

| **Component**            | **Description**                                                                                                                                       |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Document Upload API**   | Provides an endpoint to upload **PDF or image** files (`multipart/form-data`). The uploaded files are stored in the backend under a local `data/` directory. |
| **Data Storage**          | Performs **OCR / text extraction** on uploaded documents using Tesseract or PyMuPDF and saves the extracted **plain text** into the database for later LLM and analysis steps. |
| **Base Foundation**       | Builds upon the Week‑2 setup using **FastAPI**, **SQLAlchemy**, and **Tesseract/PyMuPDF**.                                                            |
| **Objective**             | Implement a backend workflow that connects file upload, text extraction, and database storage for further document analysis.                           |


## 2. Environment & Running the Service

.env (key variables)
```
DATABASE_URL=postgresql://user:password@localhost:5432/contract_db
STORAGE_BACKEND=local
LOCAL_DATA_DIR=./data
```
### Start backend
```
cd backend
source .venv/bin/activate          # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload
```
Interactive API docs: `http://127.0.0.1:8000/docs`

## 3. Document Upload API

* Endpoint: POST `/upload`
* Purpose: Upload a contract document (`PDF` or `image`) and register it in the database.
* Input: multipart/form-data, field name file
* Accepted types: `.pdf, .png, .jpg, .jpeg, .tiff, .bmp`
* Behaviour:
    * Generates a UUID file_id.
    * Saves the file under `LOCAL_DATA_DIR` (./data) with the UUID filename.
    * Creates a row in the contracts table with:
        * `file_id`
        * `original filename`
        * `s3_path` (used to store the local file path).
* Example request:
  `curl -F "file=@Sample_contract.pdf" http://127.0.0.1:8000/upload`
* Example response:
```
json
{
  "file_id": "5bcd5f81-3b76-462e-b162-5672b1a1f910",
  "filename": "Sample_contract.pdf"
}
```
This completes the “Document Upload API” requirement.

## 4. Text Extraction & Data Storage
* Endpoint: POST `/ocr/{file_id}`
* Purpose: Take an already‑uploaded document and save its plain text into the database.
* Input: `file_id` obtained from POST `/upload`.
* Behaviour:
    * Looks up the contracts row by `file_id`.
    *Reads the stored file from `s3_path` (local `data/` path).
* Extracts text:
    * For images: uses Tesseract OCR via `pytesseract`.
    *For PDFs: uses PyMuPDF (`fitz`) to pull page text.
* Writes the extracted text into:
    * `contracts.raw_text` (full plain text).
    * Updates `contracts.ingested_at` timestamp.
* Returns the full extracted text to the client for verification.
* Example request:
`curl -X POST "http://127.0.0.1:8000/ocr/5bcd5f81-3b76-462e-b162-5672b1a1f910"`
* Example response:
```
json
{
  "file_id": "5bcd5f81-3b76-462e-b162-5672b1a1f910",
  "text_extracted": true,
  "full_text": "Vehicle Sale Agreement\n\nThis agreement made at ..."
}
```
This fulfils the “Data Storage: save plain text result into the database” requirement, since the same text is stored in the raw_text column.


## 🗄️ Database Schema

**`contracts` table** (auto-created by SQLAlchemy):
```
CREATE TABLE contracts (
id INTEGER PRIMARY KEY,
file_id VARCHAR UNIQUE NOT NULL,
filename VARCHAR NOT NULL,
s3_path VARCHAR,
raw_text TEXT,
ingested_at TIMESTAMP
);
```

### Demo Commands

Upload contract : 
`curl -F "file=@sample_contract.pdf" http://127.0.0.1:8000/upload`

→ {"file_id": "abc123...", "filename": "sample_contract.pdf"}

Extract text : 
`curl -X POST "http://127.0.0.1:8000/ocr/abc123..."`

→ {"file_id": "abc123...", "text_extracted": true, "full_text": "Vehicle Sale Agreement..."}


---

## ⚙️ Key Features Implemented

### 1. **Multipart File Upload** 
- Accepts PDF, PNG, JPG via `UploadFile`
- Configurable storage: `STORAGE_BACKEND=local` (S3-ready)
- Files saved to `data/` with UUID names
- Creates initial DB record

### 2. **OCR Processing**
- **Images**: Tesseract OCR (`pytesseract`)
- **PDFs**: PyMuPDF text extraction (`fitz`)
- Synchronous processing (PoC requirement)
- Full text extraction (2601+ chars)

### 3. **Data Persistence** 
- `raw_text`: Complete OCR output stored
- `ingested_at`: Timestamp of processing
- Single DB record updated (upload → OCR)

---

## 📊 Test Results

| Test Case | Input | OCR Length | Status |
|-----------|-------|------------|--------|
| Image (PNG) | `sample.png` | 2601 chars | ✅ |
| PDF (text) | `contract.pdf` | 3500+ chars | ✅ |
| DB Storage | All files | `raw_text` populated | ✅ |
| End-to-End | Upload → OCR → DB | Complete flow | ✅ |

---

## Milestone 3 (Week 2)
## Intern B : Implement the message threading feature so users can simulate or track dealer conversations.

---



## 1. Goal

Build a **simple chat interface** where users can:

- See multiple dealer conversations as **threads**
- Click a thread to view its messages
- Type and send new messages
- Minimize / maximize the whole chat window

---

## 2. Files

```text
frontend/
└── chat/
    ├── index.html   # Page layout
    ├── styles.css   # Look & feel (colors, layout)
    └── main.js      # Thread data + chat behaviour
```

---

## 3. Data Model (main.js)

Messages are grouped into threads:

```js
const threads = [
  {
    id: "thread-1",
    title: "Dealer A - New Lease Offer",
    lastUpdated: "2026-01-09 10:15",
    messages: [
      { id: "m1", sender: "user",   text: "...", timestamp: "..." },
      { id: "m2", sender: "dealer", text: "...", timestamp: "..." }
    ]
  },
  // more threads...
];
```

This structure keeps conversations organized and makes rendering easy.

---

## 4. UI Behaviour

**HTML + CSS**

- Left side: **Dealer Threads** list (titles + last updated).
- Right side: **Chat Window** with:
  - Header: shows “Conversation” and selected thread title.
  - Messages area: chat bubbles for user/dealer.
  - Input area: textarea + Send button.
- Top bar: **Dealer Conversation Simulator** title + **Minimize/Maximize** button.

**JavaScript**

- `renderThreadList()` – shows all threads in the sidebar.
- `setActiveThread(id)` – when a thread is clicked:
  - marks it active
  - updates header subtitle
  - renders its messages
- `renderMessages(thread)` – draws left/right bubbles from `thread.messages`.
- `sendMessage()` – adds a new user message to the active thread and re‑renders.
- Global toggle button – hides/shows the entire chat area (threads + messages).

---

## 5. How to Run

1. Go to the folder:

   ```bash
   cd frontend/chat
   ```

2. Open `index.html` in a browser.

3. Try:

   - Clicking different dealer threads on the left.
   - Typing a message and pressing **Send** or **Enter**.
   - Clicking the **─ / +** button to minimize or maximize the whole window.

---

## Milestone 4 (Week 2)  
## Intern B: Fairness Validation & Negotiation Chatbot

**Status**: ✅ Complete – Contract analysis, fairness scoring, and negotiation chatbot integrated end‑to‑end.

***

## 1. Objective

Extend the backend and frontend so that, after OCR, the system can:

- Analyze a car lease/loan contract using an LLM (Groq Llama‑3).  
- Detect **risk factors** and **hidden/junk fees** in structured JSON.  
- Compute a transparent **Contract Fairness Score (0–100)** with rating (Fair / Moderate / Unfair).  
- Expose a **Negotiation Assistant chatbot** that answers questions and generates ready‑to‑send counter‑offer emails.

***

## 2. New Backend Components

### 2.1 Data Model & Schemas

**Models**

- `ContractAnalysis` table  
  - `id`, `contract_id`, `file_id`  
  - `analysis_json` (full LLM output + fairness)  
  - `created_at`

**Pydantic Schemas**

- `RiskFactor { name, severity (1–5), description }`  
- `HiddenFee { fee_name, amount?, currency?, frequency?, clause_excerpt? }`  
- `PriceFactors { base_price?, total_monthly_payment?, total_due_at_signing?, estimated_total_cost?, currency? }`  
- `FairnessInfo { score, rating, explanation }`  
- `ContractAnalysisPayload { file_id, risk_factors[], price_factors, hidden_fees[], fairness }`  
- `ChatRequest { file_id, message, history[], intent: "chat" | "email" }`  
- `ChatResponse { assistant_message, counter_email_draft? }`

***

### 2.2 Fairness Score Algorithm

File: `app/fairness.py`  

Inputs derived from LLM JSON:

- Average **risk severity** (1–5) across `risk_factors`.  
- Number of **hidden fees**.  
- Hidden‑fee amount ratio: `sum(hidden_fee.amount) / estimated_total_cost` (when cost is available).

Scoring (all 0–100, higher = more fair):

- `risk_score = max(0, 100 - avg_severity * 15)`  
- `fee_score  = max(0, 100 - hidden_fee_count * 10)`  
- `amount_score = max(0, 100 - min(amount_ratio * 200, 100))`  

Final score:

- `fairness_score = round(0.4 * risk_score + 0.3 * fee_score + 0.3 * amount_score)`  

Rating:

- `>= 75` → **Fair**  
- `50–74` → **Moderate**  
- `< 50` → **Unfair**  

`FairnessInfo.explanation` stores a short breakdown (avg severity, fee count, fee ratio) for transparency.

***

### 2.3 LLM Integration (Groq Llama‑3)

File: `app/groq_client.py`  

Provider: **Groq Cloud**, model **`llama-3.1-8b-instant`** (free tier).  

#### Contract Analysis

Function: `analyze_contract_text(raw_text: str) -> dict`

- System prompt asks LLM to return **only JSON** with keys:
  - `risk_factors[]`, `price_factors`, `hidden_fees[]`, `fairness`.  
- For very large contracts:
  - If Groq returns “request too large (413)”, backend retries with a **truncated** version of the text to stay within token limits.
- Output JSON is parsed and then passed through `compute_fairness` to overwrite numeric score & rating.

#### Negotiation Assistant

Function: `generate_chat_reply(analysis, request) -> { assistant_message, counter_email_draft }`

- Uses:
  - Summary of fairness score and key issues.  
  - Chat `history` (user/assistant messages).  
  - `intent`:
    - `"chat"` → plain conversational answer.  
    - `"email"` → full negotiation email.

Prompt rules:

- For **chat**:
  - Return JSON: `{ "assistant_message": "...", "counter_email_draft": null }`.  
- For **email**:
  - Return JSON with:
    - `assistant_message`: short explanation of strategy.  
    - `counter_email_draft`: professional email including:
      - `Subject: ...`  
      - Greeting (`Dear ...`)  
      - Body referencing unfair clauses / hidden fees and fairness score.  
      - Polite but firm request to revise/remove charges.  
      - Closing and regards.

If the model fails to produce valid JSON, backend safely wraps the raw text into a default JSON shape so the API never crashes.

***

### 2.4 New API Endpoints

All built on top of the existing upload/OCR flow.

#### 1) Analyze Contract

`POST /contracts/{file_id}/analyze`  

- Validates that `contracts.raw_text` exists (OCR already run).  
- Calls `analyze_contract_text(raw_text)` (Groq).  
- Computes fairness score via `compute_fairness`.  
- Upserts into `ContractAnalysis` table.  
- Response: `ContractAnalysisPayload` (risk factors, hidden fees, price factors, fairness).

#### 2) Get Saved Analysis

`GET /contracts/{file_id}/analysis`  

- Fetches the latest `analysis_json` from `ContractAnalysis`.  
- Response: `ContractAnalysisPayload`.

#### 3) Negotiation Chatbot

`POST /contracts/{file_id}/chat`  

- Body: `ChatRequest` with `message`, optional `history`, and `intent`.  
- Loads saved analysis; if missing, asks client to call `/analyze` first.  
- Calls `generate_chat_reply`.  
- Response: `ChatResponse`:
  - `assistant_message` → shown in chat bubble.  
  - `counter_email_draft` → shown in a separate email panel when present.

***

## 3. React Frontend: Fairness & Chatbot UI

Folder: `frontend/chatbot` (Vite + React)

### 3.1 API Client

File: `src/api/client.ts`

- `uploadContract(file)` → `POST /upload`  
- `runOCR(fileId)` → `POST /ocr/{file_id}`  
- `analyzeContract(fileId)` → `POST /contracts/{file_id}/analyze`  
- `getAnalysis(fileId)` → `GET /contracts/{file_id}/analysis`  
- `sendChat(fileId, message, history, intent)` → `POST /contracts/{file_id}/chat`

### 3.2 Centered App Layout

File: `src/App.jsx`

- Full‑screen **gradient background** with a single **centered card**:
  - Header: project title + milestone tag.  
  - Top row:
    - **Upload card** (PDF/image):
      - One button triggers: upload → OCR → analyze automatically.
      - Shows status messages through each step.
    - **Existing `file_id` card**:
      - Input to paste `file_id` returned by backend.
      - “Analyze” button: calls `/analyze` or falls back to `/analysis` if already cached.
  - Main content:
    - `<ChatWindow fileId={fileId} analysis={analysis} />`  
      (chat + fairness summary side by side inside the card).

### 3.3 Negotiation Assistant & Fairness Summary

File: `src/components/ChatWindow.jsx`

- **Left panel – Negotiation Assistant**
  - Chat bubbles (`MessageBubble.jsx`) with user/assistant alignment.
  - Textarea input.
  - Buttons:
    - **Send** → `intent: "chat"` (normal guidance).  
    - **Generate Email** → `intent: "email"` (asks backend for email draft).  
  - Shows helper text when conversation is empty.

- **Right panel – Fairness Summary**
  - Card showing:
    - `fairness.score` and `fairness.rating` with color (green/yellow/red).  
    - Detailed explanation string from backend (severity, fee count, ratio).  
    - Count of hidden fees and risk factors.  
    - Short list of top risky clauses.  
  - When `counter_email_draft` is present, displays it in a scrollable area for copy/paste.

CORS is configured in FastAPI to allow the React dev server (`localhost:5173`) to call backend APIs.

***

## 4. Testing & Validation

- **API Testing (Swagger/Postman)**:
  - Verified `upload → ocr → analyze → chat` flow across multiple sample contracts.  
  - Confirmed contracts with more severe penalties and multiple hidden fees receive lower scores and different ratings.

- **Edge Cases**:
  - Very long contracts: handled Groq’s “request too large” (413) by automatically truncating text and retrying.  
  - Missing analysis: `/chat` returns clear error until `/analyze` is run.  
  - Invalid LLM JSON: backend safely falls back and never crashes.

- **End‑to‑End Frontend**:
  - From React: upload contract, observe OCR + analysis status, view fairness summary, ask questions, and generate a professional counter‑offer email directly from the chatbot.
