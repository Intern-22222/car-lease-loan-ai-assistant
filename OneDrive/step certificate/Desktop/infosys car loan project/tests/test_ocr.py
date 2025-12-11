import pytest
import os
from backend.app.ocr import process_pdf

# Helper to find a sample PDF for testing
SAMPLE_PDF_PATH = "tests/fixtures/sample_contract.pdf" # Ensure Intern A put a file here [cite: 52]

def test_ocr_extraction_length():
    """
    Verify output existence and minimal length (>100 chars).
    
    """
    if not os.path.exists(SAMPLE_PDF_PATH):
        pytest.skip("Sample PDF not found in tests/fixtures/")
        
    with open(SAMPLE_PDF_PATH, "rb") as f:
        pdf_bytes = f.read()
        
    result_text = process_pdf(pdf_bytes)
    
    assert result_text is not None
    assert len(result_text) > 100, "Extracted text is too short, OCR might have failed."
    assert isinstance(result_text, str)