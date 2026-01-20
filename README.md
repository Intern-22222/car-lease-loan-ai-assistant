# car-lease-loan-ai-assistant
Car Lease/Loan Contract Review and Negotiation AI Assistant
<br>
AI assistant to review car lease/loan contracts, extract key terms, compare market prices &amp; assist with negotiation using LLMs and public vehicle data.

 Intern D <br>
 Inter Name: Soundarya R <br>
 Batch: D2 <br>

 
# Milestone 1 — Setup & Infra
Focus: docker-compose, infra (local DB), test harness, CI skeleton, demo scripts.

Run Commands
Spin up backend + DB:   docker-compose up --build

Shut down containers:   docker-compose down

Run backend locally:    uvicorn backend.main:app --reload

# Milestone 2 — Smoke Tests & OCR Quality
Tasks:
Task 1: Test workflow by hitting endpoints and performing smoke tests.
Task 2: Quality check OCR by spotting errors and reporting bugs.

Run Commands
Smoke test (upload → OCR → response):    python scripts/smoke_test.py

Compare OCR vs ground truth:    python scripts/compare_ocr.py samples/contract1_ocr.txt samples/contract1_gt.txt

# Milestone 3 — User Flow Testing
Goal: Conduct testing with sample user flows to ensure the upload‑to‑results process is bug‑free.

Run Commands
End‑to‑end test:   

#  Milestone 4 — Deep QA
Tasks:
Collect diverse contract samples for parser stress testing.
Unit test pricing functions and scoring logic accuracy.
Execute end‑to‑end user flow tests and log bugs.
Verify LLM output to prevent fee hallucinations.

Run Commands
Run all unit tests:   pytest tests/test_pricing.py 
Check scoring logic:   pytest tests/test_scoring.py 
Verify no hallucinations: pytest tests/test_llm.py



