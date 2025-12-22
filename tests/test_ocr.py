from pathlib import Path

import pytest
import warnings

from backend.app.ocr import (
    extract_text_from_pdf,
    extract_text_from_image,
    extract_text_auto,
    PDF_SOURCE_DIR,
)

warnings.filterwarnings(
    "ignore",
    message=".*pkgutil.find_loader.*",
    category=DeprecationWarning,
)


OUTPUT_DIR = Path("data/ocr_output")


def _ensure_output_dir():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def _has_pdf() -> bool:
    return any(PDF_SOURCE_DIR.glob("*.pdf"))


def _has_image() -> bool:
    return any(
        f.suffix.lower() in {".png", ".jpg", ".jpeg", ".tiff", ".bmp"}
        for f in PDF_SOURCE_DIR.iterdir()
    )

# -------------------------------------------------
# Tests
# -------------------------------------------------

def test_extract_text_from_pdf_if_present():
    """
    PDF OCR should generate a non-empty .txt file.
    Does NOT delete previous outputs.
    """
    pdfs = list(PDF_SOURCE_DIR.glob("*.pdf"))
    if not pdfs:
        pytest.skip("No PDF files found in samples/")

    _ensure_output_dir()

    pdf_file = pdfs[0].name

    output_file = extract_text_from_pdf(
        pdf_filename=pdf_file,
        output_dir=OUTPUT_DIR,
    )

    assert output_file.exists()
    assert output_file.suffix == ".txt"
    assert output_file.read_text(encoding="utf-8").strip() != ""


def test_extract_text_from_image_if_present():
    """
    Image OCR should generate a non-empty .txt file.
    Does NOT delete previous outputs.
    """
    images = [
        f for f in PDF_SOURCE_DIR.iterdir()
        if f.suffix.lower() in {".png", ".jpg", ".jpeg", ".tiff", ".bmp"}
    ]
    if not images:
        pytest.skip("No image files found in samples/")

    _ensure_output_dir()

    image_file = images[0].name

    output_file = extract_text_from_image(
        image_filename=image_file,
        output_dir=OUTPUT_DIR,
    )

    assert output_file.exists()
    assert output_file.suffix == ".txt"
    assert output_file.read_text(encoding="utf-8").strip() != ""


def test_extract_text_auto():
    """
    Auto-detection should work for either PDF or image.
    Does NOT delete previous outputs.
    """
    if not (_has_pdf() or _has_image()):
        pytest.skip("No supported files found in samples/")

    _ensure_output_dir()

    output_file = extract_text_auto(
        filename=None,
        output_dir=OUTPUT_DIR,
    )

    assert output_file.exists()
    assert output_file.suffix == ".txt"
    assert output_file.read_text(encoding="utf-8").strip() != ""
