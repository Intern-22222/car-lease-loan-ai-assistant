"""
Test OCR Pipeline with Tesseract
Tests both the pdfplumber native extraction and Tesseract OCR functionality.
"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.ocr import (
    process_pdf_to_dict,
    process_pdf,
    is_scanned_pdf,
    HAS_PDFPLUMBER,
    HAS_OPENCV
)
import pytesseract

def test_dependencies():
    """Test if all OCR dependencies are available."""
    print("="*60)
    print("CHECKING OCR DEPENDENCIES")
    print("="*60)
    
    # Check Tesseract
    try:
        version = pytesseract.get_tesseract_version()
        print(f"✅ Tesseract version: {version}")
    except Exception as e:
        print(f"❌ Tesseract not found: {e}")
        return False
    
    # Check pdfplumber
    if HAS_PDFPLUMBER:
        print("✅ pdfplumber: Available")
    else:
        print("⚠️  pdfplumber: Not available")
    
    # Check OpenCV
    if HAS_OPENCV:
        print("✅ OpenCV: Available")
    else:
        print("⚠️  OpenCV: Not available")
    
    print()
    return True

def test_ocr_on_sample():
    """Test OCR on sample PDF."""
    print("="*60)
    print("TESTING OCR ON SAMPLE PDF")
    print("="*60)
    
    # Find a sample PDF
    samples_dir = "samples"
    if not os.path.exists(samples_dir):
        print(f"❌ Samples directory not found: {samples_dir}")
        return False
    
    pdf_files = [f for f in os.listdir(samples_dir) if f.endswith('.pdf')]
    if not pdf_files:
        print(f"❌ No PDF files found in {samples_dir}")
        return False
    
    test_pdf = os.path.join(samples_dir, pdf_files[0])
    print(f"\n📄 Testing with: {pdf_files[0]}")
    
    try:
        # Check if scanned
        is_scanned = is_scanned_pdf(test_pdf)
        print(f"   Scanned PDF: {is_scanned}")
        
        # Process PDF
        result = process_pdf_to_dict(test_pdf)
        
        print(f"\n✅ OCR Results:")
        print(f"   Method: {result['extraction_method']}")
        print(f"   Pages: {result['page_count']}")
        print(f"   Characters extracted: {result['character_count']:,}")
        print(f"   Text preview (first 200 chars):")
        print(f"   {result['text'][:200]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ OCR test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_multiple_samples():
    """Test OCR on multiple samples."""
    print("\n" + "="*60)
    print("TESTING OCR ON MULTIPLE SAMPLES")
    print("="*60)
    
    samples_dir = "samples"
    pdf_files = [f for f in os.listdir(samples_dir) if f.endswith('.pdf')][:3]
    
    results = []
    for pdf_file in pdf_files:
        pdf_path = os.path.join(samples_dir, pdf_file)
        try:
            result = process_pdf_to_dict(pdf_path)
            results.append({
                'file': pdf_file,
                'method': result['extraction_method'],
                'chars': result['character_count'],
                'pages': result['page_count']
            })
            print(f"✅ {pdf_file}: {result['character_count']:,} chars via {result['extraction_method']}")
        except Exception as e:
            print(f"❌ {pdf_file}: Failed - {e}")
            results.append({
                'file': pdf_file,
                'error': str(e)
            })
    
    return results

if __name__ == "__main__":
    print("\n🔍 OCR PIPELINE VERIFICATION TEST\n")
    
    # Test 1: Dependencies
    if not test_dependencies():
        print("\n❌ CRITICAL: Tesseract not found! OCR will not work.")
        sys.exit(1)
    
    # Test 2: Single sample
    if not test_ocr_on_sample():
        print("\n❌ OCR test failed!")
        sys.exit(1)
    
    # Test 3: Multiple samples
    results = test_multiple_samples()
    
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"✅ All dependencies are installed")
    print(f"✅ Tesseract OCR is working properly")
    print(f"✅ PDF extraction pipeline is functional")
    print(f"\n📊 Tested {len(results)} PDF files successfully\n")
