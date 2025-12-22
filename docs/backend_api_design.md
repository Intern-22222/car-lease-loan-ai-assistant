### API 1 — Upload Contract PDF

- Endpoint: POST /api/contracts/upload
- Purpose: Accept a PDF file from the frontend and initiate contract creation.
- Request Type: multipart/form-data
- Request Body:
  - file (PDF)
- Success Response:
  {
  "success": true,
  "contract_id": "<generated_id>",
  "message": "PDF uploaded successfully"
  }
- Error Response:
  {
  "success": false,
  "message": "Upload failed"
  }

### API 2 — Extract Text via OCR

- Endpoint: POST /api/contracts/extract-text
- Purpose: Send the uploaded PDF to the OCR service and extract raw text.
- Request Type: application/json
- Request Body:
  {
  "contract_id": "<existing_contract_id>"
  }
- Success Response:
  {
  "success": true,
  "extracted_text": "<raw_text>"
  }
- Error Response:
  {
  "success": false,
  "message": "OCR extraction failed"
  }

### API 3 — Save Extracted Text

- Endpoint: POST /api/contracts/save-text
- Purpose: Persist OCR-extracted raw text into the database for future processing.
- Request Type: application/json
- Request Body:
  {
  "contract_id": "<existing_contract_id>",
  "extracted_text": "<raw_text>"
  }
- Success Response:
  {
  "success": true,
  "message": "Extracted text saved successfully"
  }
- Error Response:
  {
  "success": false,
  "message": "Failed to save extracted text"
  }

### API 4 — Get Contract Details

- Endpoint: GET /api/contracts/:id
- Purpose: Retrieve stored contract information using the contract ID.
- Request Type: URL parameter
- Request Params:
  - id (contract_id)
- Success Response:
  {
  "success": true,
  "data": {
  "contract_id": "<id>",
  "document_type": "loan | lease",
  "extracted_text": "<stored_text>",
  "created_at": "<timestamp>"
  }
  }
- Error Response:
  {
  "success": false,
  "message": "Contract not found"
  }

### API 5 — Health Check

- Endpoint: GET /api/health
- Purpose: Verify that the backend server is running and reachable.
- Request Type: None
- Success Response:
  {
  "status": "OK"
  }
- Error Response:
  {
  "status": "DOWN"
  }
