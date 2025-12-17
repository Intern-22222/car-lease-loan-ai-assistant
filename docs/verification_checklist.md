# Milestone 1 Verification Checklist

## Infrastructure & Environment (Intern D)
- [ ] [cite_start]`infra/docker-compose.yml` successfully builds and starts Postgres and Backend[cite: 41, 44].
- [ ] [cite_start]GitHub Actions CI skeleton runs successfully on push[cite: 39, 42].
- [ ] [cite_start]Backend `/health` endpoint returns a 200 status code[cite: 27, 44].

## Data & Requirements (Intern A)
- [ ] [cite_start]`docs/requirements.md` is complete[cite: 13].
- [ ] [cite_start]15 sample contracts collected in `samples/` folder[cite: 14, 16].
- [ ] [cite_start]SLA field dictionary and JSON schema defined[cite: 15, 17].

## Backend & API (Intern B)
- [ ] [cite_start]FastAPI scaffold initialized with `requirements.txt`[cite: 22, 25].
- [ ] [cite_start]Initial DB schema or ORM models created[cite: 23].
- [ ] [cite_start]`/upload` placeholder endpoint exists[cite: 24, 60].

## OCR & Preprocessing (Intern C)
- [ ] [cite_start]Tesseract and Poppler installation steps documented in `docs/run_local.md`[cite: 30, 33].
- [ ] [cite_start]`ocr/test_ocr.py` successfully converts PDF to text[cite: 31, 32].
- [ ] [cite_start]Output sample saved in `data/sample_ocr.txt`[cite: 31, 34].