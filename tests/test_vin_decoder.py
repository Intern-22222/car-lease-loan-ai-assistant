"""
Test VIN Decoder API
"""
import requests

API_URL = "http://localhost:8000"

print("Testing VIN Decoder API")
print("=" * 60)

# Test with valid VIN
test_vins = [
    ("1HGCG5655WA036874", "Honda Accord"),
    ("1G1ZT53826F109149", "Chevrolet Malibu"),
    ("WBADT43452G92394", "BMW"),
    ("INVALID123", "Invalid VIN")
]

for vin, description in test_vins:
    print(f"\nTesting: {vin} ({description})")
    try:
        r = requests.get(f"{API_URL}/decode-vin/{vin}", timeout=15)
        
        if r.status_code == 200:
            data = r.json()
            print(f"  Success: {data.get('make')} {data.get('model')} {data.get('year')}")
        elif r.status_code == 400:
            error = r.json()
            print(f"  Error: {error.get('detail')}")
        else:
            print(f"  HTTP {r.status_code}")
    except Exception as e:
        print(f"  Exception: {e}")

print("\n" + "=" * 60)
print("VIN Decoder Test Complete")
