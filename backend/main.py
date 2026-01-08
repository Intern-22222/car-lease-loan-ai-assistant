# backend/main.py

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os
import uuid
import json
from datetime import datetime
from dotenv import load_dotenv
import psycopg2
import boto3
from botocore.exceptions import BotoCoreError, ClientError

from backend.ocr import run_ocr  # OCR function

load_dotenv()

# ------------------------------
# CONFIG
# ------------------------------

USE_S3 = os.getenv("USE_S3", "0") == "1"
S3_BUCKET = os.getenv("S3_BUCKET", "")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

UPLOAD_DIR = "data/uploads"
TEXT_DIR = "data/text"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(TEXT_DIR, exist_ok=True)

# DATABASE CONFIG
DB_HOST = "localhost"
DB_PORT = 5432
DB_NAME = "contractdb"
DB_USER = "admin"
DB_PASS = "manvi123"

app = FastAPI(title="Car Lease Backend")

# ------------------------------
# LOCAL FILE UPLOAD
# ------------------------------

def upload_to_local(file_id: str, file: UploadFile) -> dict:
    filename = f"{file_id}_{file.filename}"
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as f:
        f.write(file.file.read())
    return {"file_id": file_id, "filename": filename, "file_path": path}

# ------------------------------
# S3 UPLOAD (OPTIONAL)
# ------------------------------

def upload_to_s3(file_id: str, file: UploadFile) -> dict:
    s3 = boto3.client("s3", region_name=AWS_REGION)
    key = f"{file_id}/{file.filename}"
    try:
        file.file.seek(0)
        s3.upload_fileobj(file.file, S3_BUCKET, key)
        return {
            "file_id": file_id,
            "filename": file.filename,
            "s3_path": f"s3://{S3_BUCKET}/{key}"
        }
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=500, detail=f"S3 upload failed: {e}")

# ------------------------------
# HEALTH CHECK
# ------------------------------

@app.get("/health")
def health():
    return {"status": "ok"}

# ------------------------------
# UPLOAD ENDPOINT
# ------------------------------

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())

    if USE_S3:
        result = upload_to_s3(file_id, file)
    else:
        result = upload_to_local(file_id, file)

    result["uploaded_at"] = datetime.utcnow().isoformat()
    return JSONResponse(result)

# ------------------------------
# DB SAVE (OCR DATA)
# ------------------------------

def save_to_db(file_id, file_path, text_path, extracted_text):
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME
        )
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO contracts 
            (id, file_path, text_path, extracted_text, ingested_at, analysis_status)
            VALUES (%s, %s, %s, %s, NOW(), 'PENDING')
        """, (file_id, file_path, text_path, extracted_text))

        conn.commit()
        cur.close()
        conn.close()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB insert failed: {e}")

# ------------------------------
# OCR ENDPOINT
# ------------------------------

@app.post("/ocr/{file_id}")
def ocr(file_id: str):

    matches = [f for f in os.listdir(UPLOAD_DIR) if f.startswith(file_id)]
    if not matches:
        raise HTTPException(status_code=404, detail="Uploaded file not found")

    filename = matches[0]
    pdf_path = os.path.join(UPLOAD_DIR, filename)
    text_output_path = os.path.join(TEXT_DIR, f"{file_id}.txt")

    extracted_text = run_ocr(pdf_path, text_output_path)

    save_to_db(
        file_id=file_id,
        file_path=pdf_path,
        text_path=text_output_path,
        extracted_text=extracted_text
    )

    return {
        "file_id": file_id,
        "text_path": text_output_path,
        "text_length": len(extracted_text),
        "analysis_status": "PENDING"
    }

# ------------------------------
# ANALYSIS FUNCTION
# ------------------------------

def analyze_and_save(file_id: str):
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME
        )
        cur = conn.cursor()

        cur.execute("SELECT extracted_text FROM contracts WHERE id = %s", (file_id,))
        row = cur.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Contract not found")

        extracted_text = row[0]

        # MOCK AI EXTRACTION
        extracted_data = {
            "apr": "7.5%",
            "monthly_payment": "12000",
            "lease_term": "36 months"
        }

        cur.execute("""
            UPDATE contracts
            SET extracted_data = %s,
                analysis_status = 'COMPLETED'
            WHERE id = %s
        """, (json.dumps(extracted_data), file_id))

        conn.commit()
        cur.close()
        conn.close()

        return extracted_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {e}")

# ------------------------------
# ANALYZE ENDPOINT
# ------------------------------

@app.post("/analyze/{file_id}")
def analyze(file_id: str):
    extracted_data = analyze_and_save(file_id)
    return {
        "file_id": file_id,
        "analysis_status": "COMPLETED",
        "extracted_data": extracted_data
    }
