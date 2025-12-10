import pytest
import json
import os
from glob import glob

# --- CONFIGURATION ---
# Directory where your JSON fixtures are stored
FIXTURE_DIR = 'tests/fixtures/json'

# Canonical schema keys
CANONICAL_SCHEMA_KEYS = {
    'vehicle_information': ['make', 'model', 'year', 'vin', 'odometer'],
    'customer_information': ['name', 'address', 'phone'],
    'dealer_lender_information': ['dealer_name', 'dealer_address', 'lender_name', 'lender_type'],
    'financial_terms': ['contract_type', 'vehicle_price', 'down_payment', 'interest_rate', 'apr', 'loan_term_months', 'monthly_payment', 'total_payable_amount', 'balloon_payment', 'taxes_and_fees'],
    'lease_specific_terms': ['residual_value', 'mileage_limit_per_year', 'excess_mileage_fee', 'wear_and_tear_policy'],
    'loan_specific_terms': ['amortization_type', 'prepayment_penalty', 'late_fee_rules'],
    'contract_metadata': ['contract_date', 'contract_id', 'vendor_source']
}

# --- Find all JSON files ---
JSON_FILES = glob(os.path.join(FIXTURE_DIR, '*.json'))

# --- TEST 1: JSON Validity ---
@pytest.mark.parametrize('json_file', JSON_FILES)
def test_json_loads_correctly(json_file):
    """Ensure each JSON file loads without errors and root is a dictionary."""
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        assert isinstance(data, dict), f"Fixture {json_file} root is not a dictionary."
    except json.JSONDecodeError as e:
        pytest.fail(f"Fixture {json_file} failed to parse as valid JSON: {e}")
    except FileNotFoundError:
        pytest.skip(f"Fixture file not found: {json_file}")

# --- TEST 2: Schema Conformance ---
@pytest.mark.parametrize('json_file', JSON_FILES)
def test_json_structure_and_keys(json_file):
    """Ensure JSON structure matches the canonical schema."""
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 1. Check root keys
    expected_root_keys = set(CANONICAL_SCHEMA_KEYS.keys())
    actual_root_keys = set(data.keys())
    
    missing_keys = expected_root_keys - actual_root_keys
    extra_keys = actual_root_keys - expected_root_keys

    assert not missing_keys, f"Fixture {json_file} is MISSING root keys: {missing_keys}"
    assert not extra_keys, f"Fixture {json_file} has EXTRA root keys: {extra_keys}"

    # 2. Check field-level keys
    for category, expected_fields in CANONICAL_SCHEMA_KEYS.items():
        if category in data:
            actual_fields = set(data[category].keys())
            expected_fields_set = set(expected_fields)
            
            missing_fields = expected_fields_set - actual_fields
            extra_fields = actual_fields - expected_fields_set
            
            assert not missing_fields, f"Fixture {json_file} ({category}) is MISSING fields: {missing_fields}"
            assert not extra_fields, f"Fixture {json_file} ({category}) has EXTRA fields: {extra_fields}"
