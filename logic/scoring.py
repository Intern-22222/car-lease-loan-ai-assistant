import numpy as np

def calculate_fairness_score(contract_data, market_benchmarks):
    """
    contract_data: dict containing 'monthly_payment', 'apr', 'fees'
    market_benchmarks: dict containing 'avg_payment', 'avg_apr'
    """
    # 1. Price Score (0-50 points)
    # Higher payment than market reduces score
    price_ratio = market_benchmarks['avg_payment'] / contract_data['monthly_payment']
    price_score = np.clip(price_ratio * 50, 0, 50)
    
    # 2. Interest/Risk Score (0-30 points)
    # Penalize if APR is higher than market average
    apr_diff = contract_data['apr'] - market_benchmarks['avg_apr']
    risk_score = 30 - np.clip(apr_diff * 5, 0, 30)
    
    # 3. Fee Penalty (0-20 points)
    # Deduct 5 points for every junk fee found
    fee_penalty = len(contract_data.get('junk_fees', [])) * 5
    final_fee_score = np.clip(20 - fee_penalty, 0, 20)
    
    total_score = price_score + risk_score + final_fee_score
    return round(total_score, 2)

# Example Verification
mock_contract = {'monthly_payment': 500, 'apr': 7.5, 'junk_fees': ['Etching', 'Nitrogen']}
mock_market = {'avg_payment': 450, 'avg_apr': 4.0}
print(f"Fairness Score: {calculate_fairness_score(mock_contract, mock_market)}")