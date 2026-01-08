from fastapi import FastAPI, UploadFile, File, Request
from fastapi.templating import Jinja2Templates
from pathlib import Path
import shutil
import re

from PIL import Image
import pytesseract
from pdf2image import convert_from_path

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

app = FastAPI()
templates = Jinja2Templates(directory="templates")

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# 🟢 Store latest SLA result (temporary, in-memory)
LATEST_SLA = {
    "apr": "N/A",
    "monthly_payment": "N/A",
    "term_months": "N/A"
}

@app.get("/")
def root():
    return {"status": "Backend running"}

# ---------- Upload ----------
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = UPLOAD_DIR / file.filename
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"filename": file.filename}

# ---------- OCR ----------
@app.post("/ocr")
async def ocr(filename: str):
    global LATEST_SLA

    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        return {"error": "File not found"}

    if file_path.suffix.lower() == ".pdf":
        images = convert_from_path(
        file_path,
        first_page=1,
        last_page=1,
        poppler_path=r"C:\poppler-25.12.0\Library\bin"
    )

        text = pytesseract.image_to_string(images[0])
    else:
        text = pytesseract.image_to_string(Image.open(file_path))

    LATEST_SLA = extract_sla_fields(text)

    return {
        "sla_summary": LATEST_SLA,
        "raw_text": text
    }

# ---------- Dashboard ----------
@app.get("/dashboard")
def dashboard(request: Request):
    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request,
            "apr": LATEST_SLA["apr"],
            "payment": LATEST_SLA["monthly_payment"],
            "term": LATEST_SLA["term_months"]
        }
    )

# ---------- SLA Extraction ----------
def extract_sla_fields(text: str):
    text = text.lower()

    apr = re.search(
        r'(apr|annual percentage rate).*?([\d]+\.?\d*)\s*%',
        text
    )

    payment = re.search(
        r'(monthly payment|emi|instalment|installment).*?([\d,]+)',
        text
    )

    term = re.search(
        r'(tenure|term|duration).*?(\d+)\s*(month|months)',
        text
    )

    return {
        "apr": apr.group(2) + "%" if apr else "Not found",
        "monthly_payment": payment.group(2) if payment else "Not found",
        "term_months": term.group(2) if term else "Not found"
    }

