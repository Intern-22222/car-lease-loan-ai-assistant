"""
Standalone OCR Sandbox Script
--------------------------------
Purpose:
- Test OCR on a single PDF or image
- Validate text extraction quality
- Run independently from backend services

Usage:
    python sandbox_ocr.py
"""

import os
from pathlib import Path

import pytesseract
from pdf2image import convert_from_path
from PIL import Image

# -------------------------------------------------
# Configuration
# -------------------------------------------------

INPUT_DIR = Path("samples")
OUTPUT_DIR = Path("output")

SUPPORTED_IMAGES = {".png", ".jpg", ".jpeg", ".tiff", ".bmp"}
DPI = 300

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# -------------------------------------------------
# Helper Functions
# -------------------------------------------------

def get_first_input_file() -> Path:
    """Return the first PDF or image from samples/."""
    for file in INPUT_DIR.iterdir():
        if file.suffix.lower() == ".pdf" or file.suffix.lower() in SUPPORTED_IMAGES:
            return file
    raise FileNotFoundError("No PDF or image found in samples/")


def ocr_image(image: Image.Image) -> str:
    """Run Tesseract OCR on a PIL image."""
    return pytesseract.image_to_string(image)


def process_pdf(pdf_path: Path) -> str:
    """Convert PDF pages to images and extract text."""
    pages = convert_from_path(pdf_path, dpi=DPI)
    extracted_text = []

    for page_number, page in enumerate(pages, start=1):
        print(f"OCR processing page {page_number}")
        text = ocr_image(page)
        extracted_text.append(f"\n--- Page {page_number} ---\n{text}")

    return "\n".join(extracted_text)


def process_image(image_path: Path) -> str:
    """Extract text from a single image."""
    image = Image.open(image_path)
    return ocr_image(image)


# -------------------------------------------------
# Main Execution
# -------------------------------------------------

def main():
    input_file = get_first_input_file()
    print(f"Processing file: {input_file.name}")

    if input_file.suffix.lower() == ".pdf":
        text = process_pdf(input_file)
    else:
        text = process_image(input_file)

    output_file = OUTPUT_DIR / f"{input_file.stem}.txt"
    output_file.write_text(text, encoding="utf-8")

    print(f"OCR completed successfully.")
    print(f"Output saved to: {output_file.resolve()}")


if __name__ == "__main__":
    main()
