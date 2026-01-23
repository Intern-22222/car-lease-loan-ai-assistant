# import requests

# NHTSA_URL = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/{}?format=json"

# def decode_vin(vin: str):
#     res = requests.get(NHTSA_URL.format(vin))
#     data = res.json()["Results"]

#     def get_value(key):
#         for item in data:
#             if item["Variable"] == key:
#                 return item["Value"]
#         return None

#     return {
#         "vin": vin,
#         "year": get_value("Model Year"),
#         "make": get_value("Make"),
#         "model": get_value("Model")
#     }


import requests

NHTSA_URL = "https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/{vin}?format=json"


def decode_vin(vin: str) -> dict:
    response = requests.get(NHTSA_URL.format(vin=vin), timeout=10)
    response.raise_for_status()

    data = response.json()
    results = data.get("Results", [])

    extracted = {
        "vin": vin,
        "make": None,
        "model": None,
        "year": None,
        "manufacturer": None,
        "vehicle_type": None
    }

    for item in results:
        variable = item.get("Variable")
        value = item.get("Value")

        if not value:
            continue

        if variable == "Make":
            extracted["make"] = value

        elif variable == "Model":
            extracted["model"] = value

        elif variable == "Model Year":
            extracted["year"] = int(value)

        elif variable == "Manufacturer Name":
            extracted["manufacturer"] = value

        elif variable == "Vehicle Type":
            extracted["vehicle_type"] = value

    return extracted
