"""
Valuation Engine
Estimates the market fair price of a vehicle.
Integrates with MarketCheck API for real US market valuations, with fallback to depreciation model.
"""

import os
import logging
import requests
from typing import Dict, Optional
import functools
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MarketCheck Configuration (US)
MARKETCHECK_API_KEY = os.getenv("MARKETCHECK_API_KEY")
MARKETCHECK_BASE_URL = "https://api.marketcheck.com/v2"


def _call_marketcheck(vin: str = None, year: str = None, make: str = None, model: str = None) -> Optional[Dict]:
    """
    Call MarketCheck API to get real US market pricing.
    Uses /search/car/active to find active listings and derive market price.
    """
    if not MARKETCHECK_API_KEY:
        logger.info("MarketCheck API key not configured, skipping external pricing")
        return None
    
    try:
        # Use search endpoint for active listings
        url = f"{MARKETCHECK_BASE_URL}/search/car/active"
        params = {
            "api_key": MARKETCHECK_API_KEY,
            "car_type": "used",
            "rows": 10,  # Get several listings for average
        }
        
        if vin:
            params["vin"] = vin
            params["rows"] = 1
        else:
            # Year/Make/Model lookup
            if year: params["year"] = year
            if make: params["make"] = make.lower()
            if model: params["model"] = model.lower()
        
        logger.info(f"Calling MarketCheck API: {url} with params: {list(params.keys())}")
        response = requests.get(url, params=params, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            listings = data.get("listings", [])
            
            if listings:
                # Calculate average price from listings
                prices = [l.get("price") for l in listings if l.get("price")]
                
                if prices:
                    avg_price = sum(prices) / len(prices)
                    min_price = min(prices)
                    max_price = max(prices)
                    
                    # Get MSRP from first listing if available
                    msrp = listings[0].get("msrp") or listings[0].get("build", {}).get("msrp")
                    
                    logger.info(f"✅ MarketCheck: Found {len(prices)} listings, avg ${avg_price:,.0f}")
                    return {
                        "success": True,
                        "estimated_price": round(avg_price, 2),
                        "msrp": float(msrp) if msrp else None,
                        "currency": "USD",
                        "method": f"MarketCheck ({len(prices)} Active Listings)",
                        "stats": {
                            "avg": round(avg_price, 2),
                            "min": min_price,
                            "max": max_price,
                            "count": len(prices)
                        }
                    }
            else:
                logger.info("MarketCheck: No active listings found for this vehicle")
        
        elif response.status_code == 401:
            logger.warning("MarketCheck: Invalid API key")
        elif response.status_code == 403:
            logger.warning("MarketCheck: API quota exceeded or forbidden")
        else:
            logger.warning(f"MarketCheck error: {response.status_code} - {response.text[:200]}")
            
    except requests.RequestException as e:
        logger.error(f"MarketCheck network error: {e}")
    except Exception as e:
        logger.error(f"MarketCheck parsing error: {e}")
    
    return None


def get_vin_insights(vin: str) -> Dict:
    """
    Get comprehensive VIN insights from MarketCheck.
    Includes: Price history, days on market, similar listings, and market position.
    """
    if not MARKETCHECK_API_KEY or not vin:
        return {"success": False, "error": "API key or VIN not provided"}
    
    insights = {
        "success": True,
        "vin": vin,
        "days_on_market": None,
        "price_history": [],
        "similar_listings": [],
        "market_position": None,
        "negotiation_tips": []
    }
    
    try:
        # 1. Get current listing details (including DOM)
        url = f"{MARKETCHECK_BASE_URL}/search/car/active"
        params = {
            "api_key": MARKETCHECK_API_KEY,
            "vin": vin,
            "rows": 1
        }
        
        response = requests.get(url, params=params, timeout=15)
        if response.status_code == 200:
            data = response.json()
            listings = data.get("listings", [])
            
            if listings:
                listing = listings[0]
                dom = listing.get("dom")  # Days on Market
                price = listing.get("price")
                
                insights["days_on_market"] = dom
                insights["current_price"] = price
                insights["dealer_name"] = listing.get("dealer", {}).get("name")
                insights["city"] = listing.get("dealer", {}).get("city")
                
                # Generate negotiation tips based on DOM
                if dom:
                    if dom > 60:
                        insights["negotiation_tips"].append(f"🔥 Car has been on lot for {dom} days - dealer is likely motivated to sell!")
                    elif dom > 30:
                        insights["negotiation_tips"].append(f"⏰ Listed for {dom} days - some room for negotiation.")
                    else:
                        insights["negotiation_tips"].append(f"📅 Fresh listing ({dom} days) - dealer may hold firm on price.")
        
        # 2. Get similar listings for comparison
        # Use year/make/model from the VIN lookup or parse from data
        if insights.get("current_price"):
            similar_url = f"{MARKETCHECK_BASE_URL}/search/car/active"
            
            # We need year/make/model - get from listing if available
            if listings:
                listing = listings[0]
                year = listing.get("build", {}).get("year")
                make = listing.get("build", {}).get("make")
                model = listing.get("build", {}).get("model")
                
                if all([year, make, model]):
                    similar_params = {
                        "api_key": MARKETCHECK_API_KEY,
                        "year": year,
                        "make": make.lower(),
                        "model": model.lower(),
                        "car_type": "used",
                        "rows": 5
                    }
                    
                    similar_resp = requests.get(similar_url, params=similar_params, timeout=15)
                    if similar_resp.status_code == 200:
                        similar_data = similar_resp.json()
                        similar_listings = similar_data.get("listings", [])
                        
                        # Filter out the current VIN and extract relevant data
                        for sl in similar_listings[:5]:
                            if sl.get("vin") != vin:
                                insights["similar_listings"].append({
                                    "price": sl.get("price"),
                                    "miles": sl.get("miles"),
                                    "city": sl.get("dealer", {}).get("city"),
                                    "dom": sl.get("dom")
                                })
                        
                        # Calculate market position
                        if insights["similar_listings"]:
                            similar_prices = [s["price"] for s in insights["similar_listings"] if s.get("price")]
                            if similar_prices:
                                avg_similar = sum(similar_prices) / len(similar_prices)
                                current = insights.get("current_price", 0)
                                
                                if current > avg_similar * 1.05:
                                    insights["market_position"] = "above_market"
                                    diff = current - avg_similar
                                    insights["negotiation_tips"].append(f"💰 Priced ${diff:,.0f} ABOVE similar cars - negotiate down!")
                                elif current < avg_similar * 0.95:
                                    insights["market_position"] = "below_market"
                                    diff = avg_similar - current
                                    insights["negotiation_tips"].append(f"✅ Good deal! Priced ${diff:,.0f} below similar cars.")
                                else:
                                    insights["market_position"] = "at_market"
                                    insights["negotiation_tips"].append("📊 Priced at market average - fair price.")
        
        logger.info(f"✅ VIN Insights retrieved: {len(insights.get('negotiation_tips', []))} tips generated")
        return insights
        
    except Exception as e:
        logger.error(f"VIN Insights error: {e}")
        return {"success": False, "error": str(e)}


# === Advanced Depreciation Configuration ===


# 1. Base Price Database (Expanded)
MOCK_MSRP_DB = {
    # Trucks & SUVs
    ("FORD", "F-150"): 48000, ("FORD", "EXPLORER"): 42000, ("FORD", "BRONCO"): 45000,
    ("CHEVROLET", "SILVERADO"): 50000, ("RAM", "1500"): 52000, ("JEEP", "WRANGLER"): 40000,
    ("TOYOTA", "TACOMA"): 38000, ("TOYOTA", "4RUNNER"): 45000,
    
    # Economy / Reliable
    ("TOYOTA", "CAMRY"): 30000, ("TOYOTA", "COROLLA"): 25000, ("TOYOTA", "RAV4"): 32000,
    ("HONDA", "CIVIC"): 27000, ("HONDA", "ACCORD"): 31000, ("HONDA", "CR-V"): 34000,
    ("SUBARU", "OUTBACK"): 35000, ("MAZDA", "CX-5"): 33000,

    # Luxury
    ("BMW", "3 SERIES"): 48000, ("BMW", "X5"): 70000, ("BMW", "5 SERIES"): 60000,
    ("MERCEDES-BENZ", "C-CLASS"): 50000, ("MERCEDES-BENZ", "E-CLASS"): 65000,
    ("AUSI", "A4"): 47000, ("AUDI", "Q5"): 52000,
    ("TESLA", "MODEL 3"): 42000, ("TESLA", "MODEL Y"): 48000, ("TESLA", "MODEL S"): 90000,
    ("LEXUS", "RX"): 55000, ("LEXUS", "ES"): 45000
}

DEFAULT_BASE_PRICE = 32000

# 2. Make Segments
SEGMENTS = {
    "LUXURY": ["BMW", "MERCEDES-BENZ", "AUDI", "LEXUS", "LAND ROVER", "JAGUAR", "PORSCHE", "TESLA", "ACURA", "INFINITI", "CADILLAC", "LINCOLN", "VOLVO"],
    "ECONOMY": ["TOYOTA", "HONDA", "MAZDA", "SUBARU"],
    "TRUCK": ["FORD", "CHEVROLET", "GMC", "RAM", "JEEP", "DODGE"]
}

# 3. Depreciation Curves (Year 1 Drop, Annual Drop thereafter)
DEPRECIATION_RATES = {
    "LUXURY":   {"initial": 0.25, "annual": 0.17},  # Steep drop
    "ECONOMY":  {"initial": 0.15, "annual": 0.09},  # Holds value well
    "TRUCK":    {"initial": 0.18, "annual": 0.11},  # Good resale
    "STANDARD": {"initial": 0.20, "annual": 0.14}   # Baseline
}


def _get_segment(make: str) -> str:
    make = make.upper()
    for segment, makes in SEGMENTS.items():
        if make in makes:
            return segment
    return "STANDARD"


def _fallback_depreciation(year_int: int, make_upper: str, model_upper: str, mileage: int) -> Dict:
    """
    Advanced Fallback Valuation Engine.
    Uses segmented depreciation rates and non-linear mileage penalties.
    """
    segment = _get_segment(make_upper)
    logger.info(f"Valuation: {year_int} {make_upper} {model_upper} [Segment: {segment}]")
    
    # 1. Determine Base MSRP
    base_msrp = MOCK_MSRP_DB.get((make_upper, model_upper))
    if not base_msrp:
        # Fuzzy match
        for (db_make, db_model), price in MOCK_MSRP_DB.items():
            if db_make == make_upper and (db_model in model_upper or model_upper in db_model):
                base_msrp = price
                break
    
    if not base_msrp:
        # Segment-based default
        if segment == "LUXURY": base_msrp = 55000
        elif segment == "TRUCK": base_msrp = 45000
        elif segment == "ECONOMY": base_msrp = 28000
        else: base_msrp = DEFAULT_BASE_PRICE
        logger.warning(f"Using default MSRP for {segment}: ${base_msrp}")

    # 2. Calculate Age
    current_year = datetime.now().year
    age = max(0, current_year - year_int)
    
    # 3. Apply Segmented Depreciation
    rates = DEPRECIATION_RATES.get(segment, DEPRECIATION_RATES["STANDARD"])
    current_value = base_msrp
    
    if age > 0:
        # Year 1 drop
        current_value *= (1 - rates["initial"])
        # Subsequent years
        for _ in range(age - 1):
            current_value *= (1 - rates["annual"])

    # 4. Non-Linear Mileage Penalty
    # Standard: 12k miles/year
    expected_mileage = max(10000, age * 12000)
    mileage_diff = mileage - expected_mileage
    
    if mileage_diff > 0:
        # Penalty: starts small, grows exponentially for very high mileage
        # E.g. $0.08 per mile for first 10k over, $0.15 for next, etc.
        # Simplified: Use a multiplier based on % over
        pct_over = mileage_diff / expected_mileage
        
        if pct_over < 0.2: penalty_rate = 0.08  # Mild
        elif pct_over < 0.5: penalty_rate = 0.12 # Low
        else: penalty_rate = 0.20 # High penalty for way over avg
        
        deduction = mileage_diff * penalty_rate
        current_value -= deduction
    elif mileage_diff < 0:
        # Low mileage bonus (capped)
        bonus_miles = abs(mileage_diff)
        bonus = bonus_miles * 0.06
        current_value += min(bonus, base_msrp * 0.10) # Cap bonus at 10% of MSRP

    # 5. Inflation / Market Adjustment (Simulated hardcoded lift)
    # Used car market is still higher than historical norms (~10% boost)
    current_value *= 1.10

    # Floor value
    current_value = max(current_value, 1500)

    return {
        "success": True,
        "estimated_price": round(current_value, 2),
        "currency": "USD",
        "method": "AdvancedDepreciation (v2.0)",
        "base_msrp_used": base_msrp,
        "details": {
            "age_years": age,
            "segment": segment,
            "depreciation_profile": f"Initial -{int(rates['initial']*100)}%, Ann -{int(rates['annual']*100)}%"
        }
    }


@functools.lru_cache(maxsize=128)
def estimate_fair_price(year: str, make: str, model: str, mileage: int = 12000, vin: str = None) -> Dict[str, any]:
    """
    Estimate fair market price based on vehicle details.
    
    Priority:
    1. MarketCheck API (US real market data)
    2. Advanced Depreciation Model (fallback)
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

        # 1. Try MarketCheck API (US) - Best for real market data
        if MARKETCHECK_API_KEY:
            mc_result = _call_marketcheck(vin=vin, year=year, make=make, model=model)
            if mc_result and mc_result.get("success"):
                return mc_result

        # 2. Fallback to advanced depreciation model
        return _fallback_depreciation(year_int, make_upper, model_upper, mileage)

    except Exception as e:
        logger.error(f"Valuation error: {str(e)}")
        return {"error": str(e), "success": False}

