
import requests
import json
import time

BASE_URL = 'http://localhost:8000'
SAMPLE_FILE = 'samples/contract2.pdf'

def test_e2e():
    print(f"1. Uploading {SAMPLE_FILE}...")
    with open(SAMPLE_FILE, 'rb') as f:
        r = requests.post(f"{BASE_URL}/upload", files={"file": ("contract2.pdf", f, "application/pdf")})
    
    if r.status_code != 200:
        print(f"FAILED Upload: {r.text}")
        return

    data = r.json()
    file_id = data.get('file_id')
    print(f"SUCCESS: File ID {file_id}")
    
    # Wait for processing if needed
    time.sleep(2)
    
    print("\n2. Testing Chatbot...")
    r_chat = requests.post(f"{BASE_URL}/negotiate/chat/{file_id}", json={"message": "What is the monthly payment?"})
    if r_chat.status_code == 200:
        print(f"SUCCESS: {r_chat.json().get('response')[:100]}...")
    else:
        print(f"FAILED Chat: {r_chat.status_code} - {r_chat.text}")
        
    print("\n3. Testing Negotiation Email Generator...")
    r_neg = requests.get(f"{BASE_URL}/negotiate/script/{file_id}")
    if r_neg.status_code == 200:
        print(f"SUCCESS: {r_neg.json().get('script')[:100]}...")
    else:
        print(f"FAILED Neg Script: {r_neg.status_code} - {r_neg.text}")

if __name__ == "__main__":
    test_e2e()
