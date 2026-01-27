CREATE TABLE contracts (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  raw_text TEXT
);

CREATE TABLE extracted_fields (
  id SERIAL PRIMARY KEY,
  contract_id INT REFERENCES contracts(id),
  field_name VARCHAR(255),
  field_value TEXT
);

CREATE TABLE files_metadata (
  id SERIAL PRIMARY KEY,
  contract_id INT REFERENCES contracts(id),
  file_size INT,
  file_type VARCHAR(100)
);
