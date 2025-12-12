# Intern A — Product & Data Lead: Milestone 1 Deliverables

## Role Overview

Intern A is responsible for defining the data structure, extraction rules, and documentation required for the Car Lease/Loan Contract AI Assistant as described in the project proposal.

The work in Milestone 1 focuses on contract analysis preparation, sample collection, field standardization, and JSON schema design.

## Deliverables

1. `docs/sla_fields.md` — Canonical SLA field dictionary with 12 standardized fields.
2. `docs/schema.json` — Strict JSON Schema defining the allowed structure and types for AI-extracted fields.
3. `samples/` or `docs/sample_links.md` — At least 15 public sample lease/loan agreements collected from online sources.
4. `tests/fixtures/` — Five sample PDFs and their corresponding normalized `.gold.json` outputs.
5. `docs/manual_extraction.md` — Evidence log showing page numbers, clause text, and confidence levels for each gold JSON field.
6. `docs/acceptance_criteria.md` — Checklist for mentors to review Intern A’s work.
7. `docs/verification_checklist.md` — Validation guidelines for QA and automated checks.

## How to Review

1. Read `docs/sla_fields.md` to understand all canonical SLA fields and normalization rules.
2. Validate all gold JSON files using `python scripts/validate_schema.py`.
3. Compare each `.gold.json` with its source PDF using `docs/manual_extraction.md` evidence.

## Notes

This document serves as the entry point for Milestone 1 and should be read before reviewing any other deliverables.
