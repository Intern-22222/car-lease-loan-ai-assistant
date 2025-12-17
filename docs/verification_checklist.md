# Milestone 1 & 2 Verification Checklist: QA & Integrations (Intern D)

This document tracks the completion of infrastructure, security, and automation tasks for the Car Lease/Loan AI Assistant project.

## 1. Infrastructure & Environment (Week 1)
- [x] [cite_start]**`infra/docker-compose.yml`** successfully orchestrates a PostgreSQL database and a FastAPI backend stub[cite: 201].
- [x] [cite_start]**Postgres Service** is ready to accept connections on port `5432`[cite: 201, 207].
- [x] [cite_start]**Backend Stub** is accessible at `http://localhost:8000/docs` and returns a 200 status on the `/health` endpoint[cite: 190, 207].

## 2. CI/CD & Repository Standards (Week 1)
- [x] [cite_start]**`.github/workflows/ci.yml`** skeleton created to automate dependency installation and code linting[cite: 202].
- [x] [cite_start]**`PULL_REQUEST_TEMPLATE.md`** established to standardize code submissions from all interns[cite: 203].
- [x] [cite_start]**GitHub Actions** successfully triggers a build on every push to the repository[cite: 205].

## 3. Automation & Testing (Week 2)
- [x] [cite_start]**`scripts/smoke_test.sh`** successfully executes locally, verifying the `/health`, `/upload`, and `/ocr` endpoints in sequence[cite: 236, 239].
- [x] [cite_start]**`tests/test_api_upload.py`** (pytest) provides automated verification for the backend upload logic[cite: 237, 240].
- [x] [cite_start]**CI Pipeline Updated** to automatically execute the pytest suite and smoke test on every pull request.

## 4. Environment Hardening & Security (Week 2)
- [x] [cite_start]**`.env` file created** to store sensitive database credentials and connection strings locally (added to `.gitignore`)[cite: 238].
- [x] [cite_start]**`docker-compose.yml` hardened** to use `${VARIABLE}` syntax, injecting secrets from the `.env` file into containers[cite: 238].

---

## Team Progress (Other Interns)
*Note: These items should be checked as team members deliver their work.*

### Intern A — Product / Data Lead
- [ ] [cite_start]15 sample lease/loan contracts collected in `samples/`[cite: 177, 179].
- [ ] [cite_start]Canonical SLA field dictionary and JSON schema defined[cite: 178].
- [ ] [cite_start]Labeled dataset of 5 contracts for test fixtures[cite: 212].

### Intern B — Backend Engineer
- [ ] [cite_start]FastAPI backend scaffold and DB schema initialized[cite: 185, 186].
- [ ] [cite_start]`POST /upload` implemented to accept multipart files[cite: 220, 223].
- [ ] [cite_start]`POST /ocr/{file_id}` endpoint triggers the OCR service[cite: 221, 223].

### Intern C — OCR & Preprocessing Engineer
- [ ] [cite_start]OCR script for PDF to Text conversion (`ocr/test_ocr.py`)[cite: 194, 195].
- [ ] [cite_start]Optimized OCR module supporting multi-page PDFs and text cleanup[cite: 228, 231].
- [ ] [cite_start]Integration of OCR function into backend services[cite: 229].

---

