import os
from PIL import Image
import pytesseract


def run_ocr_on_image(path: str) -> str:
    image = Image.open(path)
    text = pytesseract.image_to_string(image)
    return text


def run_ocr(path: str) -> str:
    ext = os.path.splitext(path)[1].lower()
    if ext in [".png", ".jpg", ".jpeg", ".tiff", ".bmp"]:
        return run_ocr_on_image(path)
    # For now, only handle images; PDFs can be added later if needed.
    return ""
