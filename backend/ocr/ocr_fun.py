import subprocess
import shutil
import tempfile
from pathlib import Path


def check_dependencies():
    """
    Check whether required OCR tools are available in the system.
    Requires:
      - Poppler (pdftoppm) for PDF to image conversion
      - Tesseract OCR for text extraction
    """
    if not shutil.which("pdftoppm"):
        raise RuntimeError("Poppler (pdftoppm) not found in PATH. Install Poppler and ensure it's accessible.")
    if not shutil.which("tesseract"):
        raise RuntimeError("Tesseract not found in PATH. Install Tesseract OCR and ensure it's accessible.")


def pdf_to_images(pdf_path: Path, output_prefix: Path):
    """
    Convert PDF pages to PNG images using Poppler (pdftoppm).
    Each page will be saved as page-1.png, page-2.png, etc.
    """
    subprocess.run(
        ["pdftoppm", "-png", "-r", "300", str(pdf_path), str(output_prefix)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=True
    )


def image_to_text(image_path: Path) -> str:
    """
    Extract text from a single image using Tesseract OCR.
    Returns the recognized text as a string.
    """
    result = subprocess.run(
        ["tesseract", str(image_path), "stdout"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=True
    )
    return result.stdout.decode("utf-8", errors="replace")


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Main OCR service function.
    Takes a PDF file path and returns extracted text.
    Steps:
      1. Verify file exists
      2. Check dependencies
      3. Convert PDF pages to images
      4. Run OCR on each image
      5. Return combined text
    """
    pdf_path = Path(pdf_path)

    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    # Check OCR dependencies
    check_dependencies()

    extracted_text = []

    # Temporary folder for storing page images
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_dir = Path(tmp_dir)
        output_prefix = tmp_dir / "page"

        # Step 1: PDF -> Images
        pdf_to_images(pdf_path, output_prefix)

        # Step 2: Images -> Text
        images = sorted(tmp_dir.glob("page-*.png"))
        if not images:
            raise RuntimeError("No images generated from PDF. Check if Poppler is working correctly.")

        for img in images:
            page_text = image_to_text(img)
            extracted_text.append(page_text.strip())

    # Step 3: Return combined text
    return "\n".join(extracted_text)
