# Manual Extraction for axisbank-loan-2025-01.pdf

This document provides a manual extraction of key contract fields based on the canonical schema (`sla_fields.md`).

The target PDF is a **Loan Cum Hypothecation Agreement** from AXIS Bank Ltd. The provided sample is a blank template, so this extraction focuses on confirming field locations, schema mapping, and parser logic, rather than retrieving specific values.

---

## 1. Contract Metadata

| Field | Value | Extraction Location |
| :--- | :--- | :--- |
| **contract_id** | `axisbank-loan-2025-01` | Assigned for test fixture naming |
| **contract_date** | Not available | Blank “D M Y” field on Schedule – Page 11 |
| **vendor_source** | AXIS Bank Ltd. | Page 1 header |

---

## 2. Vehicle Information (Location: Schedule, Page 12)

| Field | Value | Extraction Status |
| :--- | :--- | :--- |
| **make** | Not available | Placeholder in Schedule |
| **model** | Not available | Placeholder in Schedule |
| **year** | Not available | Not a labeled field, inferred from context |
| **vin** | Not available | Placeholder in Schedule as 'Chassis No.' |
| **odometer** | Not applicable | Not provided in the contract structure |

---

## 3. Customer Information (Location: Schedule, Page 11)

| Field | Value | Extraction Status |
| :--- | :--- | :--- |
| **name** | Not available | Placeholder as Name of Borrower(s) |
| **address** | Not available | Placeholder as Address(es) of Borrower(s) |
| **phone** | Not available | Placeholder as Tel./E-Mail |

---

## 4. Dealer / Lender Information

| Field | Value | Extraction Location |
| :--- | :--- | :--- |
| **dealer_name** | Not available | Referred to as “Supplier” in Clause 4 |
| **dealer_address** | Not provided | Not a specific field in the template |
| **lender_name** | AXIS Bank Ltd. | Page 1 header |
| **lender_type** | bank | Derived from context: "Banking Company under Banking Regulation Act, 1949" |

---

## 5. Financial Terms (Location: Schedule, Page 11 & Clauses)

| Field | Value | Extraction Status |
| :--- | :--- | :--- |
| **contract_type** | loan | Derived from "Loan Cum Hypothecation Agreement" |
| **vehicle_price** | Not available | Not a field on the Schedule |
| **down_payment** | Not provided | Not a field on the Schedule |
| **interest_rate** | Not available | Placeholder in Schedule |
| **apr** | Not explicitly stated separately | Not a labeled field, typically inferred |
| **loan_term_months** | Not available | Placeholder in Schedule as 'Tenor in Months' |
| **monthly_payment** | Not available | Placeholder in Schedule as 'EMI Amount' |
| **total_payable_amount** | Not provided | Not a specific field in the template |
| **balloon_payment** | Not applicable | Standard loan amortization used |
| **taxes_and_fees** | GST applicable on all fees; Stamp Duty “As applicable” | Extracted from Fee Schedule (Page 11) |

---

## 6. Lease-Specific Terms (N/A for Loan)

| Field | Value |
| :--- | :--- |
| **residual_value** | N/A |
| **mileage_limit_per_year** | N/A |
| **excess_mileage_fee** | N/A |
| **wear_and_tear_policy** | N/A |

---

## 7. Loan-Specific Terms (Location: Clauses & Fee Schedule, Page 11)

| Field | Value | Extraction Location |
| :--- | :--- | :--- |
| **amortization_type** | EMI (Equated Monthly Installments) | Clause 5.1 |
| **prepayment_penalty** | 5% of Principal Outstanding (Foreclosure) or 5% of Part Payment Amount + GST | Fee Schedule (Page 11, Clause 5.5) |
| **late_fee_rules** | Penal/Default interest (rate defined in Schedule). Cheque return fee: ₹500 per instance. | Fee Schedule (Page 11, Clause 5.3) |

---

## 8. Pipeline Flow & Summary

### User Story
As a user, I want to upload my car loan/lease contract PDF and receive a structured summary so that I can clearly understand the financial terms, lender details, and important obligations before signing.

| Pipeline Flow | Description |
| :--- | :--- |
| **User uploads the PDF** | The contract file is submitted via `/upload` endpoint. |
| **File gets saved** | The backend stores the file (local/S3) and returns `file_id`. |
| **OCR is triggered** | `/ocr/{file_id}` extracts all pages into raw text. |
| **Text is saved to DB** | Stored in the contracts table along with metadata. |
| **Schema mapping phase** | Extracted text is parsed and mapped according to `sla_fields.md`. |
| **Final structured JSON produced** | The system outputs a JSON matching the exact format used in the Week 2 fixtures (passing acceptance smoke tests). |