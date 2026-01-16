import pytest
from logic.scoring import calculate_fairness_score

def test_perfect_contract_score():
    # Contract matches or beats market
    contract = {'monthly_payment': 400, 'apr': 3.0, 'junk_fees': []}
    market = {'avg_payment': 450, 'avg_apr': 4.0}
    score = calculate_fairness_score(contract, market)
    assert score >= 90  # Should be a very high score

def test_bad_contract_score():
    # High payment, high APR, many fees
    contract = {'monthly_payment': 800, 'apr': 15.0, 'junk_fees': ['A', 'B', 'C', 'D']}
    market = {'avg_payment': 450, 'avg_apr': 4.0}
    score = calculate_fairness_score(contract, market)
    assert score < 40  # Should be a low score