"""
VIN Decoder Module
Implements VIN decoding using the NHTSA (National Highway Traffic Safety Administration) API.
Includes result caching to optimize performance and reduce API calls.
"""

import requests
import functools
import logging
from typing import Dict, Optional, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

NHTSA_API_URL = "https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/{}?format=json"

@functools.lru_cache(maxsize=128)
def decode_vin_nhtsa(vin: str) -> Dict[str, Any]:
    """
    Decode a VIN using the NHTSA API.
    Results are cached to minimize network requests.
    
    Args:
        vin: 17-character Vehicle Identification Number
        
    Returns:
        Dictionary containing extracted vehicle details (Year, Make, Model, Trim, etc.)
        Returns None or error dict if decoding fails.
    """
    clean_vin = vin.strip().upper()
    
    # Basic validation
    if not clean_vin or len(clean_vin) < 17:
        logger.warning(f"Invalid VIN length: {len(clean_vin)}")
        return {"error": "Invalid VIN length", "success": False}

    try:
        url = NHTSA_API_URL.format(clean_vin)
        logger.info(f"Querying NHTSA API for VIN: {clean_vin}")
        
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Parse NHTSA response format
        # The API returns a list of results under "Results" key.
        # Each item has "Variable" and "Value".
        
        results_list = data.get("Results", [])
        decoded_data = {
            "success": True,
            "vin": clean_vin,
            "raw_api_data": {} # Store raw if needed, but keeping it light mainly
        }
        
        # Helper to extract specific variables
        # We transform the list [{"Variable": "Make", "Value": "Ford"}, ...] 
        # into a direct dict {"Make": "Ford", ...}
        
        info_map = {}
        for item in results_list:
            var_name = item.get("Variable")
            value = item.get("Value")
            if var_name and value:
                info_map[var_name] = value

        # Map to our standard schema - Basic Info
        decoded_data["year"] = info_map.get("Model Year")
        decoded_data["make"] = info_map.get("Make")
        decoded_data["model"] = info_map.get("Model")
        decoded_data["trim"] = info_map.get("Trim")
        decoded_data["vehicle_type"] = info_map.get("Vehicle Type")
        decoded_data["body_class"] = info_map.get("Body Class")
        decoded_data["manufacturer"] = info_map.get("Manufacturer Name")
        decoded_data["plant_country"] = info_map.get("Plant Country")
        
        # Engine Details
        decoded_data["engine_cylinders"] = info_map.get("Engine Number of Cylinders")
        decoded_data["engine_displacement_l"] = info_map.get("Displacement (L)")
        decoded_data["engine_hp"] = info_map.get("Engine Brake (hp) From")
        decoded_data["fuel_type"] = info_map.get("Fuel Type - Primary")
        decoded_data["engine_config"] = info_map.get("Engine Configuration")
        
        # Transmission & Drivetrain
        decoded_data["transmission"] = info_map.get("Transmission Style")
        decoded_data["transmission_speeds"] = info_map.get("Transmission Speeds")
        decoded_data["drive_type"] = info_map.get("Drive Type")
        
        # Body & Dimensions
        decoded_data["doors"] = info_map.get("Doors")
        decoded_data["gross_vehicle_weight"] = info_map.get("Gross Vehicle Weight Rating From")
        decoded_data["curb_weight"] = info_map.get("Curb Weight (pounds)")
        decoded_data["wheel_base"] = info_map.get("Wheel Base (inches) From")
        
        # Safety Features (useful for negotiation!)
        decoded_data["abs"] = info_map.get("Anti-lock Braking System (ABS)")
        decoded_data["airbags"] = info_map.get("Air Bag Loc Front")
        decoded_data["traction_control"] = info_map.get("Traction Control")
        decoded_data["esc"] = info_map.get("Electronic Stability Control (ESC)")
        decoded_data["backup_camera"] = info_map.get("Backup Camera")
        decoded_data["blind_spot_monitor"] = info_map.get("Blind Spot Mon")
        decoded_data["lane_departure_warning"] = info_map.get("Lane Departure Warning (LDW)")
        decoded_data["forward_collision_warning"] = info_map.get("Forward Collision Warning (FCW)")
        
        # EV/Hybrid specific
        decoded_data["electrification_level"] = info_map.get("Electrification Level")
        decoded_data["battery_kwh"] = info_map.get("Battery kWh")
        decoded_data["ev_range"] = info_map.get("EV Range")
        
        # Clean up None values
        decoded_data = {k: v for k, v in decoded_data.items() if v is not None}
        decoded_data["success"] = True  # Ensure success flag is always present
        
        # Identify errors from API (NHTSA sometimes returns success but with error text in fields)
        if info_map.get("Error Text") and info_map.get("Error Text") != "0 - Manufacturer Exception":
             # "0 - Manufacturer Exception" is often default for no error
             # But if there's a real error code:
             err_code = info_map.get("ErrorCode")
             if err_code and err_code != "0":
                 logger.warning(f"NHTSA Error Code {err_code}: {info_map.get('Error Text')}")
                 return {
                     "success": False, 
                     "error": info_map.get("Error Text"),
                     "raw_data": info_map
                 }

        return decoded_data

    except requests.RequestException as e:
        logger.error(f"API Request failed: {str(e)}")
        return {"error": f"Network error: {str(e)}", "success": False}
    except Exception as e:
        logger.error(f"Error decoding VIN: {str(e)}")
        return {"error": f"Decoding error: {str(e)}", "success": False}

if __name__ == "__main__":
    # Quick test
    test_vin = "5YJ3E1EA5LF5" # Invalid/Short for testing
    # Real sample (Tesla Model 3: 5YJ3E1EB9JF1...) - Just using a random pattern might fail check digit but NHTSA usually tries
    # Let's use a known structure or just run file to see basic response
    print("Running VIN Decoder Test...")
