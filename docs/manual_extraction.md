# Intern A — Product & Data Lead: Manual Extraction Guide (Milestone 1)

## Purpose
This document defines the standard process for manually extracting lease or loan contract data and recording evidence before any automation or model-based extraction is introduced.

The goal of this process is to create high-quality, verifiable ground-truth data that can be safely used for validation, training, and downstream system development.

## Scope of Manual Extraction

Manual extraction applies only to the fields defined in `docs/sla_fields.md` and constrained by `docs/schema.json`.

No additional fields may be introduced during manual extraction without updating the schema and field definitions.

## Evidence-Based Extraction Rule
Every extracted value must be supported by explicit evidence from the source contract.
Evidence must include the source page number and the exact clause text from which the value was derived.

## Manual Extraction Template
For each contract, the following information must be recorded for every extracted field:

- Contract Identifier
- Field Name
- Extracted Value
- Source Page Number
- Source Clause Text
- Notes or Interpretation (if applicable)

## Handling Missing or Unclear Information
If a field value cannot be confidently determined from the contract text, it must be recorded as null.
The reason for missing or unclear values must be documented in the notes field.

## Output Artifacts
Manual extraction will result in:
- Completed manual extraction records for each contract
- Corresponding normalized `.gold.json` files conforming to `docs/schema.json`

## Phase Discipline
No automated extraction, OCR, or machine learning logic is permitted during this phase.
This document must be completed and followed before proceeding to Intern A Week 2 or any backend implementation.

## Notes
This document should be reviewed together with `docs/sla_fields.md`, `docs/schema.json`, and `docs/verification_checklist.md`.


