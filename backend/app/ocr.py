import os
from PIL import Image
import pytesseract

def run_ocr_on_image(path: str) -> str:
    image = Image.open(path)
    text = pytesseract.image_to_string(image)
    return text

def run_ocr_on_pdf(path: str) -> str:
    """Extract text directly from PDF using PyMuPDF (no OCR needed for text PDFs)"""
    try:
        import fitz  # pip install PyMuPDF
        doc = fitz.open(path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text
    except ImportError:
        return "PyMuPDF not installed. Install with: pip install PyMuPDF"

def run_ocr(path: str) -> str:
    ext = os.path.splitext(path)[1].lower()
    
    # Images: use Tesseract OCR
    if ext in [".png", ".jpg", ".jpeg", ".tiff", ".bmp"]:
        return run_ocr_on_image(path)
    
    # PDFs: extract text directly (faster, works for text-based PDFs)
    elif ext == ".pdf":
        return run_ocr_on_pdf(path)
    
    # Unsupported formats
    else:
        return ""
