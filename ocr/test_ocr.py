"""
OCR Test Script - Week 1 Deliverable
Converts a PDF file to text using PaddleOCR.

Usage:
    python ocr/test_ocr.py <pdf_path> [output_path]
    
Example:
    python ocr/test_ocr.py data/sample.pdf
    python ocr/test_ocr.py data/sample.pdf data/output.txt
"""

import sys
import os
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from pdf2image import convert_from_path
from paddleocr import PaddleOCR
import logging

# Suppress PaddleOCR debug logs
logging.getLogger("ppocr").setLevel(logging.WARNING)


def pdf_to_text(pdf_path: str, output_path: str = None) -> str:
    """
    Convert a PDF file to text using PaddleOCR.
    
    Args:
        pdf_path: Path to the PDF file
        output_path: Optional path to save the extracted text
        
    Returns:
        Extracted text from the PDF
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found: {pdf_path}")
    
    print(f"Processing: {pdf_path}")
    
    # Convert PDF to images (300 DPI for good quality)
    print("Converting PDF to images...")
    images = convert_from_path(pdf_path, dpi=300)
    print(f"Found {len(images)} page(s)")
    
    # Initialize PaddleOCR
    ocr = PaddleOCR(use_angle_cls=True, lang='en', show_log=False)
    
    # Process each page
    all_text = []
    for i, image in enumerate(images):
        print(f"Processing page {i + 1}/{len(images)}...")
        
        # Save image temporarily
        temp_path = f"temp_page_{i}.png"
        image.save(temp_path, "PNG")
        
        # Run OCR
        result = ocr.ocr(temp_path, cls=True)
        
        # Extract text from result
        page_text = []
        if result and result[0]:
            for line in result[0]:
                if line and len(line) > 1:
                    text = line[1][0]  # Get the text content
                    page_text.append(text)
        
        all_text.append(f"--- Page {i + 1} ---\n" + "\n".join(page_text))
        
        # Clean up temp file
        os.remove(temp_path)
    
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
        output_path = f"data/{pdf_name}_ocr.txt"
    
    try:
        text = pdf_to_text(pdf_path, output_path)
        print(f"\n{'='*50}")
        print("OCR RESULT PREVIEW (first 500 chars):")
        print('='*50)
        print(text[:500] if len(text) > 500 else text)
        print(f"\n{'='*50}")
        print(f"Total characters extracted: {len(text)}")
        print(f"Output saved to: {output_path}")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
