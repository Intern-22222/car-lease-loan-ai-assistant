import pytesseract
from pdf2image import convert_from_path
import os

# CONFIGURATION
# If you are on Windows and Tesseract isn't in your PATH, uncomment and set this:
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def ocr_one_pdf(pdf_path, output_path):
    print(f"Processing {pdf_path}...")
    
    # 1. Convert PDF to images (one image per page)
    # 300 DPI is a standard high resolution for OCR 
    images = convert_from_path(pdf_path, dpi=300)
    
    full_text = ""
    
    # 2. Loop through pages and extract text
    for i, image in enumerate(images):
        print(f"  - OCR on page {i + 1}...")
        # simple image_to_string call
        text = pytesseract.image_to_string(image)
        full_text += f"\n--- Page {i+1} ---\n" + text
        
    # 3. Save to file
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(full_text)
    
    print(f"Done! Saved to {output_path}")

if __name__ == "__main__":
    # Ensure directories exist
    os.makedirs("data", exist_ok=True)
    
    # CHANGE THIS to point to a real PDF sample you get from Intern A
    sample_pdf = "samples/contract_sample_01.pdf" 
    output_txt = "data/sample_ocr.txt"
    
    if os.path.exists(sample_pdf):
        ocr_one_pdf(sample_pdf, output_txt)
    else:
        print(f"Error: {sample_pdf} not found. Please add a sample PDF.")
