"""
OCR Module - Week 2 Deliverable
Reusable OCR processing module for the Car Lease/Loan AI Assistant backend.

Features:
- Multi-page PDF support
- Configurable DPI
- Text cleanup (remove extra newlines, fix common OCR mistakes)
- Error handling
"""

import os
import re
import tempfile
from pathlib import Path
from typing import Optional, List

from pdf2image import convert_from_path
from paddleocr import PaddleOCR
import logging

# Suppress PaddleOCR debug logs
logging.getLogger("ppocr").setLevel(logging.WARNING)

# Singleton OCR instance for efficiency
_ocr_instance: Optional[PaddleOCR] = None


def get_ocr_instance() -> PaddleOCR:
    """Get or create the PaddleOCR instance (singleton pattern)."""
    global _ocr_instance
    if _ocr_instance is None:
        _ocr_instance = PaddleOCR(use_angle_cls=True, lang='en', show_log=False)
    return _ocr_instance


def clean_text(text: str) -> str:
    """
    Clean OCR output text by fixing common issues.
    
    Args:
        text: Raw OCR text
        
    Returns:
        Cleaned text
    """
    if not text:
        return ""
    
    # Fix common OCR mistakes
    replacements = {
        "l1": "li",      # Common OCR confusion
        "0O": "00",      # Zero/O confusion
        "|": "I",        # Pipe/I confusion
        "rn": "m",       # rn -> m confusion
        "  ": " ",       # Double spaces
    }
    
    for old, new in replacements.items():
        text = text.replace(old, new)
    
    # Remove excessive newlines (more than 2 consecutive)
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Remove leading/trailing whitespace from each line
    lines = [line.strip() for line in text.split('\n')]
    text = '\n'.join(lines)
    
    # Remove empty lines at start and end
    text = text.strip()
    
    return text


def process_pdf(
    pdf_path: str,
    dpi: int = 300,
    output_path: Optional[str] = None,
    cleanup: bool = True
) -> str:
    """
    Process a PDF file and extract text using OCR.
    
    Args:
        pdf_path: Path to the PDF file
        dpi: DPI for PDF to image conversion (higher = better quality, slower)
        output_path: Optional path to save the extracted text
        cleanup: Whether to apply text cleanup
        
    Returns:
        Extracted text from all pages
        
    Raises:
        FileNotFoundError: If PDF file doesn't exist
        ValueError: If PDF has no pages or OCR fails
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found: {pdf_path}")
    
    # Convert PDF to images
    images = convert_from_path(pdf_path, dpi=dpi)
    
    if not images:
        raise ValueError(f"No pages found in PDF: {pdf_path}")
    
    # Get OCR instance
    ocr = get_ocr_instance()
    
    # Process each page
    all_text: List[str] = []
    
    with tempfile.TemporaryDirectory() as temp_dir:
        for page_num, image in enumerate(images, 1):
            # Save image to temp directory
            temp_path = os.path.join(temp_dir, f"page_{page_num}.png")
            image.save(temp_path, "PNG")
            
            # Run OCR
            result = ocr.ocr(temp_path, cls=True)
            
            # Extract text from result
            page_lines: List[str] = []
            if result and result[0]:
                for line in result[0]:
                    if line and len(line) > 1:
                        text = line[1][0]  # Get the text content
                        page_lines.append(text)
            
            page_text = "\n".join(page_lines)
            all_text.append(page_text)
    
    # Combine all pages
    final_text = "\n\n".join(all_text)
    
    # Apply cleanup if requested
    if cleanup:
        final_text = clean_text(final_text)
    
    # Save output if path provided
    if output_path:
        os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(final_text)
    
    return final_text


def process_pdf_to_dict(pdf_path: str, dpi: int = 300) -> dict:
    """
    Process a PDF and return structured result for API responses.
    
    Args:
        pdf_path: Path to the PDF file
        dpi: DPI for PDF to image conversion
        
    Returns:
        Dictionary with text, page_count, and character_count
    """
    text = process_pdf(pdf_path, dpi=dpi)
    
    # Count pages (approximation based on page markers in original processing)
    images = convert_from_path(pdf_path, dpi=72)  # Low DPI for quick count
    
    return {
        "text": text,
        "page_count": len(images),
        "character_count": len(text),
        "source_file": os.path.basename(pdf_path)
    }


# Backend integration function
def ocr_endpoint_handler(file_path: str) -> dict:
    """
    Handler for /ocr backend endpoint.
    
    Args:
        file_path: Path to uploaded PDF file
        
    Returns:
        OCR result dictionary
    """
    try:
        result = process_pdf_to_dict(file_path)
        return {
            "success": True,
            "data": result
        }
    except FileNotFoundError as e:
        return {
            "success": False,
            "error": str(e)
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"OCR processing failed: {str(e)}"
        }
