"""
Visual Test - Compare Before/After Preprocessing
Generates side-by-side images to verify that preprocessing improves OCR quality.
"""

import io
import os
import sys
from pathlib import Path
import cv2
import fitz  # PyMuPDF
import numpy as np
from PIL import Image

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from backend.app.preprocessing import (
    preprocess_for_ocr,
    pil_to_cv2,
    cv2_to_pil
)


def create_comparison_image(
    pdf_path: str,
    output_dir: str = "visual_output",
    page_num: int = 0,
    dpi: int = 300
) -> None:
    """
    Generate before/after comparison images for a PDF page.
    
    Args:
        pdf_path: Path to PDF file
        output_dir: Directory to save output images
        page_num: Page number to process (0-indexed)
        dpi: DPI for rendering
    """
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Open PDF and render page
    doc = fitz.open(pdf_path)
    if page_num >= len(doc):
        print(f"❌ Page {page_num} not found. PDF has {len(doc)} pages.")
        doc.close()
        return
    
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
    
    # Apply preprocessing
    preprocessed = preprocess_for_ocr(gray, method="adaptive")
    
    # Create filename
    pdf_name = Path(pdf_path).stem
    
    # Save before image
    before_path = os.path.join(output_dir, f"{pdf_name}_page{page_num}_before.png")
    cv2.imwrite(before_path, gray)
    print(f"✅ Saved: {before_path}")
    
    # Save after image
    after_path = os.path.join(output_dir, f"{pdf_name}_page{page_num}_after.png")
    cv2.imwrite(after_path, preprocessed)
    print(f"✅ Saved: {after_path}")
    
    # Create side-by-side comparison
    # Resize if needed to fit side by side
    max_width = 1920
    h, w = gray.shape
    
    if w * 2 > max_width:
        scale = max_width / (w * 2)
        new_w = int(w * scale)
        new_h = int(h * scale)
        gray_resized = cv2.resize(gray, (new_w, new_h))
        preprocessed_resized = cv2.resize(preprocessed, (new_w, new_h))
    else:
        gray_resized = gray
        preprocessed_resized = preprocessed
    
    # Concatenate horizontally
    comparison = np.hstack([gray_resized, preprocessed_resized])
    
    # Add labels
    comparison_labeled = comparison.copy()
    font = cv2.FONT_HERSHEY_SIMPLEX
    cv2.putText(comparison_labeled, "BEFORE", (50, 50), font, 2, (255, 255, 255), 3)
    cv2.putText(comparison_labeled, "AFTER", (gray_resized.shape[1] + 50, 50), font, 2, (255, 255, 255), 3)
    
    comparison_path = os.path.join(output_dir, f"{pdf_name}_page{page_num}_comparison.png")
    cv2.imwrite(comparison_path, comparison_labeled)
    print(f"✅ Saved comparison: {comparison_path}")
    
    print(f"\n📊 Results saved to: {output_dir}/")


def main():
    """Run visual tests on sample PDFs."""
    import io
    
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
    
    # Process each PDF (first page only)
    for pdf_path in pdf_files:
        print(f"\n📄 Processing: {pdf_path.name}")
        print("=" * 60)
        try:
            create_comparison_image(str(pdf_path), page_num=0)
        except Exception as e:
            print(f"❌ Error processing {pdf_path.name}: {e}")
    
    print("\n" + "=" * 60)
    print("✅ Visual test complete!")
    print("📁 Check the 'visual_output' folder for before/after images.")


if __name__ == "__main__":
    main()
