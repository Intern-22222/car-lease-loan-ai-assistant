"""
Unified API Controller
Exposes endpoints for the Car Lease/Loan Assistant.
Orchestrates requests between VIN Decoder and Valuation Service.
"""

from typing import Dict, Any, Optional
import logging
from .vin_decoder import decode_vin_nhtsa
from .valuation import estimate_fair_price

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_market_fair_price(vin: str, mileage: int = 12000) -> Dict[str, Any]:
    """
    API Endpoint: Get Market Fair Price for a Vehicle via VIN.
    
    Flow:
    1. Decode VIN (NHTSA API) -> Get Year, Make, Model
    2. Estimate Price (Valuation Service)
    3. Return combined result with metadata
    
    Args:
        vin: 17-char VIN string
        mileage: Current mileage (default 12k/year avg implicit)
        
    Returns:
        JSON-compatible dictionary
    """
    # 1. Decode VIN
    decoded = decode_vin_nhtsa(vin)
    
    if not decoded.get("success"):
        # Just return the error
        return {
            "success": False,
            "error": f"VIN Decode Failed: {decoded.get('error')}",
            "stage": "VIN_DECODE"
        }
        
    # Extract required fields for valuation
    year = decoded.get("year")
    make = decoded.get("make")
    model = decoded.get("model")
    trim = decoded.get("trim")
    
    if not all([year, make, model]):
        return {
            "success": False, 
            "error": "Could not extract Year/Make/Model from VIN to perform valuation.",
            "vin_data": decoded,
            "stage": "DATA_EXTRACTION"
        }

    # 2. Get Valuation
    valuation = estimate_fair_price(year, make, model, mileage)
    
    if not valuation.get("success"):
        return {
            "success": False,
            "error": f"Valuation Failed: {valuation.get('error')}",
            "vin_data": decoded,
            "stage": "VALUATION"
        }
        
    # 3. Combine Results
    return {
        "success": True,
        "input": {
            "vin": vin,
            "mileage": mileage
        },
        "vehicle_details": {
            "year": year,
            "make": make,
            "model": model,
            "trim": trim,
            "type": decoded.get("vehicle_type"),
            "body_class": decoded.get("body_class"),
            "manufacturer": decoded.get("manufacturer"),
            "plant_country": decoded.get("plant_country"),
            "doors": decoded.get("doors"),
        },
        "engine_specs": {
            "cylinders": decoded.get("engine_cylinders"),
            "displacement_l": decoded.get("engine_displacement_l"),
            "horsepower": decoded.get("engine_hp"),
            "fuel_type": decoded.get("fuel_type"),
            "configuration": decoded.get("engine_config"),
        },
        "drivetrain": {
            "transmission": decoded.get("transmission"),
            "transmission_speeds": decoded.get("transmission_speeds"),
            "drive_type": decoded.get("drive_type"),
        },
        "safety_features": {
            "abs": decoded.get("abs"),
            "airbags": decoded.get("airbags"),
            "traction_control": decoded.get("traction_control"),
            "esc": decoded.get("esc"),
            "backup_camera": decoded.get("backup_camera"),
            "blind_spot_monitor": decoded.get("blind_spot_monitor"),
            "lane_departure_warning": decoded.get("lane_departure_warning"),
            "forward_collision_warning": decoded.get("forward_collision_warning"),
        },
        "ev_hybrid_info": {
            "electrification_level": decoded.get("electrification_level"),
            "battery_kwh": decoded.get("battery_kwh"),
            "ev_range": decoded.get("ev_range"),
        },
        "market_value": {
            "price": valuation.get("estimated_price"),
            "currency": valuation.get("currency"),
            "fair_price_range": {
                "low": round(valuation.get("estimated_price") * 0.9, 2), # +/- 10%
                "high": round(valuation.get("estimated_price") * 1.1, 2)
            }
        },
        "metadata": {
            "valuation_method": valuation.get("method"),
            "source": "NHTSA + Internal Depreciation Model"
        }
    }

from .negotiation import NegotiationEngine

negotiator = NegotiationEngine()

def chat_negotiation(user_message: str, context: Dict[str, Any]) -> Dict[str, Any]:
    """
    API Endpoint: Chat with the negotiation AI.
    
    Args:
        user_message: String message from user
        context: Dictionary containing 'vehicle_details' and 'market_value' from the get_market_fair_price output
        
    Returns:
        Dict with 'response' string
    """
    response = negotiator.get_response(user_message, context)
    return {
        "success": True,
        "response": response
    }
