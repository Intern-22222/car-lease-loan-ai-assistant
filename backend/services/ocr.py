"""
OCR Module - Enhanced Hybrid Approach
Uses pdfplumber for native PDF text extraction and Tesseract with preprocessing for scanned documents.

Features:
- Hybrid detection: native text → OCR fallback
- pdfplumber for digital PDFs (cleaner output)
- Image preprocessing (grayscale, threshold, denoise) before OCR
- Improved text cleanup for loan documents
"""

import os
import re
import platform
from pathlib import Path
from typing import Optional, List, Tuple

import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import io

# Try to import optional dependencies
try:
    import pdfplumber
    HAS_PDFPLUMBER = True
except ImportError:
    HAS_PDFPLUMBER = False

try:
    import cv2
    import numpy as np
    HAS_OPENCV = True
except ImportError:
    HAS_OPENCV = False

# Configure Tesseract path for Windows
if platform.system() == 'Windows':
    tesseract_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    if os.path.exists(tesseract_path):
        pytesseract.pytesseract.tesseract_cmd = tesseract_path


def clean_text(text: str) -> str:
    """
    Clean OCR output text by fixing common issues in loan documents.
    
    Args:
        text: Raw text from OCR or PDF extraction
        
    Returns:
        Cleaned text
    """
    if not text:
        return ""
    
    # Fix common OCR mistakes
    replacements = {
        "l1": "li",
        "0O": "00",
        "|": "I",
    }
    
    for old, new in replacements.items():
        text = text.replace(old, new)
    
    # Remove checkbox/border noise patterns (TTT, TIP, Tit, TTP, etc.)
    # These come from checkboxes and table borders in forms
    text = re.sub(r'\b[TtIiPp]{2,}\b', '', text)  # TT, TTT, TIP, Tit, TTP, etc.
    text = re.sub(r'\bT[TtIiPp]+\b', '', text)    # Titi, TTTT, etc.
    text = re.sub(r'\b[Tt]+ [Tt]+\b', '', text)   # "T T" or "TT TT" patterns
    
    # Remove repeated character noise (checkboxes/borders read as EEE, etc.)
    text = re.sub(r'([A-Z])\1{2,}', '', text)
    
    # Remove short uppercase words that are noise (T, TT, ET, EET, TET, etc.)
    text = re.sub(r'\b[TEIPti]{1,4}\b', '', text)
    
    # Remove checkbox artifacts with brackets
    text = re.sub(r'\[[\s_IiTt|]*\]', '', text)
    text = re.sub(r'\b_?[Ii]_?\b', '', text)
    
    # Remove orphaned brackets and pipes
    text = re.sub(r'\[\s*\]', '', text)
    text = re.sub(r'\|\s*\|', '', text)
    
    # Remove excessive newlines and spaces
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)
    
    # Clean up lines
    lines = [line.strip() for line in text.split('\n')]
    lines = [line for line in lines if line and len(line) > 1]
    
    return '\n'.join(lines).strip()


def extract_native_text(pdf_path: str) -> str:
    """
    Extract text from PDF using pdfplumber (for digital/native PDFs).
    
    Args:
        pdf_path: Path to PDF file
        
    Returns:
        Extracted text or empty string if extraction fails
    """
    if not HAS_PDFPLUMBER:
        return ""
    
    try:
        all_text = []
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    all_text.append(text)
        return '\n\n'.join(all_text)
    except Exception:
        return ""


def preprocess_image(pil_image: Image.Image) -> Image.Image:
    """
    Preprocess image for better OCR results.
    Applies: grayscale, adaptive threshold, denoise.
    
    Args:
        pil_image: PIL Image object
        
    Returns:
        Preprocessed PIL Image
    """
    if not HAS_OPENCV:
        # Fallback: just convert to grayscale
        return pil_image.convert('L')
    
    # Convert PIL to OpenCV format
    img_array = np.array(pil_image)
    
    # Convert to grayscale if needed
    if len(img_array.shape) == 3:
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    else:
        gray = img_array
    
    # Apply adaptive thresholding (better for forms with checkboxes)
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY, 11, 2
    )
    
    # Denoise
    denoised = cv2.fastNlMeansDenoising(thresh, None, 10, 7, 21)
    
    # Morphological operations to clean up
    kernel = np.ones((1, 1), np.uint8)
    cleaned = cv2.morphologyEx(denoised, cv2.MORPH_CLOSE, kernel)
    
    return Image.fromarray(cleaned)


def is_scanned_pdf(pdf_path: str, threshold: int = 100) -> bool:
    """
    Detect if PDF is scanned (image-based) or has native text.
    
    Args:
        pdf_path: Path to PDF file
        threshold: Minimum character count to consider as native PDF
        
    Returns:
        True if PDF appears to be scanned, False if it has native text
    """
    native_text = extract_native_text(pdf_path)
    return len(native_text.strip()) < threshold


