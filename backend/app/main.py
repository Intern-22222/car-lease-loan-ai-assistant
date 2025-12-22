import logging
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

from backend.app.ocr import (
    extract_text_from_pdf,
    extract_text_from_image,
    extract_text_auto,
    OCRException,
    SUPPORTED_IMAGE_EXTENSIONS,
)

# -------------------------------------------------
# Logging
# -------------------------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# -------------------------------------------------
# FastAPI App
# -------------------------------------------------

app = FastAPI(
    title="OCR Service",
    description="Convert PDF and image files to text using OCR",
    version="1.1.0",
)

# -------------------------------------------------
# Configuration
# -------------------------------------------------

OUTPUT_DIR = Path("data/ocr_output").resolve()

# -------------------------------------------------
# Health Check
# -------------------------------------------------

@app.get("/health", tags=["System"])
def health_check():
    return {"status": "ok"}

# -------------------------------------------------
# OCR Endpoint
# -------------------------------------------------

@app.post("/ocr", tags=["OCR"])
def run_ocr(filename: Optional[str] = None):
    """
    Run OCR on a file in samples/.

    - filename: optional PDF or image filename
    - If filename is omitted, auto-detects PDF or image
    """
    try:
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

        if filename is None:
            output_file = extract_text_auto(
                filename=None,
                output_dir=OUTPUT_DIR,
            )
        else:
            suffix = Path(filename).suffix.lower()

            if suffix == ".pdf":
                output_file = extract_text_from_pdf(
                    pdf_filename=filename,
                    output_dir=OUTPUT_DIR,
                )
            elif suffix in SUPPORTED_IMAGE_EXTENSIONS:
                output_file = extract_text_from_image(
                    image_filename=filename,
                    output_dir=OUTPUT_DIR,
                )
            else:
                raise ValueError(f"Unsupported file type: {suffix}")

        return JSONResponse(
            status_code=200,
            content={
                "message": "OCR completed successfully",
                "input_file": filename,
                "output_file": str(output_file),
            },
        )

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except OCRException as e:
        raise HTTPException(status_code=422, detail=str(e))

    except Exception:
        logger.exception("Unexpected OCR failure")
        raise HTTPException(
            status_code=500,
            detail="Internal OCR error",
        )
