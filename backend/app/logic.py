# File: backend/app/logic.py

def calculate_fairness_score(data):
    """
    Calculates a 0-100 Fairness Score based on contract terms.
    """
    score = 100
    flags = []

    # --- 1. Interest Rate (APR) ---
    try:
        # Handle if data is float (from regex) or string (from OCR)
        apr_val = data.get("Interest Rate", 0)
        if isinstance(apr_val, str):
            apr_val = float(apr_val.replace("%", "").strip())
        
        if apr_val == "Not Found":
            pass
        elif apr_val > 10.0:
            score -= 25
            flags.append(f"🚩 High APR ({apr_val}%). Target is < 7%.")
        elif apr_val > 7.0:
            score -= 10
            flags.append(f"⚠️ APR is slightly elevated ({apr_val}%).")
    except:
        pass

    # --- 2. Monthly Payment ---
    try:
        pay_val = data.get("Monthly Payment", 0)
        if isinstance(pay_val, str):
            pay_val = float(pay_val.replace("$", "").replace(",", "").strip())

        if pay_val != "Not Found" and pay_val > 800:
            score -= 10
            flags.append(f"⚠️ High Monthly Payment (${pay_val}).")
    except:
        pass

    # --- 3. Mileage Limit ---
    try:
        miles_val = data.get("Mileage Limit", 0)
        if isinstance(miles_val, str):
            # Check for keywords if regex failed
            if "10" in miles_val: miles_val = 10000
        
        if miles_val != "Not Found" and isinstance(miles_val, (int, float)):
            if miles_val < 12000:
                score -= 5
                flags.append(f"⚠️ Low Mileage Allowance ({miles_val} miles/yr).")
    except:
        pass

    # --- 4. Junk Fees ---
    junk_fees = data.get("Junk Fees", [])
    if junk_fees:
        deduction = len(junk_fees) * 15
        score -= deduction
        flags.append(f"🚩 Found {len(junk_fees)} Junk Fees: {', '.join(junk_fees)}")

    return max(0, min(score, 100)), flags
