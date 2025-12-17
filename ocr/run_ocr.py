import os
import subprocess
import shutil
import sys


def main():
    try:
        import pytesseract
    except Exception:
        print("Missing Python package: pytesseract. Install with: pip install pytesseract")
        sys.exit(1)

    try:
        from PIL import Image
    except Exception:
        print("Missing Python package: pillow. Install with: pip install pillow")
        sys.exit(1)

    # Step 0: Auto-detect executables
    tesseract_cmd = shutil.which("tesseract")
    pdftoppm_cmd = shutil.which("pdftoppm")

    if not tesseract_cmd:
        raise FileNotFoundError("Tesseract not found! Please install it and add to PATH.")
    if not pdftoppm_cmd:
        raise FileNotFoundError("Poppler pdftoppm not found! Please install Poppler and add to PATH.")

    # Configure pytesseract
    import pytesseract as _pytesseract
    _pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

    # Step 1: Paths
    here = os.path.dirname(os.path.abspath(__file__))
    pdf_file = os.path.join(here, "..", "samples", "file1.pdf")
    pdf_file = os.path.normpath(pdf_file)
    output_txt = os.path.join(here, "output.txt")
    output_prefix = os.path.join(here, "page")

    # Step 2: Convert PDF → PNG
    print("Converting PDF to images using Poppler...")
    if not os.path.exists(pdf_file):
        raise FileNotFoundError(f"PDF file not found at {pdf_file}")

    proc = subprocess.run([pdftoppm_cmd, "-png", pdf_file, output_prefix], capture_output=True, text=True)
    if proc.returncode != 0:
        print("pdftoppm stderr:", proc.stderr)
        raise RuntimeError("pdftoppm failed")

    # Step 3: OCR
    print("Running OCR...")
    text_output = []

    for img_name in sorted([f for f in os.listdir(here) if f.startswith("page") and f.endswith(".png")]):
        img_path = os.path.join(here, img_name)
        img = Image.open(img_path)
        text = _pytesseract.image_to_string(img)
        text_output.append(f"----- {img_name} -----\n{text}\n")
        print(f"OCR done for {img_name}")

    # Step 4: Save text
    with open(output_txt, "w", encoding="utf-8") as f:
        f.write("\n".join(text_output))

    print("OCR Completed. Output saved to:", output_txt)


if __name__ == "__main__":
    main()
