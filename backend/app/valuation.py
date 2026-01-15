"""
Valuation Engine
Estimates the market fair price of a vehicle.
Supports plug-in architecture for external APIs.
Currently implements a fallback logic based on Linear Depreciation from estimated MSRP.
"""

import logging
from typing import Dict, Optional
import functools
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Mock Database of Base MSRPs (In a real app, this would be a large separate database)
# Used for the fallback estimation logic.
MOCK_MSRP_DB = {
    ("FORD", "F-150"): 45000,
    ("FORD", "MUSTANG"): 35000,
    ("FORD", "EXPLORER"): 40000,
    ("TOYOTA", "CAMRY"): 28000,
    ("TOYOTA", "COROLLA"): 23000,
    ("TOYOTA", "RAV4"): 30000,
    ("HONDA", "CIVIC"): 25000,
    ("HONDA", "ACCORD"): 29000,
    ("TESLA", "MODEL 3"): 40000,
    ("TESLA", "MODEL Y"): 45000,
    ("BMW", "3 SERIES"): 45000,
    ("MERCEDES-BENZ", "C-CLASS"): 46000
}

DEFAULT_BASE_PRICE = 30000
DEPRECIATION_RATE_YEAR_1 = 0.20  # 20% drop in first year
DEPRECIATION_RATE_SUBSEQUENT = 0.15  # 15% drop per year after

@functools.lru_cache(maxsize=128)
def estimate_fair_price(year: str, make: str, model: str, mileage: int = 12000) -> Dict[str, any]:
    """
    Estimate fair market price based on vehicle details.
    Uses fallback depreciation logic if no external API is configured.
    """
    try:
        # Normalize inputs
        if not all([year, make, model]):
            return {"error": "Missing required fields (Year, Make, Model)", "success": False}
            
        make_upper = make.strip().upper()
        model_upper = model.strip().upper()
        try:
            year_int = int(year)
        except ValueError:
            return {"error": "Invalid Year format", "success": False}

        # 1. Try External APIs (MarketCheck, KBB, etc.)
        # TODO: Implement external API calls here when keys are available
        # external_price = _call_external_valuation_api(...)
        # if external_price: return external_price
        
        # 2. Fallback: Depreciation Logic
        logger.info(f"Using fallback valuation for {year_int} {make_upper} {model_upper}")
        
        # Find Base MSRP
        base_msrp = MOCK_MSRP_DB.get((make_upper, model_upper))
        if not base_msrp:
            # Fuzzy match or default
            # Simple check for partial model match
            for (db_make, db_model), price in MOCK_MSRP_DB.items():
                if db_make == make_upper and (db_model in model_upper or model_upper in db_model):
                    base_msrp = price
                    break
        
        if not base_msrp:
            base_msrp = DEFAULT_BASE_PRICE
            logger.warning(f"Make/Model not found in DB, using default MSRP: {DEFAULT_BASE_PRICE}")

        # Calculate Age
        current_year = datetime.now().year
        age = current_year - year_int
        
        # Calculate Value
        # Depreciate
        current_value = base_msrp
        
        if age < 0:
             # Future model year?
             age = 0
             
        for i in range(age):
            if i == 0:
                rate = DEPRECIATION_RATE_YEAR_1
            else:
                rate = DEPRECIATION_RATE_SUBSEQUENT
            current_value = current_value * (1 - rate)

        # Mileage Adjustment (Simple heuristic: -0.05 per mile over avg)
        avg_mileage = age * 12000
        if mileage > avg_mileage:
            excess_miles = mileage - avg_mileage
            deduction = excess_miles * 0.05 # 5 cents per mile
            current_value -= deduction
        
        # Floor value
        if current_value < 2000:
            current_value = 2000

        return {
            "success": True,
            "estimated_price": round(current_value, 2),
            "currency": "USD",
            "method": "DepreciationFallback",
            "base_msrp_used": base_msrp,
            "details": {
                "age_years": age,
                "depreciation_applied": f"{round((1 - (current_value/base_msrp))*100, 1)}%"
            }
        }

    except Exception as e:
        logger.error(f"Valuation error: {str(e)}")
        return {"error": str(e), "success": False}
