import pytest
import os
import sys
import glob

# Allow importing from backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.app.ocr import process_pdf

# 1. Find ALL files (Case Insensitive search for Windows)
# This looks for .pdf, .PDF, .Pdf, etc.
files_lower = glob.glob("samples/*.pdf")
files_upper = glob.glob("samples/*.PDF")
SAMPLE_FILES = list(set(files_lower + files_upper))

# DEBUG: Print what we found so you can see it in the terminal
print(f"\n[DEBUG] Found {len(SAMPLE_FILES)} PDF files: {SAMPLE_FILES}")

# 2. The '@' line is what makes it loop!
# It says: "For every file in SAMPLE_FILES, run this function again"
@pytest.mark.parametrize("pdf_path", SAMPLE_FILES)
def test_ocr_multiple_files(pdf_path):
    print(f"Processing: {pdf_path}")
    
    with open(pdf_path, "rb") as f:
        file_bytes = f.read()
    
    result = process_pdf(file_bytes)
    
    assert result is not None
    assert len(result) > 100, f"Text too short in {pdf_path}"