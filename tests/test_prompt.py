import sys
import os

# --- FIX: Add the project root to Python's path ---
# This tells Python: "Look one folder up (..)" to find 'backend'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app.llm_service import extract_contract_data

# Sample text that simulates a contract with hidden fees
mock_contract_text = """
The lessee agrees to pay a Monthly Payment of $450 for a Lease Term of 36 Months.
The Interest Rate (APR) is 6.5%.
Additional charges include a Doc Prep Fee of $499, a Nitrogen Tire Fill fee of $199, 
and a VIN Etching service for $250.
"""

print("🚀 Testing LLM Extraction Logic...")
data = extract_contract_data(mock_contract_text)

print("\n--- Extracted JSON ---")
print(data)

# Verification Logic
# Note: In Simulation Mode, we check against the mock data in llm_service.py
# If using Real Mode, we check the extraction from the text above.
if "Nitrogen" in str(data.get("Junk Fees", [])):
    print("\n✅ SUCCESS: The prompt successfully identified the Nitrogen fee.")
else:
    print("\n❌ FAILURE: The prompt missed the junk fees.")
