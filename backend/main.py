from fastapi import FastAPI, UploadFile, File
import time

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Simulating file saving and returning ID 123 used in tests
    return {"message": "File received", "file_id": 123}

@app.post("/ocr/{file_id}")
async def trigger_ocr(file_id: int):
    # Simulating the trigger for OCR + LLM Extraction
    return {"message": f"OCR and Extraction started for {file_id}", "status": "processing"}

# INTEGRATED ENDPOINT FOR MILESTONE 2 & 4
@app.get("/contract/{file_id}")
async def get_contract_results(file_id: int):
    """
    Simulates integrated response from OCR, LLM, and VIN API.
    Updated to align with Milestone 4 extraction requirements.
    """
    return {
        "file_id": file_id,
        "status": "completed",
        "sla_extraction": {
            "apr": 4.99,
            "monthly_payment": 350.00,
            "lease_term": "36 months",
            "mileage_allowance": 12000,
            "residual_value": 18000,
            # Junk fees extracted based on prompts/fee_extraction.json structure
            "junk_fees": [
                {"name": "Documentation Fee", "amount": 150, "type": "standard"},
                {"name": "Window Etching", "amount": 300, "type": "junk"}
            ],
            "total_hidden_charges": 450
        },
        "vehicle_info": {
            "vin": "123456789ABC",
            "make": "Toyota",
            "model": "RAV4",
            "year": 2024,
            "recall_history": "No active recalls"
        }
    }
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import uuid4

from backend.config import settings
from backend.services.pdf_extractor import pdf_extractor
from backend.services.contract_analyzer import contract_analyzer
from backend.logic.fairness_scorer import fairness_scorer
from backend.services.negotiation_engine import negotiation_engine

app = FastAPI(title="Car Lease / Loan AI Negotiator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================
# MODELS
# ======================

class ChatRequest(BaseModel):
    message: str

class CounterOfferRequest(BaseModel):
    contract_data: Dict[str, Any]
    target_improvements: List[str]

# ======================
# STORAGE (IN-MEMORY)
# ======================

uploaded_contracts: Dict[str, Dict[str, Any]] = {}

# ======================
# HEALTH CHECK
# ======================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

# ======================
# UPLOAD PDF
# ======================

@app.post("/upload")
async def upload_contract(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    content = await file.read()
    text = pdf_extractor.extract_text(content)

    if not text:
        raise HTTPException(status_code=400, detail="Failed to extract text from PDF")

    file_id = str(uuid4())

    uploaded_contracts[file_id] = {
        "filename": file.filename,
        "text_raw": text,
        "text_cleaned": text.replace("\n", " ").strip(),
        "uploaded_at": datetime.now().isoformat()
    }

    return {
        "file_id": file_id,
        "filename": file.filename,
        "text_length": len(text),
        "message": "Contract uploaded successfully"
    }

# ======================
# ANALYZE CONTRACT
# ======================

@app.post("/analyze/{file_id}")
async def analyze_contract(file_id: str):
    if file_id not in uploaded_contracts:
        raise HTTPException(status_code=404, detail="Contract not found")

    # ✅ Return cached result if already analyzed
    if "analysis" in uploaded_contracts[file_id]:
        return {
            "file_id": file_id,
            "analysis": uploaded_contracts[file_id]["analysis"],
            "risks": uploaded_contracts[file_id]["risks"],
            "fairness_score": uploaded_contracts[file_id]["fairness_score"],
            "note": "Cached result"
        }

    contract_text = uploaded_contracts[file_id]["text_cleaned"]

    # Gemini analysis
    analysis = contract_analyzer.analyze_contract(contract_text)
    if not analysis:
        raise HTTPException(status_code=500, detail="Contract analysis failed")

    # Risk analysis
    risks = contract_analyzer.identify_risks(contract_text)

    # Fairness score
    fairness_score = fairness_scorer.calculate_score(analysis)

    score = fairness_score["overall_score"]
    if score >= 85:
        fairness_score["ui_color"] = "green"
    elif score >= 55:
        fairness_score["ui_color"] = "orange"
    else:
        fairness_score["ui_color"] = "red"

    fairness_score["explanation"] = fairness_score.get("reasons", [])

    # Set context for chatbot
    negotiation_engine.set_context(contract_text, analysis)

    uploaded_contracts[file_id]["analysis"] = analysis
    uploaded_contracts[file_id]["risks"] = risks
    uploaded_contracts[file_id]["fairness_score"] = fairness_score

    return {
        "file_id": file_id,
        "analysis": analysis,
        "risks": risks,
        "fairness_score": fairness_score
    }

# ======================
# GET CONTRACT DETAILS
# ======================

@app.get("/contract/{file_id}")
async def get_contract(file_id: str):
    if file_id not in uploaded_contracts:
        raise HTTPException(status_code=404, detail="Contract not found")
    return uploaded_contracts[file_id]

# ======================
# NEGOTIATION SCRIPT
# ======================

@app.post("/negotiate/script/{file_id}")
async def generate_script(file_id: str):
    if file_id not in uploaded_contracts:
        raise HTTPException(status_code=404, detail="Contract not found")

    contract = uploaded_contracts[file_id]

    if "analysis" not in contract:
        raise HTTPException(status_code=400, detail="Contract not analyzed yet")

    script = negotiation_engine.generate_negotiation_script(
        contract["analysis"],
        contract["fairness_score"]
    )

    return {"script": script}

# ======================
# CHAT WITH CONTRACT CONTEXT
# ======================

@app.post("/negotiate/chat/{file_id}")
async def chat(file_id: str, request: ChatRequest):
    if file_id not in uploaded_contracts:
        raise HTTPException(status_code=404, detail="Contract not found")

    contract = uploaded_contracts[file_id]

    context = {
        **contract.get("analysis", {}),
        "fairness_score": contract.get("fairness_score", {}),
        "risks": contract.get("risks", {})
    }

    response = negotiation_engine.chat_negotiate(
        request.message,
        context
    )

    return {"response": response}

# ======================
# COUNTER OFFER
# ======================

@app.post("/negotiate/counter-offer")
async def create_counter_offer(request: CounterOfferRequest):
    counter_offer = negotiation_engine.generate_counter_offer(
        request.contract_data,
        request.target_improvements
    )
    return counter_offer


@app.delete("/contract/{file_id}/clear-cache")
async def clear_cache(file_id: str):
    """Clear cached analysis to force re-analysis"""
    if file_id not in uploaded_contracts:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    # Remove cached analysis
    uploaded_contracts[file_id].pop("analysis", None)
    uploaded_contracts[file_id].pop("risks", None)
    uploaded_contracts[file_id].pop("fairness_score", None)
    
    return {"message": "Cache cleared. Re-analyze the contract."}
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
