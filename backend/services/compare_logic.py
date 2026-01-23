def calculate_fairness_score(contract_data):
    score = 10.0
    # Rule 1: High APR Penalty (> 5%)
    if contract_data.get("apr", 0) > 5.0:
        score -= 2.0
    # Rule 2: High Termination Fee (> $400)
    if contract_data.get("termination_fee", 0) > 400:
        score -= 1.5
 
    # Rule 3: Low Mileage Limit (< 10k miles)
    if contract_data.get("mileage_limit", 12000) < 10000:
        score -= 1.0
 
    return round(max(0.0, score), 1)
 
# 2. LOGIC: Compare Two Contracts
def compare_contracts(data_a, data_b):
    score_a = calculate_fairness_score(data_a)
    score_b = calculate_fairness_score(data_b)
    return {
        "winner": "Contract A" if score_a >= score_b else "Contract B",
        "contract_a_score": score_a,
        "contract_b_score": score_b,
        "price_diff": abs(data_a.get("price", 0) - data_b.get("price", 0))
    }