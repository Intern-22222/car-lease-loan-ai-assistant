import pytesseract
from pdf2image import convert_from_bytes
import re
# Import the new modules we just created
from backend.app.preprocessing import preprocess_image
from backend.app.database import save_to_db

# Task-2: Layout Handling
# --psm 6: Assume a single uniform block of text. This is best for contracts.
# If contracts have complex tables, you might switch to --psm 3 (Auto).
LAYOUT_CONFIG = r'--oem 3 --psm 6'

def process_pdf(file_bytes: bytes, filename: str = "upload.pdf") -> str:
    """
    Task-1 & 2 Integrated Function.
    1. Reads PDF bytes.
    2. Cleans images (Noise Reduction).
    3. Extracts text (Layout Handling).
    4. Saves to DB.
    """
    try:
        # Convert PDF to images
        images = convert_from_bytes(file_bytes, dpi=300)
        full_text = ""

        for image in images:
            # 1. NOISE REDUCTION (Task 2)
            clean_img = preprocess_image(image)

            # 2. LAYOUT HANDLING (Task 2)
            text = pytesseract.image_to_string(clean_img, lang='eng', config=LAYOUT_CONFIG)
            full_text += text + "\n"

        # 3. CHECK / VALIDATION (Task 2)
        # Ensure we actually extracted something useful
        if len(full_text.strip()) < 50:
            return "Error: Scanned document appears empty or unreadable."

        # 4. SAVE TO DB (Task 1)
        save_to_db(filename, full_text)

        return full_text

    except Exception as e:
        return f"OCR Failed: {str(e)}"