import cv2
import numpy as np
import os
from pdf2image import convert_from_path

# !!! FIX: Import the correct function name 'preprocess_image' !!!
from backend.app.preprocessing import preprocess_image

# Path to a sample PDF
PDF_PATH = "samples/contract_sample_01.pdf" 

def test_visual_cleaning():
    # Check if file exists to prevent crashing
    if not os.path.exists(PDF_PATH):
        print(f"❌ Error: Could not find {PDF_PATH}. Please make sure the file exists.")
        return

    print(f"Processing {PDF_PATH}...")
    
    # 1. Convert first page of PDF to an image
    images = convert_from_path(PDF_PATH, dpi=300)
    original_image = images[0]
    
    # 2. Run your cleaning function
    # !!! FIX: Call the correct function 'preprocess_image' !!!
    cleaned_image = preprocess_image(original_image)
    
    # 3. Convert both to numpy arrays for saving
    orig_np = np.array(original_image)
    clean_np = np.array(cleaned_image)
    
    # 4. Save them side-by-side
    # We convert original back to BGR so colors look right in the PNG
    cv2.imwrite("debug_original.png", cv2.cvtColor(orig_np, cv2.COLOR_RGB2BGR))
    cv2.imwrite("debug_cleaned.png", clean_np)
    
    print("✅ Done! Check 'debug_original.png' and 'debug_cleaned.png' in your folder.")

if __name__ == "__main__":
    test_visual_cleaning()
