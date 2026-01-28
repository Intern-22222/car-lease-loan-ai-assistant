import sys
import os

# Add the parent directory to sys.path to resolve imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app.negotiation import NegotiationEngine

def test_negotiation():
    engine = NegotiationEngine()
    
    # Mock Data
    vehicle = {"year": 2024, "make": "Toyota", "model": "Camry", "trim": "SE"}
    market = {"price": 28500, "currency": "USD"}
    context = {"vehicle_details": vehicle, "market_value": market}
    
    # Test 1: System Prompt
    print("Testing System Prompt Generation...")
    prompt = engine.generate_system_prompt(vehicle, market)
    assert "Toyota Camry" in prompt
    assert "28500" in prompt
    print("✓ System Prompt passed")
    
    # Test 2: User greetings
    print("Testing User Greeting...")
    resp = engine.get_response("Hello", context)
    assert "Toyota" in resp
    print("✓ Greeting passed")
    
    # Test 3: Price logic
    print("Testing Price Logic...")
    resp = engine.get_response("They want $30000", context)
    assert "28500" in resp
    print("✓ Price logic passed")

    print("\nAll Negotiation Tests Passed!")

if __name__ == "__main__":
    test_negotiation()
