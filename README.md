# Contract SLA Extraction – Backend Milestones (Intern D)

This repository contains the backend implementation and integration work completed across Weeks 1–3 as part of the internship milestones. The focus was on backend infrastructure, data preparation, OCR-based contract parsing, and dashboard integration.

---

## Week 1: QA, Integrations & Infrastructure

**Focus:** DevOps basics, backend stability, testing readiness

### ✅ Completed Tasks
- Set up backend project structure using **FastAPI**
- Configured local infrastructure:
  - Local file storage for uploaded documents
  - OCR dependencies (Tesseract, Poppler)
- Verified OCR pipeline for both **PDF** and **image** contracts
- Ensured backend runs reliably using **Uvicorn**
- Prepared the codebase to be Docker-ready (docker-compose friendly structure)
- Established a base suitable for:
  - Test harness integration
  - CI/CD skeleton
  - Demo and evaluation scripts

---

### Week 2: QA, Testing & CI Integration

### ✅ Completed Tasks
- Created automated smoke-test script to validate document upload and OCR flow.
- Implemented minimal API tests using pytest for `/upload` and `/ocr` endpoints.
- Hardened docker-compose configuration to use environment variables for secrets and database connectivity.
- Integrated test execution into CI to run API tests and smoke tests automatically.

**Deliverables:**
- `scripts/smoke_test.sh`
- `tests/test_api_upload.py`
- CI job running pytest and smoke tests

**Status:** Completed


---

## Week 3: API Integration & Dashboard View

**Focus:** End-to-end backend integration

### ✅ Completed Tasks
- Connected **document upload API** to the backend processing pipeline
- Integrated OCR processing directly with uploaded documents
- Maintained extracted SLA data in backend memory for access by other endpoints
- Built a backend **dashboard view** using Jinja2 templates to display:
  - APR
  - Monthly Payment
  - Term
- Ensured dashboard dynamically reflects the **latest uploaded and processed contract**
- Enabled seamless handoff for frontend (React) integration

> Note: UI-heavy dashboard implementation is handled by a separate frontend task.  
> This backend dashboard validates data flow, extraction accuracy, and API readiness.

---

## Technologies Used
- **FastAPI** – Backend framework
- **Tesseract OCR** – Text extraction
- **pdf2image + Poppler** – PDF processing
- **Jinja2** – Backend dashboard templating
- **Python Regex** – SLA field extraction

---

## Current Status
✅ All assigned milestones (Weeks 1–3) have been completed successfully  
✅ Backend is fully functional and frontend-ready  
✅ SLA extraction verified with real contract data

---

## How to Run
```bash
uvicorn main:app --reload ```

