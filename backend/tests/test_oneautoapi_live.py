
import os
import requests
from dotenv import load_dotenv

# Load env variables from root .env
root_env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
load_dotenv(root_env_path)

ONEAUTOAPI_KEY = os.getenv("ONEAUTOAPI_KEY")
ONEAUTOAPI_BASE_URL = "https://api.oneautoapi.com"
TEST_VIN = "1HGCG5655WA036874" # 1998 Honda Accord

def test_api():
    if not ONEAUTOAPI_KEY:
        print("❌ ERROR: ONEAUTOAPI_KEY not found in .env")
        return

    print(f"🔑 Testing API Key: {ONEAUTOAPI_KEY[:4]}...{ONEAUTOAPI_KEY[-4:]}")
    
    url = f"{ONEAUTOAPI_BASE_URL}/brego/valuationfromvin/v2/{TEST_VIN}"
    headers = {
        "Authorization": f"Bearer {ONEAUTOAPI_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        print(f"📡 Sending request to: {url}")
        response = requests.get(url, headers=headers, timeout=10)
        
        print(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ SUCCESS: API Key is working!")
            print("--- Response Preview ---")
            print(data)
        elif response.status_code == 401:
            print("❌ FAILURE: Unauthorized (401). The API Key is likely invalid or expired.")
        elif response.status_code == 403:
            print("❌ FAILURE: Forbidden (403). Check permissions or quota.")
        else:
            print(f"⚠️ Warning: received status {response.status_code}")
            print(response.text)

    except Exception as e:
        print(f"❌ CONNECTION ERROR: {e}")

if __name__ == "__main__":
    test_api()
