

def estimate_price(year, make, model, credit_score):
    base_price = 25000

    # Depreciation
    age = 2025 - int(year)
    base_price -= age * 1200

    # Credit score adjustment
    if credit_score >= 750:
        interest_factor = 0.95
    elif credit_score >= 650:
        interest_factor = 1.0
    else:
        interest_factor = 1.15

    return int(base_price * interest_factor)
