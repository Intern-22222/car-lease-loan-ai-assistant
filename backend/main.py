"""
Car Lease/Loan Contract Review AI Assistant - Unified Backend
Consolidated FastAPI application with all features integrated.
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import uuid4
import os
import psycopg2
import sqlite3
from dotenv import load_dotenv

from backend.config import settings
from backend.services.pdf_extractor import pdf_extractor
from backend.services.contract_analyzer import contract_analyzer
from backend.logic.fairness_scorer import fairness_scorer
from backend.services.negotiation_engine import negotiation_engine
from backend.services.vin_decoder import vin_decoder

load_dotenv()

# Database Configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 5432))
DB_NAME = os.getenv("DB_NAME", "contractdb")
DB_USER = os.getenv("DB_USER", "admin")
DB_PASS = os.getenv("DB_PASS", "manvi123")

# File paths
UPLOAD_DIR = "data/uploads"
TEXT_DIR = "data/text"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(TEXT_DIR, exist_ok=True)

# Initialize FastAPI app
app = FastAPI(title="Car Lease/Loan AI Negotiator", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================
# DATA MODELS
# ======================

class ChatRequest(BaseModel):
    message: str

class CounterOfferRequest(BaseModel):
    contract_data: Dict[str, Any]
    target_improvements: List[str]

class UserSignup(BaseModel):
    email: str
    name: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# ======================
# IN-MEMORY STORAGE
# ======================

uploaded_contracts: Dict[str, Dict[str, Any]] = {}

# ======================
# DATABASE HELPERS
# ======================

def get_db_connection():
    """Get database connection (PostgreSQL with SQLite fallback)"""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME
        )
        return conn, "postgresql"
    except Exception as e:
        # Fallback to SQLite
        sqlite_db = "contract_assistant.db"
        conn = sqlite3.connect(sqlite_db, check_same_thread=False)
        
        # Initialize SQLite tables if needed
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS contracts (
                id TEXT PRIMARY KEY,
                file_path TEXT,
                text_path TEXT,
                extracted_text TEXT,
                ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                analysis_status TEXT DEFAULT 'PENDING'
            )
        """)
        conn.commit()
        return conn, "sqlite"

def save_to_db(file_id: str, file_path: str, text_path: str, extracted_text: str):
    """Save contract data to database"""
    conn = None
    try:
        conn, db_type = get_db_connection()
        cur = conn.cursor()

        if db_type == "postgresql":
            cur.execute("""
                INSERT INTO contracts 
                (id, file_path, text_path, extracted_text, ingested_at, analysis_status)
                VALUES (%s, %s, %s, %s, NOW(), 'PENDING')
                ON CONFLICT (id) DO UPDATE SET
                    file_path = EXCLUDED.file_path,
                    text_path = EXCLUDED.text_path,
                    extracted_text = EXCLUDED.extracted_text,
                    ingested_at = NOW()
            """, (file_id, file_path, text_path, extracted_text))
        else:
            cur.execute("""
                INSERT OR REPLACE INTO contracts 
                (id, file_path, text_path, extracted_text, ingested_at, analysis_status)
                VALUES (?, ?, ?, ?, datetime('now'), 'PENDING')
            """, (file_id, file_path, text_path, extracted_text))

        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Database operation failed: {e}")
        if conn:
            conn.close()
        return False

# ======================
# API ENDPOINTS
# ======================

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Car Lease/Loan AI Assistant"
    }

@app.post("/signup")
async def signup(user: UserSignup):
    """Create a new user account"""
    conn = None
    try:
        conn, db_type = get_db_connection()
        cur = conn.cursor()
        
        if db_type == "postgresql":
            cur.execute("INSERT INTO users (email, name, password) VALUES (%s, %s, %s)", (user.email, user.name, user.password))
        else:
            cur.execute("INSERT INTO users (email, name, password) VALUES (?, ?, ?)", (user.email, user.name, user.password))
            
        conn.commit()
        return {"message": "User created successfully", "name": user.name}
    except Exception as e:
        if "UNIQUE constraint failed" in str(e) or "duplicate key value" in str(e):
            raise HTTPException(status_code=400, detail="Email already exists")
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")
    finally:
        if conn:
            conn.close()

@app.post("/login")
async def login(user: UserLogin):
    """Login a user"""
    conn = None
    try:
        conn, db_type = get_db_connection()
        cur = conn.cursor()
        
        if db_type == "postgresql":
            cur.execute("SELECT name, password FROM users WHERE email = %s", (user.email,))
        else:
            cur.execute("SELECT name, password FROM users WHERE email = ?", (user.email,))
            
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if row[1] != user.password:
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
        return {"message": "Login successful", "name": row[0], "email": user.email}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")
    finally:
        if conn:
            conn.close()

