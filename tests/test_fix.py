
import requests
import json

BASE_URL = 'http://localhost:8000'
SAMPLE_FILE = 'samples/contract11.pdf'

def test_fix():
    print(f"1. Uploading {SAMPLE_FILE}...")
    with open(SAMPLE_FILE, 'rb') as f:
        r = requests.post(f"{BASE_URL}/upload", files={"file": ("contract11.pdf", f, "application/pdf")})
    
    if r.status_code == 200:
        data = r.json()
        fid = data.get('file_id')
        print(f"\n✅ Upload Success - File ID: {fid}")
        
        # Check Fairness Score
        score_data = data.get('fairness_score', {})
        print("\n📊 FAIRNESS SCORE:")
        print(f"Overall: {score_data.get('overall_score')}/100")
        print("Breakdown:", json.dumps(score_data.get('breakdown', {}), indent=2))
        print("Explanation:")
        for exp in score_data.get('explanation', []):
            print(f"- {exp}")

        # Check Email Generation
        print(f"\n2. Generating Negotiation Email for {fid}...")
        r2 = requests.post(f"{BASE_URL}/negotiate/script/{fid}")
        if r2.status_code == 200:
            script = r2.json()['script']
            print("\n✅ Email Generated Successfully!")
            print("-" * 50)
            print(script[:300] + "...")
            print("-" * 50)
        else:
            print(f"❌ Email Generation Failed: {r2.status_code} - {r2.text}")

    else:
        print(f"❌ Upload Failed: {r.status_code} - {r.text}")

if __name__ == "__main__":
    test_fix()
