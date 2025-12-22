# Intern B — Database Schema Design

## Purpose
This document defines the database structure used by the backend
to store uploaded contracts, OCR results, AI outputs, and processing states.

## Core Design Decision
One database record represents one uploaded contract document.


## Collection Name
contracts
Each uploaded contract is stored as one document in the`contracts` collection.

---
### _id
- Type: ObjectId
- Description: Unique identifier automatically generated for each contract document.

### original_file_name
- Type: String
- Description: Name of the uploaded contract file as provided by the user.

### file_type
- Type: String
- Description: File format of the uploaded document (for example, pdf).

### upload_timestamp
- Type: Date
- Description: Date and time when the contract file was uploaded to the backend.

### ocr_status
- Type: String
- Allowed Values: pending | success | failed
- Description: Current status of the OCR processing for the uploaded contract.

### extracted_text
- Type: String
- Description: Raw text extracted from the contract document after OCR processing.

### ai_processing_status
- Type: String
- Allowed Values: not_started | processing | completed | error
- Description: Current status of AI-based analysis on the extracted contract text.

### extracted_fields
- Type: Object
- Description: Structured key-value data extracted from the contract by AI, such as loan amount, interest rate, and tenure.

### confidence_scores
- Type: Object
- Description: Confidence scores assigned by AI for each extracted field.

### processing_logs
- Type: Array of Objects
- Description: Internal logs capturing each processing step with status and timestamp.

### created_at
- Type: Date
- Description: Timestamp when the contract record was created.

### updated_at
- Type: Date
- Description: Timestamp when the contract record was last updated.


