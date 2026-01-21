from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os
import shutil
from pydantic import BaseModel
from services import decode_vin  

# Initialize FastAPI app
app = FastAPI(title="LeaseIQ AI - Car Lease Loan Assistant")

# Configure CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temporary folder for uploaded files
UPLOAD_FOLDER = "temp_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- Models ---
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"message": "LeaseIQ AI Backend is active"}

# 1. Existing Upload Logic
@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Return simulated summary data + success
        return {
            "status": "success", 
            "filename": file.filename,
            "monthly": "$450.00", 
            "duration": "36 months"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. Existing Chat Logic
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    reply = f"I am analyzing your request: {request.message}"
    return {"reply": reply}

# 3. NEW: Milestone 4 - VIN Decoding & Market Info

@app.get("/market-info/{vin}")
async def get_market_info(vin: str, contract_price: float = 0.0):
    if len(vin) != 17:
        raise HTTPException(status_code=400, detail="VIN must be 17 characters.")
    
    # 1. Decode VIN
    vehicle_data = await decode_vin(vin)
    if not vehicle_data:
        raise HTTPException(status_code=404, detail="Could not decode VIN.")

    # 2. Calculate Market Price 
    year = int(vehicle_data.get("Year", 2020))
    make = vehicle_data.get("Make", "").upper()
    
    luxury_brands = ["TESLA", "BMW", "MERCEDES-BENZ", "AUDI", "LEXUS", "PORSCHE"]
    base_msrp = 55000 if make in luxury_brands else 32000
    
    current_year = 2026
    years_old = max(0, current_year - year)
    market_fair_price = int(base_msrp * (0.85 ** years_old))

    # --- Task 3: Comparison Logic ---
    deal_rating = "N/A"
    price_difference = 0.0
    
    if contract_price > 0:
        price_difference = contract_price - market_fair_price
        
        # Calculate percentage difference
        diff_percent = (price_difference / market_fair_price) * 100
        
        if diff_percent <= 0:
            deal_rating = "Great Deal! You are paying below market value."
        elif diff_percent <= 10:
            deal_rating = "Fair Deal. The price is within a reasonable range."
        else:
            deal_rating = "Bad Deal. This vehicle is overpriced compared to market data."

    return {
        "status": "success",
        "vehicle": f"{year} {make} {vehicle_data.get('Model', '')}",
        "analysis": {
            "market_price": market_fair_price,
            "your_price": contract_price,
            "difference": price_difference,
            "deal_rating": deal_rating
        },
        "details": vehicle_data
    }