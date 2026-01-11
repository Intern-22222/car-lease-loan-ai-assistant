#!/usr/bin/env python3

import sys
from pathlib import Path

from ocr.ocr_fun import extract_text_from_pdf
from ocr.text_processing import clean_text, handle_layout, validate_text
from db_helper import init_db, save_ocr_result


def main():
    if len(sys.argv) < 2:
        print("Usage: python -m ocr.test_ocr path/to/sample.pdf")
        sys.exit(1)

    pdf_path = Path(sys.argv[1])

    if not pdf_path.exists():
        raise SystemExit(f"PDF not found: {pdf_path}")

    # Initialize database
    init_db()

    print("Running OCR service...")
    raw_text = extract_text_from_pdf(pdf_path)

    # ---- Task-2: Text Processing ----
    cleaned_text = clean_text(raw_text)
    final_text = handle_layout(cleaned_text)

    if not validate_text(final_text):
        print("Warning: OCR text quality is low")

    # Save processed text to DB
    save_ocr_result(pdf_path.name, final_text)

    print("OCR completed and processed text saved to database.")


if __name__ == "__main__":
    main()