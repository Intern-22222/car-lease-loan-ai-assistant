import os
import shutil
from uuid import uuid4
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from .database import Base, engine, get_db
from . import models, schemas
from .ocr import run_ocr

load_dotenv()

# Create tables if they do not exist (for PoC)
Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Service is running"}


def save_to_local(file: UploadFile, file_id: str) -> str:
    base_dir = os.getenv("LOCAL_DATA_DIR", "./data")
    os.makedirs(base_dir, exist_ok=True)
    # Keep original extension
    ext = ""
    if "." in file.filename:
        ext = "." + file.filename.split(".")[-1]
    filename = f"{file_id}{ext}"
    full_path = os.path.join(base_dir, filename)
    with open(full_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return full_path


@app.post("/upload", response_model=schemas.UploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_id = str(uuid4())
    storage_backend = os.getenv("STORAGE_BACKEND", "local")

    if storage_backend == "local":
        storage_path = save_to_local(file, file_id)
        s3_path = storage_path  # logically this is local path, but field name reused
    else:
        # S3 not implemented in this PoC
        raise HTTPException(status_code=500, detail="S3 backend not implemented yet")

    contract = models.Contract(
        file_id=file_id,
        filename=file.filename,
        s3_path=s3_path,
    )
    db.add(contract)
    db.commit()
    db.refresh(contract)

    return {"file_id": file_id, "filename": file.filename}


@app.post("/ocr/{file_id}", response_model=schemas.OCRResponse)
def ocr_file(file_id: str, db: Session = Depends(get_db)):
    contract = db.query(models.Contract).filter(models.Contract.file_id == file_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    if not contract.s3_path:
        raise HTTPException(status_code=400, detail="No file path stored for this contract")

    text = run_ocr(contract.s3_path)
    print("DEBUG OCR TEXT LENGTH:", len(text))   # add this line

    contract.raw_text = text
    contract.text_path = None  # if you later save text to a .txt file, set path here
    contract.ingested_at = datetime.utcnow()

    db.commit()
    db.refresh(contract)

    return {
    "file_id": file_id,
    "text_extracted": bool(text),
    "full_text": text,  
    }

