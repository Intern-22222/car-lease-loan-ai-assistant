from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from app.services.vin_service import decode_vin
import datetime

router = APIRouter()

class MarketAnalysisResponse(BaseModel):
    vehicle: Dict[str, Any]
    market_price: int
    difference: float
    rating: str
    depreciation_info: str

@router.get("/market-info/{vin}", response_model=MarketAnalysisResponse)
async def get_market_analysis(vin: str, contract_price: float = 0.0):
    vehicle_data = await decode_vin(vin)
    
    if not vehicle_data:
        raise HTTPException(status_code=404, detail="Could not decode VIN.")

    # 1. Dynamic Year & Make extraction
    year = int(vehicle_data.get("Year", 2020))
    make = str(vehicle_data.get("Make", "")).upper()
    current_year = datetime.datetime.now().year
    years_old = max(0, current_year - year)

    # 2. Advanced Brand Categorization
    luxury_brands = ["TESLA", "BMW", "MERCEDES-BENZ", "AUDI", "LEXUS", "PORSCHE", "LAND ROVER", "JAGUAR"]
    economy_stalwarts = ["TOYOTA", "HONDA", "MAZDA"] # These hold value better
    
    base_msrp = 55000 if make in luxury_brands else 32000

    # 3. Non-Linear Depreciation Model
    # Luxury cars lose value faster (0.80), Economy stalwarts lose value slower (0.88)
    if make in luxury_brands:
        depreciation_rate = 0.80 
    elif make in economy_stalwarts:
        depreciation_rate = 0.88
    else:
        depreciation_rate = 0.85 # Standard

    # Formula: MSRP * (Rate ^ Years)
    market_fair_price = int(base_msrp * (depreciation_rate ** years_old))

    # 4. Refined Comparison Logic
    deal_rating = "N/A"
    price_difference = 0.0
    
    if contract_price > 0:
        price_difference = contract_price - market_fair_price
        # Calculate percent over/under market
        diff_percent = (price_difference / market_fair_price) * 100
        
        if diff_percent <= -5:
            deal_rating = "Great Deal! You are paying significantly below market value."
        elif diff_percent <= 5:
            deal_rating = "Fair Deal. The price is highly competitive."
        elif diff_percent <= 15:
            deal_rating = "Market Price. This is a standard retail price."
        else:
            deal_rating = "Overpriced. Consider negotiating at least 10% off."

    return {
        "vehicle": vehicle_data,
        "market_price": market_fair_price,
        "difference": round(price_difference, 2),
        "rating": deal_rating,
        "depreciation_info": f"Based on a {int((1-depreciation_rate)*100)}% annual depreciation model for {make}."
    }