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
