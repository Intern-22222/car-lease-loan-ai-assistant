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
#from .gemini_client import analyze_contract_text, generate_chat_reply
from .groq_client import analyze_contract_text, generate_chat_reply
from .fairness import compute_fairness

from fastapi.middleware.cors import CORSMiddleware

#load_dotenv()
load_dotenv('../.env')

# Create tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow React dev server
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Service is running"}


def save_to_local(file: UploadFile, file_id: str) -> str:
    base_dir = os.getenv("LOCAL_DATA_DIR", "./data")
    os.makedirs(base_dir, exist_ok=True)
    ext = ""
    if file.filename and "." in file.filename:
        ext = "." + file.filename.split(".")[-1]
    filename = f"{file_id}{ext}"
    full_path = os.path.join(base_dir, filename)
    with open(full_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return full_path


@app.post("/upload", response_model=schemas.UploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    file_id = str(uuid4())
    storage_backend = os.getenv("STORAGE_BACKEND", "local")

    if storage_backend == "local":
        storage_path = save_to_local(file, file_id)
        s3_path = storage_path
    else:
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
    contract = (
        db.query(models.Contract)
        .filter(models.Contract.file_id == file_id)
        .first()
    )
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    if not contract.s3_path:
        raise HTTPException(
            status_code=400, detail="No file path stored for this contract"
        )

    text = run_ocr(contract.s3_path)
    contract.raw_text = text
    contract.text_path = None
    contract.ingested_at = datetime.utcnow()

    db.commit()
    db.refresh(contract)

    return {
        "file_id": file_id,
        "text_extracted": bool(text),
        "full_text": text,
    }


# ---------- Milestone 4: Contract analysis & fairness ----------


@app.post(
    "/contracts/{file_id}/analyze",
    response_model=schemas.AnalysisResponse,
)
def analyze_contract(file_id: str, db: Session = Depends(get_db)):
    contract = (
        db.query(models.Contract)
        .filter(models.Contract.file_id == file_id)
        .first()
    )
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    if not contract.raw_text:
        raise HTTPException(
            status_code=400,
            detail="No OCR text found. Run /ocr/{file_id} first.",
        )

    # Call Gemini to get initial JSON
    llm_data = analyze_contract_text(contract.raw_text)
    llm_data["file_id"] = file_id  # ensure file_id is set

    # Validate into a partial model without fairness first
    # Then override fairness using deterministic algorithm
    risk_factors = [
        schemas.RiskFactor(**rf) for rf in llm_data.get("risk_factors", [])
    ]
    price_factors = schemas.PriceFactors(
        **llm_data.get("price_factors", {})
    )
    hidden_fees = [
        schemas.HiddenFee(**hf) for hf in llm_data.get("hidden_fees", [])
    ]

    fairness = compute_fairness(risk_factors, hidden_fees, price_factors)

    analysis_payload = schemas.ContractAnalysisPayload(
        file_id=file_id,
        risk_factors=risk_factors,
        price_factors=price_factors,
        hidden_fees=hidden_fees,
        fairness=fairness,
    )

    # Persist in DB
    existing = (
        db.query(models.ContractAnalysis)
        .filter(models.ContractAnalysis.file_id == file_id)
        .first()
    )
    if existing:
        existing.analysis_json = analysis_payload.model_dump()
    else:
        record = models.ContractAnalysis(
            contract_id=contract.id,
            file_id=file_id,
            analysis_json=analysis_payload.model_dump(),
        )
        db.add(record)

    db.commit()

    return analysis_payload


@app.get(
    "/contracts/{file_id}/analysis",
    response_model=schemas.AnalysisResponse,
)
def get_contract_analysis(file_id: str, db: Session = Depends(get_db)):
    record = (
        db.query(models.ContractAnalysis)
        .filter(models.ContractAnalysis.file_id == file_id)
        .first()
    )
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found")

    return schemas.ContractAnalysisPayload(**record.analysis_json)


# ---------- Milestone 4: Negotiation chatbot ----------


@app.post(
    "/contracts/{file_id}/chat",
    response_model=schemas.ChatResponse,
)
def contract_chat(
    file_id: str,
    request: schemas.ChatRequest,
    db: Session = Depends(get_db),
):
    record = (
        db.query(models.ContractAnalysis)
        .filter(models.ContractAnalysis.file_id == file_id)
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=400,
            detail="No analysis found for this contract. Run /contracts/{file_id}/analyze first.",
        )

    analysis = schemas.ContractAnalysisPayload(**record.analysis_json)

    reply = generate_chat_reply(analysis, request)

    return schemas.ChatResponse(
        assistant_message=reply["assistant_message"],
        counter_email_draft=reply.get("counter_email_draft"),
    )
