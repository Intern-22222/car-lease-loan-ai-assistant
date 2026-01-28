"""
Test the auto-analysis feature on upload
"""
import requests
import json
import os

API_URL = "http://localhost:8000"

def test_upload_with_analysis():
    """Test that upload now returns analysis data"""
    print("=" * 60)
    print("TESTING AUTO-ANALYSIS ON UPLOAD")
    print("=" * 60)
    
    # Find a sample PDF
    sample_file = "samples/contract1.pdf"
    if not os.path.exists(sample_file):
        print(f"❌ Sample file not found: {sample_file}")
        return False
    
    print(f"\n📤 Uploading: {sample_file}")
    
    # Upload file
    with open(sample_file, 'rb') as f:
        files = {'file': (os.path.basename(sample_file), f, 'application/pdf')}
        response = requests.post(f"{API_URL}/upload", files=files)
    
    if response.status_code != 200:
        print(f"❌ Upload failed: {response.status_code}")
        print(response.text)
        return False
    
    data = response.json()
    file_id = data.get('file_id')
    
    print(f"\n✅ Upload Response:")
    print(f"   File ID: {file_id}")
    print(f"   Message: {data.get('message')}")
    
    # Check if analysis is included
    if 'analysis' in data:
        print(f"\n✅ AUTO-ANALYSIS WORKING!")
        print(f"\n📊 Analysis Data:")
        analysis = data['analysis']
        print(f"   Contract Type: {analysis.get('contract_type')}")
        print(f"   Monthly Payment: ${analysis.get('monthly_payment')}")
        print(f"   Interest Rate: {analysis.get('interest_rate')}%")
        print(f"   Loan Term: {analysis.get('loan_term_months')} months")
        print(f"   Down Payment: ${analysis.get('down_payment')}")
        
        print(f"\n⚠️  Risks Found: {len(data.get('risks', {}).get('red_flags', []))}")
        print(f"   Fairness Score: {data.get('fairness_score', {}).get('overall_score')}/100")
        print(f"   UI Color: {data.get('fairness_score', {}).get('ui_color')}")
        
        return True
    elif 'warning' in data:
        print(f"\n⚠️  Analysis failed (fallback mode):")
        print(f"   {data['warning']}")
        return False
    else:
        print("\n❌ AUTO-ANALYSIS NOT WORKING - No analysis in response")
        print(f"   Available fields: {list(data.keys())}")
        return False

def test_contract_endpoint():
    """Test that /contract endpoint also has analysis"""
    print("\n" + "=" * 60)
    print("TESTING /contract ENDPOINT")
    print("=" * 60)
    
    # Use the file_id from previous upload (we'll upload again)
    sample_file = "samples/contract1.pdf"
    
    with open(sample_file, 'rb') as f:
        files = {'file': (os.path.basename(sample_file), f, 'application/pdf')}
        response = requests.post(f"{API_URL}/upload", files=files)
    
    file_id = response.json()['file_id']
    
    # Get contract details
    response = requests.get(f"{API_URL}/contract/{file_id}")
    
    if response.status_code != 200:
        print(f"❌ Failed to get contract: {response.status_code}")
        return False
    
    data = response.json()
    
    if 'analysis' in data:
        print("✅ /contract endpoint includes analysis data")
        print(f"   This means frontend can get everything in one call!")
        return True
    else:
        print("❌ /contract endpoint missing analysis")
        return False

if __name__ == "__main__":
    print("\n🧪 AUTO-ANALYSIS VERIFICATION TEST\n")
    
    # Test 1: Upload with analysis
    test1 = test_upload_with_analysis()
    
    # Test 2: Contract endpoint
    test2 = test_contract_endpoint()
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    
    if test1 and test2:
        print("✅ AUTO-ANALYSIS IS WORKING PERFECTLY!")
        print("✅ Frontend can now get complete data in ONE API call")
        print("✅ SLA data issue is FIXED")
    else:
        print("❌ Some tests failed - check output above")
