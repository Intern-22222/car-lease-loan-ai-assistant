import shutil
import os
import uuid
import pdfplumber
import psycopg2 
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException

app = FastAPI()

# --- CONFIG ---
BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "data"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Database Credentials
DB_CONFIG = {
    "dbname": "contract_db",
    "user": "user",
    "password": "password",
    "host": "localhost",
    "port": "5432"
}

def get_db_connection():
    try:
        return psycopg2.connect(**DB_CONFIG)
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Service is running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    file_name = f"{file_id}_{file.filename}"
    file_path = UPLOAD_DIR / file_name
    
    # 1. Save file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 2. Save entry to Database
    conn = get_db_connection()
    if conn:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO contracts (filename, status) VALUES (%s, %s)",
            (file_name, "uploaded")
        )
        conn.commit()
        cur.close()
        conn.close()
        
    return {"file_id": file_id, "filename": file_name, "message": "File uploaded & logged in DB"}

@app.post("/ocr/{file_id}")
async def process_ocr(file_id: str):
    # 1. Find file
    target_file = None
    for file in os.listdir(UPLOAD_DIR):
        if file.startswith(file_id):
            target_file = UPLOAD_DIR / file
            break
            
    if not target_file:
        raise HTTPException(status_code=404, detail="File not found")

    # 2. Extract Text
    extracted_text = ""
    try:
        with pdfplumber.open(target_file) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
    except Exception as e:
        return {"error": str(e)}

    # 3. Save Text to Database
    conn = get_db_connection()
    if conn:
        cur = conn.cursor()
        # Update the row that matches this filename
        cur.execute(
            "UPDATE contracts SET raw_text = %s, status = %s WHERE filename = %s",
            (extracted_text, "processed", target_file.name)
        )
        conn.commit()
        cur.close()
        conn.close()

    # NOTE: This message is different from Day 8!
    return {"file_id": file_id, "status": "OCR Completed & Saved to DB"}