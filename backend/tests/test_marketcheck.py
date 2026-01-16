"""
Test MarketCheck API Integration
"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from backend.app.valuation import _call_marketcheck, estimate_fair_price
import logging

# Enable logging to see what's happening
logging.basicConfig(level=logging.INFO)

def test_marketcheck():
    print("=== Testing MarketCheck API ===\n")
    
    # Test 1: Year/Make/Model lookup
    print("Test 1: Looking up 2020 Toyota Camry...")
    result = _call_marketcheck(year="2020", make="Toyota", model="Camry")
    if result and result.get("success"):
        print(f"✅ SUCCESS: ${result['estimated_price']:,.0f}")
        print(f"   Method: {result.get('method')}")
        if result.get('stats'):
            stats = result['stats']
            print(f"   Stats: Avg=${stats.get('avg', 0):,.0f}, Min=${stats.get('min', 0):,}, Max=${stats.get('max', 0):,}, Count={stats.get('count', 0)}")
    else:
        print(f"❌ API returned no data or failed")
        print(f"   Result: {result}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 2: VIN lookup
    test_vin = "1HGCG5655WA036874"  # 1998 Honda Accord
    print(f"Test 2: Looking up VIN {test_vin}...")
    result_vin = _call_marketcheck(vin=test_vin)
    if result_vin and result_vin.get("success"):
        print(f"✅ SUCCESS: ${result_vin['estimated_price']:,.0f}")
        print(f"   Method: {result_vin.get('method')}")
    else:
        print(f"⚠️ VIN lookup returned no data (car may be too old or not in active listings)")
    
    print("\n" + "="*50 + "\n")
    
    # Test 3: Full integration via estimate_fair_price
    print("Test 3: Full valuation flow for 2022 Honda CR-V...")
    full_result = estimate_fair_price("2022", "Honda", "CR-V", 30000)
    print(f"Estimated Price: ${full_result.get('estimated_price', 0):,.0f}")
    print(f"Method Used: {full_result.get('method', 'Unknown')}")
    print(f"Currency: {full_result.get('currency', 'USD')}")

if __name__ == "__main__":
    test_marketcheck()
