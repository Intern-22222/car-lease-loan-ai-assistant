"""
Unified API Controller
Exposes endpoints for the Car Lease/Loan Assistant.
Orchestrates requests between VIN Decoder and Valuation Service.
"""

from typing import Dict, Any, Optional
import logging
import os
import tempfile
from .vin_decoder import decode_vin_nhtsa
from .valuation import estimate_fair_price
from .ocr import process_generic_file
from .negotiation import NegotiationEngine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Negotiator Global
negotiator = NegotiationEngine()

def analyze_document(file_obj, user_prompt: str = None) -> Dict[str, Any]:
    """
    API Endpoint Logic: Analyze uploaded document with optional user prompt.
    1. Save temp file
    2. Extract text (OCR)
    3. Analyze with AI (NegotiationEngine) using user's question
    """
    if not file_obj:
        return {"success": False, "error": "No file provided"}
        
    temp_path = None
    try:
        # Create temp file
        fd, temp_path = tempfile.mkstemp(suffix=os.path.splitext(file_obj.filename)[1])
        os.close(fd)
        
        # Save upload to temp
        file_obj.save(temp_path)
        logger.info(f"Processing document: {file_obj.filename}")
        
        # 1. OCR Extraction
        ocr_result = process_generic_file(temp_path)
        extracted_text = ocr_result.get("text", "")
        
        if not extracted_text:
            return {
                "success": False, 
                "error": "Could not extract text from document. Ensure it's a clear image or PDF."
            }
            
        # 2. AI Analysis with user prompt
        analysis_result = negotiator.analyze_document_text(extracted_text, user_prompt)
        
        return analysis_result
        
    except Exception as e:
        logger.error(f"Document analysis failed: {e}")
        return {"success": False, "error": str(e)}
    finally:
        # Cleanup temp file
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except:
                pass

def get_market_fair_price(vin: str, mileage: int = 12000) -> Dict[str, Any]:
    """
    API Endpoint: Get Market Fair Price for a Vehicle via VIN.
    """
    # 1. Decode VIN
    decoded = decode_vin_nhtsa(vin)
    
    if not decoded.get("success"):
        return {
            "success": False,
            "error": f"VIN Decode Failed: {decoded.get('error')}",
            "stage": "VIN_DECODE"
        }
        
    year = decoded.get("year")
    make = decoded.get("make")
    model = decoded.get("model")
    trim = decoded.get("trim")
    
    if not all([year, make, model]):
        return {
            "success": False, 
            "error": "Could not extract Year/Make/Model from VIN.",
            "vin_data": decoded,
            "stage": "DATA_EXTRACTION"
        }

    # 2. Get Valuation
    valuation = estimate_fair_price(year, make, model, mileage, vin=vin)
    
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
        "input": {"vin": vin, "mileage": mileage},
        "vehicle_details": {
            "year": year, "make": make, "model": model, "trim": trim,
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
                "low": round(valuation.get("estimated_price") * 0.9, 2),
                "high": round(valuation.get("estimated_price") * 1.1, 2)
            }
        },
        "metadata": {
            "valuation_method": valuation.get("method"),
            "source": "NHTSA + MarketCheck/Depreciation"
        }
    }

def chat_negotiation(user_message: str, context: Dict[str, Any], session_id: str = "default") -> Dict[str, Any]:
    """
    API Endpoint: Chat with the negotiation AI.
    
    Args:
        user_message: String message from user
        context: Dictionary containing 'vehicle_details' and 'market_value' from the get_market_fair_price output
        session_id: Unique session identifier for conversation history
        
    Returns:
        Dict with 'response' string and 'history' list
    """
    response = negotiator.get_response(user_message, context, session_id)
    history = negotiator.get_chat_history(session_id)
    return {
        "success": True,
        "response": response,
        "history": history
    }

def get_chat_history(session_id: str = "default") -> Dict[str, Any]:
    """Get the chat history for a session."""
    history = negotiator.get_chat_history(session_id)
    return {
        "success": True,
        "history": history
    }

def clear_chat_history(session_id: str = "default") -> Dict[str, Any]:
    """Clear the chat history for a session."""
    negotiator.clear_chat_history(session_id)
    return {
        "success": True,
        "message": "Chat history cleared"
    }
