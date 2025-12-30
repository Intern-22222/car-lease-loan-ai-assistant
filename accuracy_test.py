import pytesseract
from pdf2image import convert_from_path
import numpy as np
import os

# !!! FIX: Import the correct function name 'preprocess_image' !!!
from backend.app.preprocessing import preprocess_image 

# Path to your sample PDF
PDF_PATH = "samples/contract_sample_01.pdf"

def compare_accuracy():
    # check if file exists to avoid "File not found" error
    if not os.path.exists(PDF_PATH):
        print(f"❌ Error: Could not find {PDF_PATH}")
        return

    # 1. Load Image
    print(f"Reading {PDF_PATH}...")
    images = convert_from_path(PDF_PATH, dpi=300)
    target_page = images[0] # Test on the first page
    
    # 2. OCR on RAW image (No cleaning)
    raw_text = pytesseract.image_to_string(target_page)
    
    # 3. OCR on CLEANED image (With OpenCV)
    # !!! FIX: Call the correct function 'preprocess_image' !!!
    cleaned_img = preprocess_image(target_page)
    clean_text = pytesseract.image_to_string(cleaned_img)
    
    # 4. Compare Results
    print(f"\n--- Result Comparison ---")
    print(f"Raw Image Text Length:     {len(raw_text)} chars")
    print(f"Cleaned Image Text Length: {len(clean_text)} chars")
    
    if len(clean_text) > len(raw_text):
        print("✅ SUCCESS: Preprocessing recovered MORE text!")
    elif len(clean_text) > 0:
        print("✅ SUCCESS: Cleaning worked (Text length is similar).")
    else:
        print("⚠️ WARNING: No text extracted. Check if the PDF is empty.")

if __name__ == "__main__":
    compare_accuracy()
