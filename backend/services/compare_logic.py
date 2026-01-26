def calculate_fairness_score(contract_data):
    score = 10.0

    # Safely read values (None → defaults)
    apr = contract_data.get("apr")
    termination_fee = contract_data.get("termination_fee")
    mileage_limit = contract_data.get("mileage_limit")

    # Rule 1: High APR Penalty (> 5%)
    if apr is not None and apr > 5.0:
        score -= 2.0

    # Rule 2: High Termination Fee (> $400)
    if termination_fee is not None and termination_fee > 400:
        score -= 1.5

    # Rule 3: Low Mileage Limit (< 10k miles)
    if mileage_limit is not None and mileage_limit < 10000:
        score -= 1.0

    return round(max(0.0, score), 1)


# ---------------- COMPARE TWO CONTRACTS ----------------
def compare_contracts(data_a, data_b):
    score_a = calculate_fairness_score(data_a)
    score_b = calculate_fairness_score(data_b)

    price_a = data_a.get("price")
    price_b = data_b.get("price")

    # Safe price difference (None → 0)
    price_diff = abs(
        (price_a if price_a is not None else 0) -
        (price_b if price_b is not None else 0)
    )

    return {
        "winner": "Contract A" if score_a >= score_b else "Contract B",
        "contract_a_score": score_a,
        "contract_b_score": score_b,
        "price_diff": price_diff
    }
