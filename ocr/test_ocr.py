import os
import subprocess
import pytesseract
from PIL import Image

# Configure tesseract (adjust if your installation is elsewhere)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Compute paths relative to this script so it's reproducible when run from any cwd
here = os.path.dirname(os.path.abspath(__file__))
poppler_bin = r"C:\poppler\poppler-25.12.0\Library\bin"   # path to pdftoppm.exe
pdftoppm_exe = os.path.join(poppler_bin, "pdftoppm.exe")
pdf_file = os.path.normpath(os.path.join(here, os.pardir, "samples", "file1.pdf"))
output_txt = os.path.join(here, "output.txt")
output_prefix = os.path.join(here, "page")

# Step 1: Convert PDF → PNG images using Poppler directly
print("Converting PDF to images using Poppler...")
if not os.path.exists(pdftoppm_exe):
    raise FileNotFoundError(f"pdftoppm not found at {pdftoppm_exe}")
if not os.path.exists(pdf_file):
    raise FileNotFoundError(f"PDF file not found at {pdf_file}")

proc = subprocess.run([pdftoppm_exe, "-png", pdf_file, output_prefix], capture_output=True, text=True)
if proc.returncode != 0:
    print("pdftoppm stderr:", proc.stderr)
    raise RuntimeError("pdftoppm failed")

# Step 2: OCR all generated images
print("Running OCR...")
text_output = []

# Find all generated image files page-1.png, page-2.png, ... in the script directory
for img_name in sorted([f for f in os.listdir(here) if f.startswith("page") and f.endswith(".png")]):
    img_path = os.path.join(here, img_name)
    img = Image.open(img_path)
    text = pytesseract.image_to_string(img)
    text_output.append(f"----- {img_name} -----\n{text}\n")
    print(f"OCR done for {img_name}")

# Step 3: Save output
with open(output_txt, "w", encoding="utf-8") as f:
    f.write("\n".join(text_output))

print("OCR Completed. Output saved to:", output_txt)
