# Intern A — Product & Data Lead: Verification Checklist (Milestone 1)

## Purpose

This document provides a verification checklist to ensure that Intern A’s Milestone 1 deliverables are complete, consistent, and ready for acceptance review.

The checklist is intended to be used by mentors, reviewers, or QA evaluators before marking Milestone 1 as accepted.


## Verification Scope
This checklist applies only to Intern A’s Milestone 1 outputs, including documentation, schema design, and project structure.
Backend services, OCR pipelines, automation logic, and machine learning components are explicitly excluded from this verification.

## Verification Checklist

### 1. Repository Structure
- Required directories such as `docs/`, `samples/` or `docs/sample_links.md`, `tests/fixtures/`, and `scripts/` are present.
- File names follow consistent and descriptive naming conventions.

### 2. SLA Field Definitions (`docs/sla_fields.md`)
- All defined fields have clear real-world meanings described in plain language.
- Each field includes handling rules for missing or unclear values.
- Field definitions do not overlap in responsibility or meaning.

### 3. JSON Schema (`docs/schema.json`)
- The schema file exists and is valid JSON.
- All fields defined in `docs/sla_fields.md` are present in the schema.
- Data types, constraints, and nullability rules are correctly enforced.

### 4. Manual Extraction Template (`docs/manual_extraction.md`)
- A structured template exists for mapping extracted values to source evidence.
- The template supports page numbers, clause text, and extracted values.

### 5. Acceptance & Verification Documents
- `docs/acceptance_criteria.md` exists and matches Milestone 1 scope.
- `docs/verification_checklist.md` (this document) is complete and consistent.


## Verification Outcome
Milestone 1 is considered verified when all checklist items above are satisfied without exceptions.
Any missing, inconsistent, or unclear item must be resolved before proceeding to manual extraction or downstream development.


## Notes
This checklist should be used together with `docs/acceptance_criteria.md` and `docs/schema.json` for a complete Milestone 1 review.
