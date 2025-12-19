"""
Tesseract OCR Script - PDF Text Extraction
Converts PDF files to text using Tesseract OCR.

Usage:
    python ocr/tesseract_ocr.py <pdf_path> [output_path]
    
Example:
    python ocr/tesseract_ocr.py Sample/ford-loan-2023-11.pdf
    python ocr/tesseract_ocr.py Sample/vehicle-loan-agreement_rbl.pdf data/output.txt
"""

import sys
import os
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import io

# Configure Tesseract path for Windows
import platform
if platform.system() == 'Windows':
    tesseract_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    if os.path.exists(tesseract_path):
        pytesseract.pytesseract.tesseract_cmd = tesseract_path


def pdf_to_text_tesseract(pdf_path: str, output_path: str = None) -> str:
    """
    Convert a PDF file to text using Tesseract OCR.
    
    Args:
        pdf_path: Path to the PDF file
        output_path: Optional path to save the extracted text
        
    Returns:
        Extracted text from the PDF
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found: {pdf_path}")
    
    print(f"Processing: {pdf_path}")
    
    # Open PDF with PyMuPDF
    doc = fitz.open(pdf_path)
    print(f"Found {len(doc)} page(s)")
    
    # Process each page
    all_text = []
    for i, page in enumerate(doc):
        print(f"Processing page {i + 1}/{len(doc)}...")
        
        # Render page to image (300 DPI = zoom of ~4.17)
        zoom = 300 / 72  # 72 is default DPI
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)
        
        # Convert to PIL Image
        img_data = pix.tobytes("png")
        image = Image.open(io.BytesIO(img_data))
        
        # Run Tesseract OCR
        page_text = pytesseract.image_to_string(
            image,
            lang='eng',
            config='--oem 3 --psm 6'  # OEM 3: Default; PSM 6: Assume uniform block of text
        )
        
        all_text.append(f"--- Page {i + 1} ---\n{page_text.strip()}")
    
    doc.close()
    
    # Combine all pages
    final_text = "\n\n".join(all_text)
    
    # Save output if path provided
    if output_path:
        os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(final_text)
        print(f"Output saved to: {output_path}")
    
    return final_text


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        print("Error: Please provide a PDF path")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    
    # Default output path
    if len(sys.argv) >= 3:
        output_path = sys.argv[2]
    else:
        pdf_name = Path(pdf_path).stem
        output_path = f"data/{pdf_name}_tesseract.txt"
    
    try:
        text = pdf_to_text_tesseract(pdf_path, output_path)
        print(f"\n{'='*60}")
        print("TESSERACT OCR RESULT:")
        print('='*60)
        print(text)
        print(f"\n{'='*60}")
        print(f"Total characters extracted: {len(text)}")
        print(f"Output saved to: {output_path}")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
