# Week 2 — Intern A

## Manual & Gold Dataset Creation for Loan Contracts

---

## 1. Objective

The objective of **Week 2 — Intern A** is to create a **clean, structured, and review-ready dataset** from loan-related contract PDFs.

This includes:

- defining extractable business fields
- performing manual (human-truth) extraction
- creating gold (machine-truth) normalized outputs
- validating consistency across documents

No model training or backend work is performed in this phase.

---

## 2. Scope of Work

### In Scope

- Manual extraction from PDFs into structured JSON
- Gold extraction with normalized numeric values
- Handling null-heavy legal templates correctly
- Maintaining strict schema consistency

### Out of Scope

- Model training
- CSV generation
- Evidence annotation
- Clause-level NLP
- Backend APIs

---

## 3. Dataset Overview

### Total PDFs Processed: 5

| PDF No. | Document Name                 |
| ------- | ----------------------------- |
| 1       | Secured Loan (Bank Guarantee) |
| 2       | MSE Loan Agreement            |
| 3       | Synthetic Home Loan Agreement |
| 4       | Synthetic MSE Loan Agreement  |

The dataset intentionally includes:

- template-style contracts (mostly null values)
- synthetic contracts with filled numeric values

This reflects real-world document variability.

---

## 4. Directory Structure

dataset/
├── manual_extraction/
│ ├── secured_loan_bank_guarantee_01.manual.json
│ ├── mse_loan_agreement_01.manual.json
│ ├── synthetic_home_loan_agreement_01.manual.json
│ └── synthetic_mse_loan_agreement_01.manual.json
│
├── gold_extraction/
│ ├── secured_loan_bank_guarantee_01.gold.json
│ ├── mse_loan_agreement_01.gold.json
│ ├── synthetic_home_loan_agreement_01.gold.json
│ └── synthetic_mse_loan_agreement_01.gold.json
│
└── raw_contracts/
└── (source PDF files)

## 5. Manual Extraction Format

Each `*.manual.json` file contains **exactly two top-level sections**:

```json
{
  "contract_metadata": { ... },
  "extracted_fields": { ... }
}
contract_metadata
Identifies the document and provides traceability.

Fields:

contract_id

source_file

document_type

lender_name

borrower_name

extracted_fields
Contains business fields extracted from the document.

Values are either:

human-readable strings (for present values)

null (when values are not explicitly stated)

No nested objects or evidence metadata are included at this stage.

## 6. Gold Extraction Format
Each *.gold.json file is a flat, machine-readable representation of the same data.

Key characteristics:

All numeric values are normalized

Currency symbols, text, and units are removed

Missing values remain null

contract_id is always present


## 7. Field List

The following fields are defined and consistently used across all documents:

- loan_amount
- interest_rate
- tenure
- repayment_schedule
- emi_amount
- security_type
- security_value
- prepayment_penalty
- late_payment_penalty
- default_clause
- governing_law
- jurisdiction

Not all fields are present in all documents.
Explicit absence is recorded as `null`.

---

## 8. Validation Process

Validation was performed through:

- File presence and naming checks
- Structural consistency verification
- Manual ↔ gold value alignment
- Numeric normalization checks
- Null correctness verification

No automated scripts were used at this stage.

---

## 9. Key Design Decisions

The following design decisions were made intentionally:

- Null is treated as valid data, not missing work
- Evidence text is excluded from the dataset layer
- Flat schemas are preferred over nested structures
- Manual extraction precedes gold extraction
- All PDFs are processed individually, even if template-like

These decisions ensure:

- ML safety
- Backend compatibility
- Auditability
- Extensibility in later phases


## 10. Outcome
At the end of Week 2 — Intern A:

All PDFs have complete manual and gold JSON files

The dataset is schema-consistent and review-ready

The foundation is prepared for backend integration and model training in later phases

```
