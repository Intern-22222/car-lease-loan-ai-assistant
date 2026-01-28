
import requests
import json

BASE_URL = 'http://localhost:8000'
SAMPLE_FILE = 'samples/contract2.pdf'

try:
    print(f"Uploading {SAMPLE_FILE}...")
    with open(SAMPLE_FILE, 'rb') as f:
        r = requests.post(f"{BASE_URL}/upload", files={"file": ("contract1.pdf", f, "application/pdf")})
    
    print(f"Status: {r.status_code}")
    data = r.json()
    
    if r.status_code == 200:
        print(f"File ID: {data.get('file_id')}")
        analysis = data.get('analysis', {})
        print("\n--- Analysis Result ---")
        print(json.dumps(analysis, indent=2))
        
        fairness = data.get('fairness_score', {})
        print("\n--- Fairness Score ---")
        print(json.dumps(fairness, indent=2))
    else:
        print(f"Error: {r.text}")
except Exception as e:
    print(f"Exception: {e}")
