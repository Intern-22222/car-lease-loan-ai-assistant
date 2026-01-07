import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

from fastapi import FastAPI, UploadFile, File
from pathlib import Path
import shutil

from PIL import Image
import pytesseract
from pdf2image import convert_from_path

app = FastAPI()

# Folder where uploaded contracts are stored
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.get("/")
def root():
    return {"status": "Backend running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = UPLOAD_DIR / file.filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "File uploaded successfully",
        "filename": file.filename
    }

@app.post("/ocr")
async def ocr(filename: str):
    file_path = UPLOAD_DIR / filename

    if not file_path.exists():
        return {"error": "File not found"}

    # If uploaded file is a PDF (single-page supported)
    if file_path.suffix.lower() == ".pdf":
        images = convert_from_path(
            file_path,
            first_page=1,
            last_page=1
        )
        text = pytesseract.image_to_string(images[0])

    # If uploaded file is an image
    else:
        text = pytesseract.image_to_string(Image.open(file_path))

    return {
        "filename": filename,
        "extracted_text": text
    }
