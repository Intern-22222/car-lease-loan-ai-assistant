"""
Test OCR Pipeline with Real PDF Upload
Tests the complete flow: Upload -> Extract Text -> Analyze
"""
import requests
import os

BASE_URL = "http://localhost:8000"
SAMPLE_PDF = "samples/contract1.pdf"

def test_ocr_pipeline():
    """Test complete OCR pipeline with real PDF"""
    
    print("\n" + "="*60)
    print("Testing OCR Pipeline")
    print("="*60)
    
    # 1. Check backend health
    print("\n1. Checking backend health...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
    assert response.status_code == 200
    
    # 2. Upload PDF
    print("\n2. Uploading PDF contract...")
    if not os.path.exists(SAMPLE_PDF):
        print(f"   ERROR: Sample PDF not found at {SAMPLE_PDF}")
        return
    
    with open(SAMPLE_PDF, 'rb') as f:
        files = {'file': ('contract1.pdf', f, 'application/pdf')}
        response = requests.post(f"{BASE_URL}/upload", files=files)
    
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
    
    if response.status_code == 200:
        file_id = response.json()['file_id']
        print(f"   ✅ Upload successful! File ID: {file_id}")
        
        # 3. Analyze contract
        print("\n3. Analyzing contract...")
        response = requests.post(f"{BASE_URL}/analyze/{file_id}")
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            analysis = response.json()
            print(f"   ✅ Analysis successful!")
            print(f"   Fairness Score: {analysis.get('fairness_score', {}).get('overall_score', 'N/A')}")
            print(f"   Contract Type: {analysis.get('analysis', {}).get('contract_type', 'N/A')}")
            
            # 4. Get contract details
            print("\n4. Retrieving contract details...")
            response = requests.get(f"{BASE_URL}/contract/{file_id}")
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                contract = response.json()
                print(f"   ✅ Contract retrieved!")
                print(f"   Text length: {len(contract.get('text_raw', ''))}")
        else:
            print(f"   ❌ Analysis failed: {response.text}")
    else:
        print(f"   ❌ Upload failed: {response.text}")
    
    print("\n" + "="*60)
    print("OCR Pipeline Test Complete")
    print("="*60 + "\n")

if __name__ == "__main__":
    test_ocr_pipeline()
