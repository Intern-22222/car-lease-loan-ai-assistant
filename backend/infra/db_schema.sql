-- Initial Schema for Car Lease Assistant (for reference only)

CREATE TABLE IF NOT EXISTS contracts (
    id SERIAL PRIMARY KEY,
    file_id VARCHAR(255) UNIQUE NOT NULL,
    filename VARCHAR(255) NOT NULL,
    s3_path VARCHAR(500),
    text_path VARCHAR(500),
    raw_text TEXT,
    ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS extracted_fields (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER REFERENCES contracts(id),
    field_name VARCHAR(100),
    field_value TEXT,
    confidence_score FLOAT
);
