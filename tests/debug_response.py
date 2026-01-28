"""Debug analysis response"""
import requests
import json
import os

API_URL = "http://localhost:8000"

# Upload contract
sample_file = "samples/contract1.pdf"
with open(sample_file, 'rb') as f:
    files = {'file': (os.path.basename(sample_file), f, 'application/pdf')}
    response = requests.post(f"{API_URL}/upload", files=files)

data = response.json()
file_id = data['file_id']

print("=" * 60)
print("UPLOAD RESPONSE")
print("=" * 60)
print(json.dumps(data, indent=2))

# Get contract
response = requests.get(f"{API_URL}/contract/{file_id}")
contract_data = response.json()

print("\n" + "=" * 60)
print("CONTRACT DATA")
print("=" * 60)
print(json.dumps(contract_data, indent=2))
