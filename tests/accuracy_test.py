"""
Accuracy Test - Quantify OCR Improvement
Compares character count and text quality between raw and preprocessed OCR.
"""

import os
import sys
from pathlib import Path
import io
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import cv2
import numpy as np

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))


from backend.app.preprocessing import preprocess_for_ocr, pil_to_cv2

import platform
if platform.system() == 'Windows':
    tesseract_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    if os.path.exists(tesseract_path):
        pytesseract.pytesseract.tesseract_cmd = tesseract_path



def run_ocr_on_image(image: np.ndarray, preprocessed: bool = False) -> str:
    """
    Run Tesseract OCR on an image.
    
    Args:
        image: Image as numpy array
        preprocessed: Whether image is already preprocessed
        
    Returns:
        Extracted text
    """
    if not preprocessed:
        # Convert to grayscale if needed
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image.copy()
        img_to_ocr = gray
    else:
        img_to_ocr = image
    
    # Convert to PIL
    pil_img = Image.fromarray(img_to_ocr)
    
    # Run OCR
    text = pytesseract.image_to_string(
        pil_img,
        lang='eng',
        config='--oem 3 --psm 6'
    )
    
    return text


def compare_ocr_accuracy(
    pdf_path: str,
    page_num: int = 0,
    dpi: int = 300
) -> dict:
    """
    Compare OCR accuracy on raw vs preprocessed image.
    
    Args:
        pdf_path: Path to PDF file
        page_num: Page number to test
        dpi: DPI for rendering
        
    Returns:
        Dictionary with comparison statistics
    """
    # Open PDF and render page
    doc = fitz.open(pdf_path)
    if page_num >= len(doc):
        print(f"❌ Page {page_num} not found. PDF has {len(doc)} pages.")
        doc.close()
        return {}
    
    page = doc[page_num]
    zoom = dpi / 72
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)
    
    # Convert to numpy array
    img_data = pix.tobytes("png")
    pil_img = Image.open(io.BytesIO(img_data))
    original = pil_to_cv2(pil_img)
    
    doc.close()
    
    # Convert to grayscale
    if len(original.shape) == 3:
        gray = cv2.cvtColor(original, cv2.COLOR_BGR2GRAY)
    else:
        gray = original.copy()
    
    # Run OCR on raw image
    print("🔍 Running OCR on RAW image...")
    text_raw = run_ocr_on_image(gray, preprocessed=False)
    
    # Preprocess image
    print("🔍 Preprocessing image...")
    preprocessed = preprocess_for_ocr(gray, method="adaptive")
    
    # Run OCR on preprocessed image
    print("🔍 Running OCR on PREPROCESSED image...")
    text_preprocessed = run_ocr_on_image(preprocessed, preprocessed=True)
    
    # Calculate statistics
    char_count_raw = len(text_raw)
    char_count_preprocessed = len(text_preprocessed)
    
    # Remove whitespace for more accurate comparison
    text_raw_clean = ''.join(text_raw.split())
    text_preprocessed_clean = ''.join(text_preprocessed.split())
    
    char_count_raw_clean = len(text_raw_clean)
    char_count_preprocessed_clean = len(text_preprocessed_clean)
    
    # Calculate improvement
    if char_count_raw_clean > 0:
        improvement_pct = ((char_count_preprocessed_clean - char_count_raw_clean) / char_count_raw_clean) * 100
    else:
        improvement_pct = 0
    
    return {
        "pdf_name": Path(pdf_path).name,
        "page": page_num,
        "raw_chars": char_count_raw,
        "preprocessed_chars": char_count_preprocessed,
        "raw_chars_clean": char_count_raw_clean,
        "preprocessed_chars_clean": char_count_preprocessed_clean,
        "improvement_pct": improvement_pct,
        "text_raw_preview": text_raw[:200],
        "text_preprocessed_preview": text_preprocessed[:200]
    }


def main():
    """Run accuracy comparison on sample PDFs."""
    # Sample directory
    sample_dir = Path(__file__).parent / "Sample"
    
    if not sample_dir.exists():
        print(f"❌ Sample directory not found: {sample_dir}")
        return
    
    # Find all PDFs
    pdf_files = list(sample_dir.glob("*.pdf"))
    
    if not pdf_files:
        print(f"❌ No PDF files found in {sample_dir}")
        return
    
    print(f"🔍 Found {len(pdf_files)} PDF(s) in {sample_dir}\n")
    print("=" * 80)
    
    results = []
    
    # Process each PDF (first page only)
    for pdf_path in pdf_files:
        print(f"\n📄 Processing: {pdf_path.name}")
        print("-" * 80)
        try:
            result = compare_ocr_accuracy(str(pdf_path), page_num=0)
            if result:
                results.append(result)
                
                # Display results
                print(f"\n📊 Results for {result['pdf_name']} (Page {result['page']}):")
                print(f"   Raw OCR Characters: {result['raw_chars_clean']}")
                print(f"   Preprocessed OCR Characters: {result['preprocessed_chars_clean']}")
                print(f"   Improvement: {result['improvement_pct']:+.1f}%")
                
                if result['improvement_pct'] > 0:
                    print(f"   ✅ Preprocessing IMPROVED accuracy!")
                elif result['improvement_pct'] < 0:
                    print(f"   ⚠️  Preprocessing reduced character count (may indicate noise removal)")
                else:
                    print(f"   ➖ No change")
                
        except Exception as e:
            print(f"❌ Error processing {pdf_path.name}: {e}")
            import traceback
            traceback.print_exc()
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 SUMMARY")
    print("=" * 80)
    
    if results:
        avg_improvement = sum(r['improvement_pct'] for r in results) / len(results)
        print(f"📈 Average OCR Improvement: {avg_improvement:+.1f}%")
        print(f"📄 Files Tested: {len(results)}")
        
        positive_improvements = sum(1 for r in results if r['improvement_pct'] > 0)
        print(f"✅ Files with Improvement: {positive_improvements}/{len(results)}")
    else:
        print("❌ No results to display")
    
    print("\n✅ Accuracy test complete!")


if __name__ == "__main__":
    main()
