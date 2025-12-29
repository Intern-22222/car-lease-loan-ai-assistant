"""
OCR Module - Backend Integration
Reusable OCR processing module for the Car Lease/Loan AI Assistant backend.
Uses Tesseract OCR for text extraction.

Features:
- Multi-page PDF support
- Configurable DPI
- Text cleanup (remove extra newlines, fix common OCR mistakes)
- Error handling
- Database-ready output structure
"""

import os
import re
import platform
from pathlib import Path
from typing import Optional, List

import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import io

# Configure Tesseract path for Windows
if platform.system() == 'Windows':
    tesseract_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    if os.path.exists(tesseract_path):
        pytesseract.pytesseract.tesseract_cmd = tesseract_path


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
    }
    
    for old, new in replacements.items():
        text = text.replace(old, new)
    
    # Remove repeated character noise (checkboxes/borders read as TTT, EEE, etc.)
    # Replace 2+ repetitions of same letter with empty string
    text = re.sub(r'([A-Z])\1{1,}', '', text)
    
    # Remove short uppercase words that are noise (T, TT, ET, EET, TET, etc.)
    text = re.sub(r'\b[TE]{1,4}\b', '', text)
    
    # Remove sequences like "I I I" or "[ ]" that are checkbox artifacts
    text = re.sub(r'(\[_?\s*I?\s*\])', '', text)
    text = re.sub(r'\[_I\]', '', text)
    text = re.sub(r'\[I\s*\]', '', text)
    text = re.sub(r'\[\s*\]', '', text)
    
    # Remove isolated brackets
    text = re.sub(r'\[\s*_?\s*\]', '', text)
    
    # Remove standalone special chars like _I or I_ 
    text = re.sub(r'\b_?I_?\b', '', text)
    
    # Clean up "rn" -> "m" confusion
    text = re.sub(r'rn', 'm', text)
    
    # Remove excessive newlines (more than 2 consecutive)
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Remove multiple spaces
    text = re.sub(r' {2,}', ' ', text)
    
    # Remove leading/trailing whitespace from each line
    lines = [line.strip() for line in text.split('\n')]
    
    # Remove empty lines
    lines = [line for line in lines if line]
    
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
    Process a PDF file and extract text using Tesseract OCR.
    
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
    
    # Open PDF with PyMuPDF
    doc = fitz.open(pdf_path)
    
    if len(doc) == 0:
        doc.close()
        raise ValueError(f"No pages found in PDF: {pdf_path}")
    
    # Process each page
    all_text: List[str] = []
    zoom = dpi / 72  # 72 is default DPI
    mat = fitz.Matrix(zoom, zoom)
    
    for page_num, page in enumerate(doc, 1):
        # Render page to image
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
        
        all_text.append(page_text.strip())
    
    doc.close()
    
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
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found: {pdf_path}")
    
    # Get page count first
    doc = fitz.open(pdf_path)
    page_count = len(doc)
    doc.close()
    
    # Process PDF
    text = process_pdf(pdf_path, dpi=dpi)
    
    return {
        "text": text,
        "page_count": page_count,
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
        OCR result dictionary suitable for database storage
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


def save_ocr_to_db(ocr_result: dict, db_path: str = None) -> dict:
    """
    Save OCR result to database.
    
    Args:
        ocr_result: Result from ocr_endpoint_handler
        db_path: Optional database path (uses default if not provided)
        
    Returns:
        Dictionary with save status and record ID
    """
    from backend.app.database import init_db, save_ocr_result
    
    if not ocr_result.get("success"):
        return {
            "saved": False,
            "error": "Cannot save failed OCR result"
        }
    
    data = ocr_result["data"]
    
    # Initialize database (creates table if not exists)
    init_db(db_path)
    
    # Save to database
    record_id = save_ocr_result(
        source_file=data["source_file"],
        extracted_text=data["text"],
        page_count=data["page_count"],
        character_count=data["character_count"],
        db_path=db_path
    )
    
    return {
        "saved": True,
        "record_id": record_id,
        "message": f"OCR result saved to database with ID: {record_id}"
    }

