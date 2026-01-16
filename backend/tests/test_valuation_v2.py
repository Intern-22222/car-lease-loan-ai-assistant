
from app.valuation import _fallback_depreciation
import logging

# Disable logging for cleaner output
logging.disable(logging.CRITICAL)

def test_logic():
    print("=== Testing Advanced Valuation Logic v2.0 ===\n")

    # Scenario 1: Luxury Depreciation (BMW)
    # 3 Year old
    val_luxury = _fallback_depreciation(2023, "BMW", "3 SERIES", 36000)
    print(f"LUXURY (BMW 3 Series, 3yo, 36k miles): ${val_luxury['estimated_price']:,} (MSRP: ${val_luxury['base_msrp_used']:,})")
    print(f"  -> {val_luxury['details']['depreciation_profile']}")

    # Scenario 2: Economy Retention (Toyota Camry)
    val_economy = _fallback_depreciation(2023, "TOYOTA", "CAMRY", 36000)
    print(f"ECONOMY (Toyota Camry, 3yo, 36k miles): ${val_economy['estimated_price']:,} (MSRP: ${val_economy['base_msrp_used']:,})")
    print(f"  -> {val_economy['details']['depreciation_profile']}")

    # Calculate Retention %
    ret_luxury = val_luxury['estimated_price'] / val_luxury['base_msrp_used']
    ret_economy = val_economy['estimated_price'] / val_economy['base_msrp_used']
    
    print(f"\nRetention Rates:")
    print(f"Luxury: {ret_luxury*100:.1f}%")
    print(f"Economy: {ret_economy*100:.1f}%")

    if ret_economy > ret_luxury:
        print("\n✅ SUCCESS: Economy car held value better than Luxury car.")
    else:
        print("\n❌ FAILURE: Logic flaw. Luxury held value better or equal.")

    # Mileage Penalty Test
    val_high_mile = _fallback_depreciation(2023, "TOYOTA", "CAMRY", 100000) # Way over average
    print(f"\nHigh Mileage Camry (100k miles): ${val_high_mile['estimated_price']:,}")
    
    diff = val_economy['estimated_price'] - val_high_mile['estimated_price']
    print(f"Penalty for extra 64k miles: ${diff:,}")

if __name__ == "__main__":
    test_logic()
