#!/usr/bin/env python3

import subprocess
import sys
from pathlib import Path
import shutil
import tempfile

OUT_DIR = Path("data")
OUT_DIR.mkdir(parents=True, exist_ok=True)

def check_program(name):
    path = shutil.which(name)
    if not path:
        raise SystemExit(f"Error: required program '{name}' not found in PATH.")
    return path

def run_pdftoppm(pdf_path: Path, out_prefix: Path):
    """
    Uses pdftoppm to convert the PDF into PNG images.
    Produces files like out_prefix-1.png out_prefix-2.png
    """
    cmd = [
        "pdftoppm",
        "-png",       # produce PNGs
        "-r", "300",  # resolution 300 DPI (increase to 400 if needed)
        str(pdf_path),
        str(out_prefix)
    ]
    subprocess.run(cmd, check=True)

def run_tesseract_on_image(image_path: Path):
    """
    Runs tesseract on a single image and returns the extracted text.
    """
    cmd = ["tesseract", str(image_path), "stdout"]
    result = subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return result.stdout.decode("utf-8", errors="replace")

def main():
    if len(sys.argv) < 2:
        print("Usage: python ocr/test_ocr.py path/to/sample.pdf")
        sys.exit(1)

    pdf_path = Path(sys.argv[1])
    if not pdf_path.exists():
        raise SystemExit(f"PDF not found: {pdf_path}")

    # ensure required programs exist
    check_program("pdftoppm")
    check_program("tesseract")

    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdirp = Path(tmpdir)
        out_prefix = tmpdirp / "page"
        print(f"Converting PDF to images with pdftoppm...")
        run_pdftoppm(pdf_path, out_prefix)

        images = sorted(tmpdirp.glob("page-*.png"))
        if not images:
            raise SystemExit("No images were produced by pdftoppm. Check the PDF and pdftoppm.")

        print(f"Found {len(images)} pages. Running tesseract OCR...")
        all_text = []
        for i, img in enumerate(images, start=1):
            print(f"  OCR page {i}/{len(images)}: {img.name}")
            page_text = run_tesseract_on_image(img)
            all_text.append(f"\n\n==== PAGE {i} ====\n\n")
            all_text.append(page_text)

        # Create output filename based on PDF name
        output_name = pdf_path.stem.replace(" ", "_") + ".txt"
        out_file = OUT_DIR / output_name

        out_file.write_text("".join(all_text), encoding="utf-8")
        print(f"OCR output written to: {out_file.resolve()}")


if __name__ == "__main__":
    main()
