
import requests
import json

BASE_URL = 'http://localhost:8000'
SAMPLE_FILE = 'samples/contract11.pdf'

def test_extraction():
    print(f"Uploading {SAMPLE_FILE}...")
    with open(SAMPLE_FILE, 'rb') as f:
        r = requests.post(f"{BASE_URL}/upload", files={"file": ("contract11.pdf", f, "application/pdf")})
    
    if r.status_code == 200:
        data = r.json()
        print(f"\n✅ Upload Success - File ID: {data.get('file_id')}")
        
        analysis = data.get('analysis', {})
        print("\n📋 EXTRACTED CONTRACT TERMS:")
        print("-" * 50)
        
        fields = [
            ('Interest Rate/APR', 'interest_rate_apr'),
            ('Money Factor', 'money_factor'),
            ('Lease Term', 'lease_term_months'),
            ('Monthly Payment', 'monthly_payment'),
            ('Down Payment', 'down_payment'),
            ('Residual Value', 'residual_value'),
            ('Mileage Allowance', 'mileage_allowance'),
            ('Overage Charge', 'mileage_overage_charge'),
            ('Early Termination', 'early_termination_clause'),
            ('Purchase Option', 'purchase_option'),
            ('Maintenance', 'maintenance_responsibility'),
            ('Warranty', 'warranty_coverage'),
            ('Insurance', 'insurance_requirements'),
            ('Late Penalty', 'late_payment_penalty'),
            ('Total Cost', 'total_cost')
        ]
        
        for label, key in fields:
            value = analysis.get(key, 'Not Found')
            print(f"{label:20}: {value}")
        
        print("\n📊 FAIRNESS SCORE:")
        print(json.dumps(data.get('fairness_score', {}), indent=2))
    else:
        print(f"❌ Error: {r.status_code} - {r.text}")

if __name__ == "__main__":
    test_extraction()
