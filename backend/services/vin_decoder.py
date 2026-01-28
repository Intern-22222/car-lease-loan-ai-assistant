"""
VIN Decoder Service using NHTSA API
Free government API for VIN decoding
"""
import requests
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class VINDecoderService:
    def __init__(self):
        self.base_url = "https://vpic.nhtsa.dot.gov/api/vehicles"
    
    def decode_vin(self, vin: str) -> Dict[str, Any]:
        """
        Decode VIN using NHTSA API
        
        Args:
            vin: Vehicle Identification Number (17 characters)
        
        Returns:
            Dictionary with vehicle information
        """
        # Validate VIN format
        if not vin or len(vin) != 17:
            return {
                "success": False,
                "error": "Invalid VIN format. VIN must be exactly 17 characters.",
                "vin": vin
            }
        
        try:
            # Call NHTSA API
            url = f"{self.base_url}/DecodeVin/{vin}?format=json"
            response = requests.get(url, timeout=10)
            
            if response.status_code != 200:
                return {
                    "success": False,
                    "error": f"NHTSA API returned status {response.status_code}",
                    "vin": vin
                }
            
            data = response.json()
            
            # Extract useful fields
            results = data.get('Results', [])
            
            # Parse results into structured data
            vehicle_info = self._parse_vin_results(results, vin)
            
            return vehicle_info
            
        except requests.exceptions.Timeout:
            logger.error(f"VIN decode timeout for {vin}")
            return {
                "success": False,
                "error": "Request timeout - NHTSA API is slow",
                "vin": vin
            }
        except Exception as e:
            logger.error(f"VIN decode error for {vin}: {e}")
            return {
                "success": False,
                "error": f"Failed to decode VIN: {str(e)}",
                "vin": vin
            }
    
    def _parse_vin_results(self, results: list, vin: str) -> Dict[str, Any]:
        """Parse NHTSA API results into structured format"""
        
        # Helper to get value by variable name
        def get_value(var_name: str) -> Optional[str]:
            for item in results:
                if item.get('Variable') == var_name:
                    value = item.get('Value')
                    return value if value and value != 'Not Applicable' else None
            return None
        
        # Extract key fields
        make = get_value('Make')
        model = get_value('Model')
        year = get_value('Model Year')
        body_class = get_value('Body Class')
        engine = get_value('Engine Model')
        trim = get_value('Trim')
        manufacturer = get_value('Manufacturer Name')
        
        # Check if VIN was valid
        error_code = get_value('Error Code')
        error_text = get_value('Error Text')
        
        if error_code and error_code != '0':
            return {
                "success": False,
                "error": error_text or "Invalid VIN",
                "vin": vin
            }
        
        # Return structured data
        return {
            "success": True,
            "vin": vin,
            "make": make,
            "model": model,
            "year": int(year) if year and year.isdigit() else None,
            "body_class": body_class,
            "trim": trim,
            "engine": engine,
            "manufacturer": manufacturer,
            "full_results": results  # Include full data for reference
        }

# Global instance
vin_decoder = VINDecoderService()
