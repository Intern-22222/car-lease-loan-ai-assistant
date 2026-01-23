    
import os
from fastapi import APIRouter, HTTPException, UploadFile, File
from backend.services.ocr import extract_text
from backend.services.standrd_txt import extract_std_txt
from backend.routers.price_estim import price_estimate

router = APIRouter(tags=["Upload file/doc"])


@router.post("/uploadfile")
async def upload_file(file: UploadFile = File(...)):
    if not file or file.filename == "":
        raise HTTPException(status_code=400, detail="No file selected")

    # Read file bytes
    file_bytes = await file.read()

    # 1️⃣ OCR / text extraction
    raw_text = extract_text(file_bytes, file.filename)

    if not raw_text:
        raise HTTPException(status_code=400, detail="Unable to extract text")

    # 2️⃣ Standardize extracted text
    extracted = extract_std_txt(raw_text)

    response = {
        "extracted_contract": extracted
    }

    # 3️⃣ Safely extract VIN
    vin = (
        extracted.get("vehicle", {})
        .get("vin")
    )

    # 4️⃣ If VIN exists → estimate price
    if vin:
     response["vin"] = vin
    else:
     response["vin"] = None

    return response
