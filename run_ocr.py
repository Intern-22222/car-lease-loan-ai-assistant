"""
Run OCR on a PDF and save to database.

Usage:
    python run_ocr.py <pdf_path>
    
Examples:
    python run_ocr.py Sample/ford-loan-2023-11.pdf
    python run_ocr.py Sample/vehicle-loan-agreement_rbl.pdf
"""

import sys
import os
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

from backend.app.ocr import ocr_endpoint_handler, save_ocr_to_db


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        print("Error: Please provide a PDF path")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    
    if not os.path.exists(pdf_path):
        print(f"Error: File not found: {pdf_path}")
        sys.exit(1)
    
    print(f"Processing: {pdf_path}")
    print("-" * 50)
    
    # Run OCR
    result = ocr_endpoint_handler(pdf_path)
    
    if not result["success"]:
        print(f"OCR Failed: {result['error']}")
        sys.exit(1)
    
    data = result["data"]
    print(f"✓ OCR completed")
    print(f"  Pages: {data['page_count']}")
    print(f"  Characters: {data['character_count']}")
    
    # Save to database
    db_result = save_ocr_to_db(result)
    
    if db_result["saved"]:
        print(f"✓ Saved to database with ID: {db_result['record_id']}")
    else:
        print(f"✗ Failed to save: {db_result.get('error', 'Unknown error')}")
        sys.exit(1)
    
    print("-" * 50)
    print("Text Preview (first 500 chars):")
    print(data["text"][:500])


if __name__ == "__main__":
    main()
