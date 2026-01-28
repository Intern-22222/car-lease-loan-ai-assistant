"""Test HuggingFace API directly"""
import os
from dotenv import load_dotenv
from backend.services.huggingface_service import huggingface_service

load_dotenv()

print("=" * 60)
print("TESTING HUGGINGFACE API")
print("=" * 60)

# Check configuration
print(f"\n📋 Configuration:")
print(f"   HF_TOKEN: {'✅ Set' if huggingface_service.api_key else '❌ Missing'}")
print(f"   Model: {huggingface_service.model}")

# Test simple generation
print(f"\n🧪 Testing text generation...")
test_prompt = """Extract contract details from this text and return JSON:

Monthly Payment: $450
Interest Rate: 5.9%
Loan Term: 60 months

Return in this format:
{"monthly_payment": 450, "interest_rate": 5.9, "loan_term_months": 60}
"""

result = huggingface_service._call_api(test_prompt, max_tokens=200)

if result:
    print(f"✅ API Response received:")
    print(f"   {result[:200]}...")
else:
    print(f"❌ API call failed - check HuggingFace token and model")

# Test analysis function
print(f"\n🧪 Testing analysis function...")
test_text = "This is a car loan agreement with monthly payment of $450, interest rate 5.9%, term 60 months."
analysis = huggingface_service.analyze_with_prompt(
    "Extract loan details as JSON with fields: monthly_payment, interest_rate, loan_term_months",
    test_text
)

print(f"Analysis result:")
print(f"   {analysis}")
