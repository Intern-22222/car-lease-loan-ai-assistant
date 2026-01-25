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
