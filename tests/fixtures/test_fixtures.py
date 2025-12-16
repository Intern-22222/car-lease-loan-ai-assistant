import pytest
import json
import os
from glob import glob

# --- CONFIG ---
FIXTURE_DIR = "tests/fixtures/json"

CANONICAL_SCHEMA = {
    "vehicle_information": [
        "make", "model", "year", "vin", "odometer"
    ],
    "customer_information": [
        "name", "address", "phone"
    ],
    "dealer_lender_information": [
        "dealer_name", "dealer_address", "lender_name", "lender_type"
    ],
    "financial_terms": [
        "contract_type", "vehicle_price", "down_payment",
        "interest_rate", "apr", "loan_term_months",
        "monthly_payment", "total_amount_financed",
        "total_payable_amount", "balloon_payment",
        "taxes_and_fees"
    ],
    "lease_specific_terms": [
        "residual_value", "mileage_limit_per_year",
        "excess_mileage_fee", "wear_and_tear_policy"
    ],
    "loan_specific_terms": [
        "amortization_type", "prepayment_penalty",
        "late_fee_rules"
    ],
    "contract_metadata": [
        "contract_date", "contract_id", "vendor_source"
    ]
}

JSON_FILES = glob(os.path.join(FIXTURE_DIR, "*.json"))

# --- TEST 1: JSON loads correctly ---
@pytest.mark.parametrize("json_file", JSON_FILES)
def test_json_is_valid(json_file):
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert isinstance(data, dict), f"{json_file} root must be a dictionary"

# --- TEST 2: Root keys strictly enforced ---
@pytest.mark.parametrize("json_file", JSON_FILES)
def test_root_keys_strict(json_file):
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    expected = set(CANONICAL_SCHEMA.keys())
    actual = set(data.keys())

    assert actual == expected, (
        f"{json_file} root keys mismatch\n"
        f"Missing: {expected - actual}\n"
        f"Extra: {actual - expected}"
    )

# --- TEST 3: Field-level schema enforcement ---
@pytest.mark.parametrize("json_file", JSON_FILES)
def test_field_level_schema(json_file):
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    for section, expected_fields in CANONICAL_SCHEMA.items():
        assert isinstance(
            data[section], dict
        ), f"{json_file} -> {section} must be a dictionary"

        expected = set(expected_fields)
        actual = set(data[section].keys())

        assert actual == expected, (
            f"{json_file} -> {section} fields mismatch\n"
            f"Missing: {expected - actual}\n"
            f"Extra: {actual - expected}"
        )

