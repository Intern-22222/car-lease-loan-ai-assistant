# Run Local OCR Guide

This project uses two tools for OCR:
- Tesseract (image to text)
- Poppler / pdftoppm (PDF to images)

Both must already be installed and available in PATH.

## 1. Verify Tools
Run the following commands to confirm setup:
tesseract --version
pdftoppm -v

## 2. Run the OCR Test Script
Use this command to run OCR on a PDF:
python ocr/test_ocr.py "pdfs/your_file.pdf"

Example:
python ocr/test_ocr.py "pdfs/ML project 360.pdf"

Output will be created at:
data/sample_ocr.txt

## 3. Notes
- Use quotes around filenames with spaces.
- Do not place docs/, ocr/, or data/ inside the virtual environment (myenv).
- The script converts PDF → images → text.
