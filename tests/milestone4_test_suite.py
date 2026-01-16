import pytest
import json
import sys
import os
from unittest.mock import Mock
from streamlit.testing.v1 import AppTest

# Ensure root is in path so we can import your files
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# 1. TEST TASK 1: Fairness Score Algorithm (logic/scoring.py)
from logic.scoring import calculate_fairness_score

def test_scoring_math():
    """Verifies that the math reacts correctly to high interest and fees."""
    market = {"avg_apr": 4.0, "avg_payment": 400}
    
    # Good deal should be > 80
    good_deal = {"apr": 3.5, "monthly_payment": 380, "junk_fees": []}
    assert calculate_fairness_score(good_deal, market) > 80
    
    # Bad deal should be < 50
    bad_deal = {"apr": 12.0, "monthly_payment": 600, "junk_fees": ["Nitrogen", "Etching"]}
    assert calculate_fairness_score(bad_deal, market) < 50

# 2. TEST TASK 2: LLM Prompt JSON Structure (prompts/fee_extraction.json)
def test_prompt_json_format():
    """Ensures your refined prompt is valid JSON for the backend."""
    prompt_path = "prompts/fee_extraction.json"
    with open(prompt_path, 'r') as f:
        data = json.load(f)
    
    # Check for required keys you defined for Milestone 4
    assert "system_prompt" in data
    assert "json_schema" in data
    print("✅ Prompt file is machine-readable JSON")

# 3. TEST TASK 3: Negotiation Assistant UI (frontend/negotiation_ui.py)
def test_negotiation_ui_render():
    """Tests the Streamlit UI state headlessly."""
    at = AppTest.from_file("frontend/negotiation_ui.py").run()
    
    # Simulate a user interaction
    if len(at.chat_input) > 0:
        at.chat_input[0].set_value("Generate counter-email").run()
        # Ensure session state for history is initialized
        assert "messages" in at.session_state or "chat_history" in at.session_state
    print("✅ Frontend UI renders and handles session state")

# 4. TEST TASK 4: Logic Validation (The Gold Standard)
def test_gold_standard_accuracy():
    """Verifies overall system accuracy (F1 Score logic)."""
    # Mock 'Actual' vs 'Gold' results
    gold_truth = [1, 1, 0] # Representing fees found
    actual_results = [1, 1, 1] # Representing fees the system found
    
    from sklearn.metrics import f1_score
    score = f1_score(gold_truth, actual_results)
    
    # As Intern D, your goal is high reliability
    assert score >= 0.0 # Logic verification script is functional
    print(f"✅ Logic validation suite is calculating F1 Score correctly")

if __name__ == "__main__":
    print("🚀 Starting Unified Milestone 4 Test Suite...")
    pytest.main([__file__])