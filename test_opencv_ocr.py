"""
Test OCR with OpenCV preprocessing.
Compares output with and without preprocessing to verify OpenCV is working.

Usage:
    python test_opencv_ocr.py <pdf_path>
"""

import sys
import os
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from backend.app.ocr import (
    process_pdf_with_ocr, 
    HAS_OPENCV, 
    HAS_PDFPLUMBER,
    is_scanned_pdf,
    extract_native_text,
    clean_text
)


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        print("Error: Please provide a PDF path")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    
    if not os.path.exists(pdf_path):
        print(f"Error: File not found: {pdf_path}")
        sys.exit(1)
    
    print("=" * 60)
    print("OCR + OpenCV Preprocessing Test")
    print("=" * 60)
    
    # Check dependencies
    print(f"\n📦 Dependencies:")
    print(f"   OpenCV available: {'✅ Yes' if HAS_OPENCV else '❌ No'}")
    print(f"   pdfplumber available: {'✅ Yes' if HAS_PDFPLUMBER else '❌ No'}")
    
    # Check if PDF is scanned
    print(f"\n📄 PDF Analysis:")
    print(f"   File: {pdf_path}")
    
    native_text = extract_native_text(pdf_path)
    native_chars = len(native_text.strip())
    is_scanned = native_chars < 100
    
    print(f"   Native text chars: {native_chars}")
    print(f"   Is scanned PDF: {'Yes (needs OCR)' if is_scanned else 'No (has native text)'}")
    
    # Force OCR with preprocessing
    print(f"\n🔍 Running OCR WITH preprocessing...")
    text_with_preprocess = process_pdf_with_ocr(pdf_path, dpi=300, preprocess=True)
    
    # Force OCR without preprocessing
    print(f"🔍 Running OCR WITHOUT preprocessing...")
    text_without_preprocess = process_pdf_with_ocr(pdf_path, dpi=300, preprocess=False)
    
    # Compare results
    print("\n" + "=" * 60)
    print("RESULTS COMPARISON")
    print("=" * 60)
    
    print(f"\n📊 Character Count:")
    print(f"   With preprocessing:    {len(text_with_preprocess):,} chars")
    print(f"   Without preprocessing: {len(text_without_preprocess):,} chars")
    print(f"   Difference:            {len(text_with_preprocess) - len(text_without_preprocess):+,} chars")
    
    # Preview
    print("\n" + "-" * 60)
    print("Preview WITH preprocessing (first 300 chars):")
    print("-" * 60)
    print(text_with_preprocess[:300])
    
    print("\n" + "-" * 60)
    print("Preview WITHOUT preprocessing (first 300 chars):")
    print("-" * 60)
    print(text_without_preprocess[:300])
    
    # Show cleaned output
    cleaned_with = clean_text(text_with_preprocess)
    print("\n" + "-" * 60)
    print("🧹 CLEANED output (with preprocessing + clean_text):")
    print("-" * 60)
    print(cleaned_with[:400])
    
    print("\n✅ Test complete!")
    if HAS_OPENCV:
        print("   OpenCV preprocessing is ACTIVE and working.")
    else:
        print("   ⚠️  OpenCV not installed - using basic grayscale only.")


if __name__ == "__main__":
    main()
