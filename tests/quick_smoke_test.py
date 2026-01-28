"""Quick smoke test for auto-analysis"""
import requests
import os

API_URL = "http://localhost:8000"

# 1. Health check
response = requests.get(f"{API_URL}/health")
assert response.status_code == 200, "Backend not healthy"
print("✅ Backend is UP")

# 2. Upload contract
sample_file = "samples/contract1.pdf"
with open(sample_file, 'rb') as f:
    files = {'file': (os.path.basename(sample_file), f, 'application/pdf')}
    response = requests.post(f"{API_URL}/upload", files=files)

assert response.status_code == 200, "Upload failed"
data = response.json()
file_id = data['file_id']
print(f"✅ Uploaded File ID: {file_id}")

# 3. Check if upload response has analysis
assert 'analysis' in data, "❌ Analysis NOT in upload response!"
print("✅ Upload response includes analysis")

# 4. Verify /contract endpoint
response = requests.get(f"{API_URL}/contract/{file_id}")
contract_data = response.json()

assert 'analysis' in contract_data, "❌ Analysis NOT in contract endpoint!"
print("✅ /contract endpoint includes analysis")

# 5. Check for specific fields
assert contract_data['analysis'].get('contract_type'), "Missing contract_type"
assert contract_data['analysis'].get('monthly_payment') is not None, "Missing monthly_payment"
assert 'risks' in contract_data, "Missing risks"
assert 'fairness_score' in contract_data, "Missing fairness_score"

print("✅ All required fields present")
print("\n⭐ SMOKE TEST PASSED! SLA data issue FIXED!")
