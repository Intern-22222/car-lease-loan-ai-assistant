from functools import lru_cache
import httpx

@lru_cache(maxsize=100)
def get_cached_vin_data(vin: str):
    url = f"https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/{vin}?format=json"
    
    with httpx.Client() as client:
        response = client.get(url, timeout=10.0)
        if response.status_code != 200:
            return None
        
        data = response.json()
        results = data.get("Results", [])
        
        car_info = {}
        mapping = {"Make": "Make", "Model": "Model", "Model Year": "Year", "Trim": "Trim"}
        
        for item in results:
            if item.get("Variable") in mapping and item.get("Value"):
                car_info[mapping[item.get("Variable")]] = item.get("Value")
        return car_info

async def decode_vin(vin: str):
    return get_cached_vin_data(vin)