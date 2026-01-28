-- Initialize contractdb database with required schema
-- This script runs automatically when the database container starts

-- Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
    id VARCHAR(255) PRIMARY KEY,
    file_path TEXT NOT NULL,
    text_path TEXT,
    extracted_text TEXT,
    ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    analysis_status VARCHAR(50) DEFAULT 'PENDING',
    extracted_data JSONB
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(analysis_status);
CREATE INDEX IF NOT EXISTS idx_contracts_ingested ON contracts(ingested_at DESC);

-- Grant permissions
GRANT ALL PRIVILEGES ON TABLE contracts TO admin;

-- Insert test data check
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM contracts LIMIT 1) THEN
        RAISE NOTICE 'Contracts table created and ready for data';
    END IF;
END $$;
