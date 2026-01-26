import re


def safe_group(match, idx=1):
    """
    Safely extract regex group.
    Returns None if match or group does not exist.
    """
    try:
        return match.group(idx).strip()
    except (AttributeError, IndexError):
        return None


def parse_contract_fields(text: str) -> dict:
    # Initialize all expected fields with None
    data = {
        "apr": None,
        "termination_fee": None,
        "mileage_limit": None,
        "price": None
    }

    # ---------------- APR ----------------
    apr_match = re.search(r"APR[^\d]*(\d+(?:\.\d+)?)%", text, re.I)
    apr_val = safe_group(apr_match, 1)
    data["apr"] = float(apr_val) if apr_val else None

    # ---------------- TERMINATION FEE ----------------
    termination_match = re.search(
        r"termination\s+fee[:\s]*\$?\s*([\d,]+)",
        text,
        re.I
    )
    tf_val = safe_group(termination_match, 1)
    data["termination_fee"] = (
        float(tf_val.replace(",", "")) if tf_val else None
    )

    # ---------------- MILEAGE LIMIT ----------------
    mileage_match = re.search(
        r"mileage\s+limit[:\s]*([\d,]+)",
        text,
        re.I
    )
    ml_val = safe_group(mileage_match, 1)
    data["mileage_limit"] = (
        int(ml_val.replace(",", "")) if ml_val else None
    )

    # ---------------- PRICE ----------------
    money = r"(?:₹|Rs\.?|INR|\$)\s?([\d,]+(?:\.\d+)?)"

    price_match = (
        re.search(
            r"(Total Payable|Total Amount Payable)[^\d₹$]*" + money,
            text,
            re.I
        )
        or re.search(
            r"(Vehicle Price|Ex[- ]?Showroom Price)[^\d₹$]*" + money,
            text,
            re.I
        )
    )

    price_val = safe_group(price_match, 2)
    data["price"] = (
        float(price_val.replace(",", "")) if price_val else None
    )

    return data
