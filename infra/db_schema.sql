-- Initial Schema for Car Lease Assistant

CREATE TABLE contracts (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    raw_text TEXT,  -- <--- NEW: We added this to store the OCR text
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending'
);

CREATE TABLE extracted_fields (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER REFERENCES contracts(id),
    field_name VARCHAR(100),
    field_value TEXT,
    confidence_score FLOAT
);