@app.post("/upload")
async def upload_contract(file: UploadFile = File(...)):
    """
    Upload PDF or image contract file.
    Automatically analyzes the contract and returns complete data.
    Returns file_id for tracking.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Validate file type
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ['.pdf', '.png', '.jpg', '.jpeg']:
        raise HTTPException(status_code=400, detail="Only PDF and image files allowed")

    # Generate unique file ID
    file_id = str(uuid4())
    
    # Save file locally
    filename = f"{file_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    content = await file.read()
    with open(file_path, 'wb') as f:
        f.write(content)
    
    # Extract text using pdfextractor
    try:
        text = pdf_extractor.extract_text(content)
        
        if not text or len(text.strip()) < 50:
            raise HTTPException(status_code=400, detail="Failed to extract meaningful text from file")
        
        # Save to text file
        text_path = os.path.join(TEXT_DIR, f"{file_id}.txt")
        with open(text_path, 'w', encoding='utf-8') as f:
            f.write(text)
        
        # Prepare cleaned text for analysis
        contract_text = text.replace("\n", " ").strip()
        
        # AUTO-ANALYZE: Run contract analysis immediately
        try:
            # AI Analysis with HuggingFace
            analysis = contract_analyzer.analyze_contract(contract_text)
            risks = contract_analyzer.identify_risks(contract_text)
            fairness_score = fairness_scorer.calculate_score(analysis)
            
            # Color coding for UI
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
            
            # Store complete data in memory
            uploaded_contracts[file_id] = {
                "filename": file.filename,
                "file_path": file_path,
                "text_path": text_path,
                "text_raw": text,
                "text_cleaned": contract_text,
                "uploaded_at": datetime.now().isoformat(),
                "analysis": analysis,
                "risks": risks,
                "fairness_score": fairness_score
            }
            
            # Save to database (optional, will fail silently if DB not available)
            save_to_db(file_id, file_path, text_path, text)
            
            return {
                "file_id": file_id,
                "filename": file.filename,
                "text_length": len(text),
                "analysis": analysis,
                "risks": risks,
                "fairness_score": fairness_score,
                "message": "Contract uploaded and analyzed successfully"
            }
            
        except Exception as analysis_error:
            # Fallback: Store without analysis if analysis fails
            uploaded_contracts[file_id] = {
                "filename": file.filename,
                "file_path": file_path,
                "text_path": text_path,
                "text_raw": text,
                "text_cleaned": contract_text,
                "uploaded_at": datetime.now().isoformat()
            }
            
            # Save to database
            save_to_db(file_id, file_path, text_path, text)
            
            return {
                "file_id": file_id,
                "filename": file.filename,
                "text_length": len(text),
                "message": "Contract uploaded successfully. Analysis available at /analyze endpoint.",
                "warning": f"Auto-analysis failed: {str(analysis_error)}"
            }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")




@app.post("/analyze/{file_id}")
async def analyze_contract(file_id: str):
    """
    Analyze uploaded contract using AI.
    Extracts terms, calculates fairness score, identifies risks.
    """
    if file_id not in uploaded_contracts:
        raise HTTPException(status_code=404, detail="Contract not found")

    # Return cached result if already analyzed
    if "analysis" in uploaded_contracts[file_id]:
        return {
            "file_id": file_id,
            "analysis": uploaded_contracts[file_id]["analysis"],
            "risks": uploaded_contracts[file_id]["risks"],
            "fairness_score": uploaded_contracts[file_id]["fairness_score"],
            "note": "Cached result"
        }

    contract_text = uploaded_contracts[file_id]["text_cleaned"]

    # AI Analysis with HuggingFace
    analysis = contract_analyzer.analyze_contract(contract_text)
    if not analysis:
        raise HTTPException(status_code=500, detail="Contract analysis failed")

    # Risk analysis
    risks = contract_analyzer.identify_risks(contract_text)

    # Fairness score calculation
    fairness_score = fairness_scorer.calculate_score(analysis)

    # Color coding for UI
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

    # Cache results
    uploaded_contracts[file_id]["analysis"] = analysis
    uploaded_contracts[file_id]["risks"] = risks
    uploaded_contracts[file_id]["fairness_score"] = fairness_score

    return {
        "file_id": file_id,
        "analysis": analysis,
        "risks": risks,
        "fairness_score": fairness_score
    }


@app.get("/contract/{file_id}")
async def get_contract(file_id: str):
    """Get contract details by file_id"""
    if file_id not in uploaded_contracts:
        raise HTTPException(status_code=404, detail="Contract not found")
    return uploaded_contracts[file_id]


@app.post("/negotiate/script/{file_id}")
async def generate_script(file_id: str):
    """Generate negotiation email script"""
    if file_id not in uploaded_contracts:
        raise HTTPException(status_code=404, detail="Contract not found")

    contract = uploaded_contracts[file_id]

    if "analysis" not in contract:
        raise HTTPException(status_code=400, detail="Contract not analyzed yet. Call /analyze/{file_id} first")

    script = negotiation_engine.generate_negotiation_script(
        contract["analysis"],
        contract["fairness_score"]
    )

    return {"script": script}


@app.post("/negotiate/chat/{file_id}")
async def chat(file_id: str, request: ChatRequest):
    """Chat with AI negotiation assistant"""
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


@app.post("/negotiate/counter-offer")
async def create_counter_offer(request: CounterOfferRequest):
    """Generate counter-offer with improved terms"""
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


@app.get("/decode-vin/{vin}")
async def decode_vin_endpoint(vin: str):
    """
    Decode VIN using NHTSA API
    Returns vehicle make, model, year, and other details
    """
    result = vin_decoder.decode_vin(vin)
    
    if not result.get('success'):
        raise HTTPException(status_code=400, detail=result.get('error', 'VIN decode failed'))
    
    return result


# ======================
# RUN SERVER
# ======================

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("🚗 Car Lease/Loan AI Assistant - Backend Server")
    print("="*60)
    print("\n📍 Server: http://localhost:8000")
    print("📖 API Docs: http://localhost:8000/docs")
    print("\n✅ Ready to accept requests!\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
