# System Architecture — AI Lease & Loan Contract Assistant

## 1. Project Overview

The AI Lease & Loan Contract Assistant is a document intelligence system designed to extract, validate, and structure critical information from lease and loan agreement PDFs using a combination of rule-based extraction, backend services, and AI-powered models.

The system is built in modular phases to allow manual verification, dataset creation, AI training, and scalable backend deployment.

## 2. High-Level System Architecture

The system follows a layered architecture consisting of Presentation Layer, Backend API Layer, Processing Layer, and Data Storage Layer.

## 3. Core System Components

### 3.1 Frontend (Future Phase)

The frontend will allow users to upload contract PDFs, view extracted data, and verify results before final submission.

### 3.2 Backend API (Node.js + Express)

The backend acts as the central orchestrator, handling file uploads, validation logic, API routing, authentication, and communication between the frontend and AI processing services.

### 3.3 Processing Layer (OCR & AI Services)

The Processing Layer is responsible for converting unstructured contract documents into machine-readable text and extracting meaningful structured information from it.

This layer operates independently from the backend API and can be implemented as separate services to allow scalability and future AI model upgrades.

The processing workflow begins with Optical Character Recognition (OCR) to extract raw text from scanned or digitally generated PDFs.

Extracted text is then passed through rule-based parsers and AI-assisted extraction logic to identify predefined contract fields such as loan amount, interest rate, tenure, and parties involved.

The extracted values are validated against the predefined schema and verification checklist to ensure correctness, completeness, and consistency.

Any extraction failures or confidence mismatches are flagged and sent back to the backend for manual review or correction.

This layer is designed to support future model training using the manually curated gold datasets generated during earlier project phases.


### 3.4 Data Storage Layer

The Data Storage Layer is responsible for persisting raw documents, extracted structured data, validation results, and system metadata.
A document-oriented database is used to store extracted contract data due to its flexible schema and natural alignment with JSON-based outputs.

MongoDB is selected as the primary database for storing structured extraction results, verification status, and processing logs.

Raw contract PDFs are stored separately from extracted data to ensure traceability, auditability, and reprocessing capability.

The storage layer is designed to support versioning of extracted data, enabling comparison between manual, rule-based, and AI-generated outputs.

All stored data is accessed exclusively through the backend API to maintain data integrity, security, and access control.

## 4. High-Level Data Flow
This section describes the end-to-end flow of data from the moment a contract PDF is uploaded until structured information is produced and stored.

The data flow is designed to be sequential, traceable, and auditable to support accuracy, verification, and future model training.

The flow begins when a user uploads a lease or loan agreement PDF through the frontend interface.

The uploaded PDF is sent to the backend API, where it is received, validated, and temporarily stored for processing.

The backend forwards the document to the Processing Layer, which performs OCR to extract raw textual content from the PDF.

The extracted text is analyzed using rule-based logic and AI-assisted extraction techniques to identify predefined contract fields.

Extracted values are validated against the predefined schema and verification checklist to ensure accuracy and completeness.

Validated structured data is then stored in the database, while the raw PDF is preserved separately for traceability and reprocessing.


Finally, the processed and validated information is returned to the frontend for user review, confirmation, or correction.

This structured flow ensures transparency, controllability, and continuous improvement across the system lifecycle.

## 5. Deployment Architecture
The system is designed to be deployed using a modular and scalable architecture, allowing individual components to be deployed, updated, and scaled independently.

The backend API is deployed as a Node.js application, running on a server environment capable of handling HTTP requests, file uploads, and database communication.

The Processing Layer can be deployed as a separate service, enabling OCR and AI workloads to run independently from the backend API.

Communication between the backend API and the Processing Layer is handled through well-defined service interfaces or internal APIs.

The database is deployed as a managed or self-hosted service, ensuring persistent storage, backups, and data reliability.

All components are designed to run initially on a single deployment environment and later be separated into distributed services as system usage grows.

Environment configuration, secrets, and system parameters are managed externally to avoid hardcoding sensitive information into the codebase.

This deployment approach ensures the system remains maintainable, secure, and adaptable to future functional and scale-related requirements.

## 6. Security Considerations
Security is treated as a core architectural concern throughout the system rather than an afterthought added during implementation.

All access to stored data is routed through the backend API, preventing direct interaction between external clients and the database.

User authentication and authorization mechanisms are enforced at the backend layer to ensure that only permitted users can upload, view, or modify contract data.

Uploaded documents are validated for file type, size, and content structure to prevent malicious file uploads and system misuse.

Sensitive configuration values such as database credentials and API keys are stored using environment variables rather than being hardcoded into the application.

Communication between system components is designed to occur over secure channels to reduce the risk of data interception or tampering.

Processing errors, extraction failures, and validation issues are logged securely without exposing sensitive document content to unauthorized parties.

This security-focused design ensures data confidentiality, integrity, and controlled access across the entire system lifecycle.

## 7. Scalability and Future Scope

The system architecture is intentionally designed to support incremental scalability without requiring major structural changes.

As the number of users and documents increases, backend services can be scaled independently to handle higher request volumes.

The Processing Layer is designed to scale separately, allowing OCR and AI workloads to be distributed across multiple processing instances if required.

Future versions of the system can incorporate trained machine learning models using the curated gold datasets generated during earlier phases.

Additional contract types, languages, and document formats can be supported by extending the schema definitions and extraction logic.

Advanced features such as confidence scoring, audit dashboards, role-based access control, and automated verification can be added without disrupting the core architecture.

The architecture also allows integration with external systems such as enterprise document management platforms or analytics tools in future deployments.

This scalable and forward-looking design ensures the system remains relevant, adaptable, and extensible as requirements evolve.

