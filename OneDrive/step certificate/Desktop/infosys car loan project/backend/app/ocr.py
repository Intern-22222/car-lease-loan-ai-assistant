import pytesseract
from pdf2image import convert_from_bytes
import re
def clean_text(text):
    # Replace multiple newlines with a single newline
    text = re.sub(r'\n+', '\n', text)
    # Remove leading/trailing whitespace
    text = text.strip()
    return text

def process_pdf(file_bytes: bytes) -> str:
    
    # 1. Convert PDF bytes to images with optimized DPI
    images = convert_from_bytes(file_bytes, dpi=300)
    extracted_text = []
    
    # 2. Run OCR on each page
    for image in images:
        page_text = pytesseract.image_to_string(image)
        extracted_text.append(page_text)
        
    # 3. Join pages and clean
    full_text = "\n".join(extracted_text)
    cleaned_text = clean_text(full_text)
    
    return cleaned_text
