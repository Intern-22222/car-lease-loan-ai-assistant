"""
Milestone 4 Verification Script
Tests the Unified Market Value API, VIN Decoder, and Valuation Logic.
"""

import sys
import os
import json
import time
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

from backend.app.api import get_market_fair_price

def print_result(title, result):
    print(f"\n{'='*20} {title} {'='*20}")
    print(json.dumps(result, indent=2))
    
    if result.get("success"):
        val = result.get("market_value", {})
        print(f"\n✅ SUCCESS: {result['vehicle_details']['year']} {result['vehicle_details']['make']} {result['vehicle_details']['model']}")
        print(f"💰 Estimated Value: {val['price']} {val['currency']}")
    else:
        print(f"\n❌ FAILED: {result.get('error')}")

def main():
    print("🚗 Starting Milestone 4 Verification: Market Value API")
    
    # Test Case 1: Tesla Model 3 (Real VIN)
    # VIN: 5YJ3E1EAXHF000316 (2017 Tesla Model 3)
    tesla_vin = "5YJ3E1EAXHF000316"
    print(f"\n🔍 Test 1: Querying Tesla Model 3 (VIN: {tesla_vin})")
    start_time = time.time()
    result_tesla = get_market_fair_price(tesla_vin, mileage=50000)
    print(f"⏱️ Time taken: {time.time() - start_time:.4f}s")
    print_result("Tesla Model 3 Result", result_tesla)
    
    # Test Caching: Query same VIN again
    print(f"\n🔄 Test 2: Testing Cache (Querying Tesla VIN again)")
    start_time = time.time()
    result_tesla_cached = get_market_fair_price(tesla_vin, mileage=50000)
    print(f"⏱️ Time taken: {time.time() - start_time:.4f}s")
    if (time.time() - start_time) < 0.1:
        print("✅ Cache hit confirmed (Result returned instantly)")
    else:
        print("⚠️ Cache might not be working or network is too fast")

    # Test Case 3: Ford F-150 (Real VIN)
    # VIN: 1FTFW1RG0HFA66295 (2017 Ford F-150 Raptor)
    ford_vin = "1FTFW1RG0HFA66295"
    print(f"\n🔍 Test 3: Querying Ford F-150 (VIN: {ford_vin})")
    result_ford = get_market_fair_price(ford_vin, mileage=80000)
    print_result("Ford F-150 Result", result_ford)
    
    # Test Case 4: Invalid VIN
    print(f"\n❌ Test 4: Querying Invalid VIN")
    result_invalid = get_market_fair_price("INVALIDVIN1234567")
    
    if not result_invalid["success"]:
        print(f"✅ Correctly handled invalid VIN: {result_invalid['error']}")
    else:
        print(f"❌ Failed to detect invalid VIN")

if __name__ == "__main__":
    main()
