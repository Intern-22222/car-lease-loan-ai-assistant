# Week 1: Design Phase - System Architecture

**Role:** Intern B (Backend)
**Topic:** Database Schema & API Design

---

## Task 1: Database Schema Design

### 1. Entities & Fields
The core entity for this project is the **Contract**.
Based on the requirements, for now we need to store three types of data:

* **Metadata:** `id` (Unique Identifier), `filename`, `upload_date`.
* **Raw Content:** `raw_text` (The plain text output from the OCR engine).
* **SLA Fields:** `extracted_data` (A JSON container to hold future AI-extracted fields like APR, monthly_payment, lease_term).

### 2. SQL Schema Blueprint
The following SQL command is creating the `contracts` table in PostgreSQL:

```sql
CREATE TABLE contracts (
    id SERIAL PRIMARY KEY,                      -- Unique ID (UUID/Serial)
    filename VARCHAR(255) NOT NULL,             -- Metadata
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Metadata
    
    raw_text TEXT,                              -- Raw Content from OCR
    
    extracted_data JSONB,                       -- SLA Fields (JSON placeholder for AI data)
    
    status VARCHAR(50) DEFAULT 'pending'        -- Tracking status
);