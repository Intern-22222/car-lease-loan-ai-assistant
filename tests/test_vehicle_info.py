"""
Test that vehicle_info is now included in analysis
"""
import requests
import json

API_URL = "http://localhost:8000"

print("=" * 70)
print("TESTING VEHICLE INFO EXTRACTION")
print("=" * 70)

# Upload a contract
with open('samples/contract1.pdf', 'rb') as f:
    response = requests.post(f"{API_URL}/upload", files={'file': f})

if response.status_code != 200:
    print(f"❌ Upload failed: {response.status_code}")
    exit(1)

data = response.json()
file_id = data['file_id']

print(f"\n✅ Upload successful: {file_id}")

# Check if analysis has vehicle_info
if 'analysis' in data:
    analysis = data['analysis']
    
    if 'vehicle_info' in analysis:
        print(f"\n✅ vehicle_info field EXISTS in analysis")
        print(f"\nVehicle Info Structure:")
        print(json.dumps(analysis['vehicle_info'], indent=2))
    else:
        print(f"\n❌ vehicle_info field MISSING from analysis")
        print(f"Available fields: {list(analysis.keys())}")
else:
    print(f"\n❌ analysis field missing")

# Check /contract endpoint
print(f"\n🔍 Checking /contract endpoint:")
response = requests.get(f"{API_URL}/contract/{file_id}")
contract_data = response.json()

if 'analysis' in contract_data and 'vehicle_info' in contract_data.get('analysis', {}):
    print(f"✅ /contract endpoint has vehicle_info")
else:
    print(f"❌ /contract endpoint missing vehicle_info")

print("\n" + "=" * 70)
print("IMPACT ON FINAL PROJECT:")
print("=" * 70)
if 'analysis' in data and 'vehicle_info' in data.get('analysis', {}):
    print("✅ FIXED: Vehicle data structure ready for:")
    print("   - Frontend display of VIN, make, model, year")
    print("   - LLM processing of vehicle information")
    print("   - Smoke test validation")
else:
    print("⚠️  NEEDS FIX: Vehicle info structure added but")
    print("   AI analysis needs to populate actual values")
print("=" * 70)
