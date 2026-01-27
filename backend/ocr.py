import pytesseract
from pdf2image import convert_from_path
import os

TEXT_DIR = "data/text"
os.makedirs(TEXT_DIR, exist_ok=True)

def run_ocr(pdf_path, text_output_path, poppler_path=None):
    # Convert PDF to images
    if poppler_path:
        images = convert_from_path(pdf_path, dpi=200, poppler_path=poppler_path)
    else:
        images = convert_from_path(pdf_path, dpi=200)

    full_text = ""

    for img in images:
        full_text += pytesseract.image_to_string(img) + "\n\n"

    # Save the extracted text
    with open(text_output_path, "w", encoding="utf-8") as f:
        f.write(full_text)

    return full_text
