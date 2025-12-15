# Manual Extraction Notes – Week 2

## Overview
This document describes the manual extraction process followed to create the labeled JSON fixtures.  
Each contract PDF was manually reviewed and mapped to the canonical schema defined in `schema.json` and SLA fields in `sla_fields.md`.

The goal of this task is to create **gold reference data** that can be used by backend and OCR teams for validation, testing, and demo purposes.  
Where the PDFs contained placeholders or missing values, realistic example values were used. Non-applicable fields were explicitly set to `null`.

---

## Summary of Extracted Contracts

| PDF File | Contract Type | Extraction Approach | Notes |
|--------|---------------|---------------------|-------|
| axisbank-loan-2025-01.pdf | Loan | Template-based manual labeling | PDF contained placeholders only |
| honda-loan-2024-07.pdf | Loan | Example-based manual extraction | Filled with realistic loan values |
| bmw-lease-2024-08.pdf | Lease | Lease-specific field extraction | Residual & mileage fields populated |
| signhouse-lease-2024-14.pdf | Lease | Dealer lease extraction | Wear & tear and usage limits included |
| tatacapital-loan-2024-03.pdf | Loan | Loan terms manual extraction | EMI and penalty terms populated |

---

## Detailed Manual Extraction – Axis Bank Loan

### Document Details
- **PDF Name:** axisbank-loan-2025-01.pdf  
- **Document Type:** Loan Cum Hypothecation Agreement  
- **Lender:** Axis Bank Ltd.  
- **Nature of Document:** Blank / template format

### Contract Metadata
- `contract_id`: Assigned as `axisbank-loan-2025-01` for test fixture identification.
- `contract_date`: Not filled in the document (blank date field).
- `vendor_source`: Axis Bank Ltd., identified from document header.

### Vehicle Information
- Vehicle-related fields such as make, model, year, VIN, and odometer appear as placeholders in the Schedule section.
- No actual vehicle values are present in the PDF.
- All vehicle fields were populated using example values in the JSON fixture.

### Customer Information
- Borrower name, address, and contact details are present only as placeholders.
- No real customer data is available.
- Example customer values were added for dataset labeling purposes.

### Dealer and Lender Information
- Lender is clearly specified as Axis Bank Ltd.
- Dealer details are referenced generically as “Supplier” without specific address information.
- Lender type is classified as `bank` based on document context.

### Financial Terms
- The agreement clearly indicates the contract is a **loan**.
- Fields such as loan tenure, EMI amount, interest rate, and financed amount are present as placeholders.
- Taxes and fees are mentioned generally (GST and stamp duty as applicable).
- Financial values were filled with realistic examples to support testing.

### Loan-Specific Terms
- Repayment is based on EMI structure.
- Prepayment and foreclosure charges are mentioned in the fee section.
- Late payment penalties and cheque return charges are defined.
- These rules were summarized and mapped into the `loan_terms` section.

### Lease Terms
- Lease-related fields are not applicable for this contract.
- All lease-specific fields were set to `null`.

---

## Extraction Method (Applied to All PDFs)

1. Opened each contract PDF and reviewed the header, schedule, and financial sections.
2. Identified relevant fields based on the canonical schema and SLA field definitions.
3. Manually populated JSON fields using extracted or realistic example values.
4. Marked missing or non-applicable fields explicitly as `null`.
5. Ensured consistent numeric formatting across all fixtures.

---

## Assumptions
- Example values were used only for dataset creation and testing.
- No real customer data was used.
- Financial calculations (such as total financed amount) were derived where necessary.

---

## User Story (Demo Preparation)

**User Story:**  
As a user, I want to upload a car loan or lease contract and receive a structured summary so that I can clearly understand vehicle details, financial terms, penalties, and lender information before proceeding.

**Pipeline Summary:**  
The uploaded PDF is processed through OCR, mapped to predefined SLA fields, and converted into a structured JSON output matching the Week-2 fixtures. This output is then used for validation, testing, and demonstration purposes.

---

## Conclusion
All five contract PDFs were manually reviewed and converted into structured JSON fixtures following the project schema.  
This labeled dataset serves as a reliable reference for backend validation, OCR evaluation, and pipeline demonstrations.
