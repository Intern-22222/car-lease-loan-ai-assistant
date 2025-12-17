import os
import re
import logging
from pathlib import Path
from typing import Optional, List

import pytesseract
from pdf2image import convert_from_path, pdfinfo_from_path
from PIL import Image

# -------------------------------------------------
# Configuration
# -------------------------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PDF_SOURCE_DIR = Path(
    os.getenv("PDF_SOURCE_DIR", "samples")
).resolve()

MAX_PAGES = 100
BATCH_SIZE = 10

SUPPORTED_IMAGE_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".tiff", ".bmp"
}

# -------------------------------------------------
# Exceptions
# -------------------------------------------------

class OCRException(Exception):
    """Predictable OCR failures."""
    pass


# -------------------------------------------------
# Public API
# -------------------------------------------------

def extract_text_from_pdf(
    pdf_filename: Optional[str],
    output_dir: Path,
    dpi: int = 300,
    max_pages: int = MAX_PAGES
) -> Path:
    """
    Convert PDF → images → horizontal text with page-wise separation.
    """

    pdf_filename = pdf_filename or get_any_pdf_filename()
    pdf_path = _resolve_pdf_path(pdf_filename)

    total_pages = _get_page_count(pdf_path)
    if total_pages > max_pages:
        raise OCRException(
            f"PDF has {total_pages} pages; maximum allowed is {max_pages}"
        )

    logger.info(
        "OCR started | file=%s | pages=%s",
        pdf_filename, total_pages
    )

    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / f"{pdf_path.stem}.txt"

    final_text: List[str] = []

    for start_page in range(1, total_pages + 1, BATCH_SIZE):
        end_page = min(start_page + BATCH_SIZE - 1, total_pages)

        images = convert_from_path(
            pdf_path,
            dpi=dpi,
            first_page=start_page,
            last_page=end_page
        )

        for page_index, image in enumerate(images, start=start_page):
            logger.info("OCR page %s", page_index)

            raw_text = pytesseract.image_to_string(
                image,
                lang="eng",
                config="--psm 6"
            )

            page_text = (
                f"\n\n{'=' * 20} PAGE {page_index} {'=' * 20}\n\n"
                f"{_clean_text(raw_text)}"
            )

            final_text.append(page_text)

    output_file.write_text("\n".join(final_text), encoding="utf-8")

    logger.info("OCR completed: %s", output_file)
    return output_file


def extract_text_from_image(
    image_filename: Optional[str],
    output_dir: Path
) -> Path:
    """
    Convert Image → text.
    """

    image_filename = image_filename or get_any_image_filename()
    image_path = _resolve_image_path(image_filename)

    logger.info("OCR started | image=%s", image_filename)

    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / f"{image_path.stem}.txt"

    image = Image.open(image_path)

    raw_text = pytesseract.image_to_string(
        image,
        lang="eng",
        config="--psm 6"
    )

    cleaned_text = _clean_text(raw_text)

    output_file.write_text(cleaned_text, encoding="utf-8")

    logger.info("OCR completed: %s", output_file)
    return output_file


def extract_text_auto(
    filename: Optional[str],
    output_dir: Path
) -> Path:
    """
    Automatically detect file type (PDF or Image) and OCR accordingly.
    """

    if filename is None:
        try:
            return extract_text_from_pdf(None, output_dir)
        except FileNotFoundError:
            return extract_text_from_image(None, output_dir)

    suffix = Path(filename).suffix.lower()

    if suffix == ".pdf":
        return extract_text_from_pdf(filename, output_dir)

    if suffix in SUPPORTED_IMAGE_EXTENSIONS:
        return extract_text_from_image(filename, output_dir)

    raise ValueError(f"Unsupported file type: {suffix}")


# -------------------------------------------------
# Helpers
# -------------------------------------------------

def get_any_pdf_filename() -> str:
    pdfs = list(PDF_SOURCE_DIR.glob("*.pdf"))
    if not pdfs:
        raise FileNotFoundError("No PDF files found in samples/")
    return pdfs[0].name


def get_any_image_filename() -> str:
    images = [
        f for f in PDF_SOURCE_DIR.iterdir()
        if f.suffix.lower() in SUPPORTED_IMAGE_EXTENSIONS
    ]
    if not images:
        raise FileNotFoundError("No image files found in samples/")
    return images[0].name


def _resolve_pdf_path(pdf_filename: str) -> Path:
    if not pdf_filename.lower().endswith(".pdf"):
        raise ValueError("Only PDF files are supported")

    pdf_path = (PDF_SOURCE_DIR / pdf_filename).resolve()

    if not str(pdf_path).startswith(str(PDF_SOURCE_DIR)):
        raise PermissionError("Invalid PDF path traversal")

    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_filename}")

    return pdf_path


def _resolve_image_path(image_filename: str) -> Path:
    suffix = Path(image_filename).suffix.lower()

    if suffix not in SUPPORTED_IMAGE_EXTENSIONS:
        raise ValueError("Unsupported image format")

    image_path = (PDF_SOURCE_DIR / image_filename).resolve()

    if not str(image_path).startswith(str(PDF_SOURCE_DIR)):
        raise PermissionError("Invalid image path traversal")

    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_filename}")

    return image_path


def _get_page_count(pdf_path: Path) -> int:
    info = pdfinfo_from_path(pdf_path)
    return int(info.get("Pages", 0))


def _clean_text(text: str) -> str:
    """
    Normalize OCR output:
    - Fix vertical text
    - Preserve line breaks
    - Improve readability
    """

    text = text.replace("\r", "\n")

    raw_lines = [line.strip() for line in text.split("\n")]

    cleaned_lines = []
    buffer = ""

    for line in raw_lines:
        if not line:
            if buffer:
                cleaned_lines.append(buffer)
                buffer = ""
            cleaned_lines.append("")
            continue

        if len(line) <= 2:
            buffer += line
        else:
            if buffer:
                cleaned_lines.append(buffer)
                buffer = ""
            cleaned_lines.append(line)

    if buffer:
        cleaned_lines.append(buffer)

    final_lines = []
    for line in cleaned_lines:
        line = re.sub(r"\s+", " ", line)
        final_lines.append(line.strip())

    return "\n".join(final_lines).strip()
