import requests
import json

file_id = "41a352c9-9360-425b-802e-95cf902cb120"
url = f"http://localhost:8000/contract/{file_id}"

try:
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        print(json.dumps(data, indent=2))
        
        # Check for sla_extraction field
        if "sla_extraction" in data:
            print("\n✅ sla_extraction field EXISTS")
        else:
            print("\n❌ sla_extraction field MISSING")
            print(f"Available fields: {list(data.keys())}")
    else:
        print(f"Error: Status {response.status_code}")
except Exception as e:
    print(f"Error: {e}")
