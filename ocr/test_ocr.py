import os
import pytesseract
from PIL import Image

# Set paths
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
poppler_bin = r"C:\poppler\poppler-25.12.0\Library\bin"   # path to pdftoppm.exe

pdf_file = r"..\samples\file1.pdf"  # your PDF in same folder
output_txt = "output.txt"

# Step 1: Convert PDF → PNG images using Poppler directly
print("Converting PDF to images using Poppler...")
os.system(f'"{poppler_bin}\\pdftoppm.exe" -png "{pdf_file}" "page"')

# Step 2: OCR all generated images
print("Running OCR...")
text_output = []

# Find all generated image files page-1.png, page-2.png, ...
for img_name in sorted([f for f in os.listdir() if f.startswith("page") and f.endswith(".png")]):
    img = Image.open(img_name)
    text = pytesseract.image_to_string(img)
    text_output.append(f"----- {img_name} -----\n{text}\n")
    print(f"OCR done for {img_name}")

# Step 3: Save output
with open(output_txt, "w", encoding="utf-8") as f:
    f.write("\n".join(text_output))

print("OCR Completed. Output saved to:", output_txt)
