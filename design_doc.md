# Week 1: Design Phase

## Task 1: Database Schema
* **Entities:** Contracts (id, filename, upload_date, raw_text, extracted_data).
* **Schema Change:** Added `extracted_data` (JSONB) to store SLA fields.

## Task 2: API Design
* **Endpoint:** `POST /upload`
* **Input:** Multipart/Form-Data (PDF File)
* **Output:** JSON { "message": "Success", "id": "..." }
