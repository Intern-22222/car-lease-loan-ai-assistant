# Data Flow Diagram (DFD) Explanation

## Overview

This document explains the Data Flow Diagram (DFD) created in Phase 2 for the AI Lease / Loan Contract Assistant project. The goal of this document is to clearly describe how data moves through the system, starting from the user uploading a contract document to the storage of extracted text and structured data.

This explanation is written to support design reviews, academic evaluation, and future implementation phases.

---

## DFD Level

The diagram represents a **Level 1 Data Flow Diagram**.

At this level:

- The system is treated as a single logical unit
- External entities, data stores, and data flows are clearly defined
- Internal implementation details (code, frameworks) are intentionally omitted

---

## External Entity

### User (Borrower / Reviewer)

The user is the primary external entity interacting with the system.

The user performs the following actions:

- Uploads a lease or loan contract document (PDF)
- Views the extracted and processed contract information

The user does not directly interact with internal services such as the OCR engine or database.

---

## Main System

### AI Lease / Loan Contract Assistant

This component represents the complete backend system as a single logical process.

The system is responsible for:

- Receiving uploaded contract documents
- Coordinating document processing
- Communicating with the OCR service
- Storing extracted text and structured data
- Returning processed results to the user

At the DFD level, all internal services are abstracted into this single system block.

---

## Data Stores

### Raw Contracts (PDF Storage)

This data store holds the original contract documents uploaded by the user.

Purpose:

- Preserve the original contract for traceability
- Allow reprocessing if extraction logic changes
- Support auditing and verification

Only the backend system can write to or read from this storage.

---

### Extracted Data (JSON Output)

This data store contains the processed outputs of the system.

Stored data includes:

- Raw OCR-extracted text
- Manually validated data
- Gold-standard structured JSON
- Future AI-extracted contract fields

This data is later used for analysis, validation, and AI processing.

---

### Validation & Audit Logs

This data store records quality checks and verification results.

It includes:

- Validation checklist outcomes
- Error logs
- Review and audit metadata

This ensures transparency, debugging support, and academic review readiness.

---

## Data Flows

### User to System — Upload Contract PDF

The user uploads a contract document to the system.

This data flow represents the initial input entering the system.

---

### System to Raw Contracts — Store Original PDF

After receiving the document, the system stores the original PDF in raw storage.

This ensures the original document is always preserved.

---

### System to Extracted Data — Extract Structured Fields

The system processes the contract document and generates extracted text and structured data.

The processed output is stored in the extracted data store.

---

### System to Validation & Audit Logs — Verification and QA Results

During processing, the system records validation results and quality checks.

These results are saved for auditing and debugging purposes.

---

### System to User — Display Extracted Data

After processing is complete, the system returns the extracted and validated data to the user for viewing.

---

## Conclusion

This Data Flow Diagram and its explanation establish a clear, technology-agnostic understanding of how data moves through the AI Lease / Loan Contract Assistant system.

The diagram serves as a foundation for:

- Service-level flow design
- Database schema design
- API implementation
- OCR integration
- Deployment planning