def process_pdf_with_ocr(
    pdf_path: str,
    dpi: int = 300,
    preprocess: bool = True
) -> str:
    """
    Process PDF using Tesseract OCR with optional image preprocessing.
    
    Args:
        pdf_path: Path to PDF file
        dpi: DPI for rendering (higher = better quality, slower)
        preprocess: Whether to apply image preprocessing
        
    Returns:
        Extracted text
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found: {pdf_path}")
    
    doc = fitz.open(pdf_path)
    if len(doc) == 0:
        doc.close()
        raise ValueError(f"No pages found in PDF: {pdf_path}")
    
    all_text: List[str] = []
    zoom = dpi / 72
    mat = fitz.Matrix(zoom, zoom)
    
    for page in doc:
        # Render page to image
        pix = page.get_pixmap(matrix=mat)
        img_data = pix.tobytes("png")
        image = Image.open(io.BytesIO(img_data))
        
        # Apply preprocessing if enabled
        if preprocess and HAS_OPENCV:
            image = preprocess_image(image)
        
        # Run Tesseract with optimized config
        page_text = pytesseract.image_to_string(
            image,
            lang='eng',
            config='--oem 3 --psm 6'
        )
        
        all_text.append(page_text.strip())
    
    doc.close()
    return '\n\n'.join(all_text)


def process_pdf(
    pdf_path: str,
    dpi: int = 300,
    output_path: Optional[str] = None,
    cleanup: bool = True,
    force_ocr: bool = False
) -> str:
    """
    Process a PDF using hybrid approach: native extraction first, OCR fallback.
    
    Args:
        pdf_path: Path to the PDF file
        dpi: DPI for OCR (if needed)
        output_path: Optional path to save extracted text
        cleanup: Whether to apply text cleanup
        force_ocr: Force OCR even if native text is available
        
    Returns:
        Extracted text
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found: {pdf_path}")
    
    text = ""
    method_used = "none"
    
    # Step 1: Try native extraction first (unless forced OCR)
    if not force_ocr and HAS_PDFPLUMBER:
        native_text = extract_native_text(pdf_path)
        if len(native_text.strip()) > 100:
            text = native_text
            method_used = "pdfplumber"
    
    # Step 2: Fall back to OCR if native extraction didn't work
    if not text:
        text = process_pdf_with_ocr(pdf_path, dpi=dpi, preprocess=True)
        method_used = "tesseract"
    
    # Apply cleanup
    if cleanup:
        text = clean_text(text)
    
    # Save output if requested
    if output_path:
        os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text)
    
    return text


def process_pdf_to_dict(pdf_path: str, dpi: int = 300) -> dict:
    """
    Process a PDF and return structured result for API responses.
    
    Args:
        pdf_path: Path to the PDF file
        dpi: DPI for OCR (if needed)
        
    Returns:
        Dictionary with text, page_count, character_count, and extraction method
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found: {pdf_path}")
    
    # Get page count
    doc = fitz.open(pdf_path)
    page_count = len(doc)
    doc.close()
    
    # Determine extraction method
    is_scanned = is_scanned_pdf(pdf_path)
    method = "tesseract" if is_scanned else "pdfplumber"
    
    # Process PDF
    text = process_pdf(pdf_path, dpi=dpi)
    
    return {
        "text": text,
        "page_count": page_count,
        "character_count": len(text),
        "source_file": os.path.basename(pdf_path),
        "extraction_method": method
    }


def process_image(image_path: str, preprocess: bool = True) -> str:
    """
    Process a single image file (JPG, PNG) using Tesseract.
    """
    if not os.path.exists(image_path):
        return ""
        
    try:
        image = Image.open(image_path)
        
        # Apply preprocessing
        if preprocess and HAS_OPENCV:
            image = preprocess_image(image)
            
        text = pytesseract.image_to_string(
            image,
            lang='eng',
            config='--oem 3 --psm 6'
        )
        return text.strip()
    except Exception as e:
        print(f"Image processing error: {e}")
        return ""


def process_generic_file(file_path: str) -> dict:
    """
    Process any supported file (PDF, JPG, PNG) and return structured result.
    """
    ext = os.path.splitext(file_path)[1].lower()
    text = ""
    method = "unknown"
    page_count = 1
    
    if ext == '.pdf':
        res = process_pdf_to_dict(file_path)
        return res
    elif ext in ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']:
        text = process_image(file_path)
        method = "tesseract_image"
        # Cleanup
        text = clean_text(text)
    else:
        raise ValueError(f"Unsupported file type: {ext}")
        
    return {
        "text": text,
        "page_count": 1,
        "character_count": len(text),
        "source_file": os.path.basename(file_path),
        "extraction_method": method
    }


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
        db_path: Optional database path
        
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
    
    init_db(db_path)
    
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
