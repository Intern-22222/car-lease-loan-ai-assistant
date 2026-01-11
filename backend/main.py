from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import uuid
import os
import re
from collections import Counter
from backend.ocr.ocr_fun import extract_text_from_pdf  # Correct import

app = FastAPI(
    title="Car Lease OCR API",
    description="Extracts text from car lease PDFs, categorizes key terms, and shows keywords.",
    version="1.0.0"
)

# Directory to store uploaded files
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# In-memory store mapping file_id -> file_path
file_store = {}

class OCRRequest(BaseModel):
    file_id: str

# Categories to extract from car lease documents
LEASE_CATEGORIES = {
    "interest_rate": ["interest rate", "APR"],
    "lease_term": ["lease term", "duration"],
    "monthly_payment": ["monthly payment"],
    "down_payment": ["down payment"],
    "residual_value": ["residual value"],
    "mileage_allowance": ["mileage allowance", "overage charges"],
    "early_termination": ["early termination", "termination clause"],
    "purchase_option": ["purchase option", "buyout price"],
    "maintenance": ["maintenance responsibilities"],
    "warranty_insurance": ["warranty", "insurance coverage"],
    "penalties": ["penalties", "late fee"],
}

STOPWORDS = {
    "the", "and", "is", "in", "of", "to", "a", "for", "on", "with", "at", "by", "an",
    "this", "that", "it", "as", "from", "be", "are", "was", "were", "has", "have"
}

def categorize_lease_terms(text: str) -> dict:
    """
    Scan OCR text and categorize values for lease terms.
    """
    categories_found = {}
    for category, keywords in LEASE_CATEGORIES.items():
        for kw in keywords:
            pattern = re.compile(rf"{kw}[:\-]?\s*([^\n\.]+)", re.IGNORECASE)
            match = pattern.search(text)
            if match:
                categories_found[category] = match.group(1).strip()
                break
    return categories_found

def extract_all_keywords(text: str, top_n: int = 20) -> dict:
    """
    Extract top keywords from OCR text by frequency.
    """
    words = re.findall(r"\b\w+\b", text.lower())
    filtered = [w for w in words if w not in STOPWORDS and len(w) > 2]
    freq = Counter(filtered)
    return dict(freq.most_common(top_n))

@app.get("/health")
def health_check():
    """
    Simple health check endpoint.
    """
    return {"status": "ok", "message": "Service is running"}

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    """
    Upload a PDF file and store it locally.
    Returns a unique file_id for later OCR processing.
    """
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    file_store[file_id] = file_path
    return {"file_id": file_id, "filename": file.filename}

@app.post("/ocr")
async def ocr(req: OCRRequest):
    """
    Perform OCR on the uploaded file and return categorized lease terms and keywords.
    """
    file_path = file_store.get(req.file_id)
    if not file_path:
        return {"status": "error", "message": "File not found"}

    # Run OCR
    text = extract_text_from_pdf(file_path)

    # Debug print to terminal (optional)
    print("=== OCR Extracted Text ===")
    print(text)
    print("==========================")

    # Categorize lease terms
    categories = categorize_lease_terms(text)

    # Extract all keywords
    keywords = extract_all_keywords(text)

    return {
        "status": "ok",
        "categories": categories,
        "keywords": keywords,
        "full_text": text
    }
