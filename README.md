# Car Lease Contract Review Backend - Week 2 Implementation
## Intern B: Document Upload API + OCR + Data Storage

**Implemented by**: Harshitha Javvadi

**Status**: ✅ **Complete - End-to-end flow working**

---

## 🎯 Assigned Tasks (Week 2)

| Day | Task | Status |
|-----|------|--------|
| **6-7** | `POST /upload`: Multipart file upload → Local/S3 storage (env config) | ✅ |
| **8** | `POST /ocr/{file_id}`: Trigger OCR worker (synchronous OK for PoC) | ✅ |
| **9-10** | Persist extracted text to DB `contracts` table (`file_id`, `s3_path`, `raw_text`, `ingested_at`) | ✅ |

**Acceptance Criteria**: Upload file → `/ocr` → DB record with `raw_text` stored → **PASS**

---

## 🏗️ Project Structure

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



---

## 🚀 Quick Start

1. Start Postgres
cd infra && docker-compose up -d db

2. Install dependencies
cd .. && python -m venv .venv
source .venv/bin/activate # Windows: .venv\Scripts\activate
pip install -r requirements.txt

3. Run API
uvicorn app.main:app --reload


**API available at**: http://127.0.0.1:8000/docs

---

## 🔄 End-to-End Flow

Upload PDF/Image → POST /upload

↓

File saved to data/ + DB record created 

↓ (returns file_id)

POST /ocr/{file_id}

↓

OCR extracts text → raw_text + ingested_at saved to DB

↓

Returns full extracted text


### Demo Commands

Upload contract : 
curl -F "file=@sample_contract.pdf" http://127.0.0.1:8000/upload

→ {"file_id": "abc123...", "filename": "sample_contract.pdf"}

Extract text : 
curl -X POST "http://127.0.0.1:8000/ocr/abc123..."

→ {"file_id": "abc123...", "text_extracted": true, "full_text": "Vehicle Sale Agreement..."}


---

## 📋 API Endpoints

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/health` | GET | Health check | `{"status": "ok"}` |
| `/upload` | **POST** | Upload PDF/image | `{"file_id": "...", "filename": "..."}` |
| `/ocr/{file_id}` | **POST** | Run OCR → Store text | `{"full_text": "Vehicle Sale Agreement...", ...}` |

**Swagger UI**: http://127.0.0.1:8000/docs

---

## 🗄️ Database Schema

**`contracts` table** (auto-created by SQLAlchemy):

CREATE TABLE contracts (
id INTEGER PRIMARY KEY,

file_id VARCHAR UNIQUE NOT NULL,

filename VARCHAR NOT NULL,

s3_path VARCHAR,

raw_text TEXT,

ingested_at TIMESTAMP

);


**Sample record after OCR**:
file_id: "48365ed9-6d42-478c-9a13-24cd18995b4f"
s3_path: "data/48365ed9-6d42-478c-9a13-24cd18995b4f.pdf"
raw_text: "Vehicle Sale Agreement\nThis agreement made..." (2601 chars)
ingested_at: "2025-12-29 13:50:00"


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

**DB Verification**:
SELECT file_id, LENGTH(raw_text), ingested_at FROM contracts ORDER BY id DESC LIMIT 3;


---

## 🔧 Environment Configuration

**.env**:

DATABASE_URL=postgresql://user:password@localhost:5432/contract_db

STORAGE_BACKEND=local

LOCAL_DATA_DIR=./data


**Dependencies** (`requirements.txt`):
fastapi uvicorn[standard] SQLAlchemy psycopg2-binary python-multipart
python-dotenv pydantic Pillow pytesseract PyMuPDF


---

## 🎉 Deliverables Completed

| Deliverable | Status | Evidence |
|-------------|--------|----------|
| `backend/app/main.py` with `/upload` & `/ocr/{file_id}` | ✅ | [main.py](app/main.py) |
| ORM models updated (`raw_text`, `ingested_at`) | ✅ | [models.py](app/models.py) |
| End-to-end flow: upload → OCR → DB | ✅ | Curl outputs + DB query |

---

*Last updated: Dec 29, 2025* 
