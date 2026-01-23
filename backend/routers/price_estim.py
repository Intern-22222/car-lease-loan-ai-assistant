from fastapi import APIRouter, HTTPException
from backend.services.vin_decoder import decode_vin
# from backend.services.price_estimator import estimate_price

router = APIRouter(tags=["Price Estimation"])


def estimate_price(year: int, make: str, model: str):
    CURRENT_YEAR = 2025
    BASE_PRICE = 30000  # fallback average

    age = max(CURRENT_YEAR - year, 0)
    depreciation = age * 0.07  # 7% yearly

    estimated_price = BASE_PRICE * (1 - depreciation)

    return round(max(estimated_price, 8000), 2)


@router.post("/price_estimate")
def price_estimate(vin: str):
    # Decode VIN
    vehicle = decode_vin(vin)

    if not vehicle:
        raise HTTPException(status_code=400, detail="Invalid VIN")

    year = vehicle.get("year")
    make = vehicle.get("make")
    # model = vehicle.get("model")
    model = (
    vehicle.get("model")
    or vehicle.get("series")
    or vehicle.get("trim")
    or "Not Found"
)


    if not all([year, make, model]):
        raise HTTPException(
            status_code=400,
            detail={
            "message": "Incomplete vehicle data extracted from VIN",
            "year": year,
            "make": make,
            "model": model
        }
        )

    price = estimate_price(year, make, model)

    return {
        "vin": vin,
        "vehicle": vehicle,
        "market_fair_price": price
    }
