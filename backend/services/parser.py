import re


def parse_contract_fields(text: str) -> dict:
    data = {}

    # APR
    apr_match = re.search(r"APR[:\s]*([\d.]+)\s*%", text, re.IGNORECASE)
    if apr_match:
        data["apr"] = float(apr_match.group(1))

    # Termination Fee
    termination_match = re.search(
        r"termination\s+fee[:\s]*\$?\s*([\d,]+)",
        text,
        re.IGNORECASE
    )
    if termination_match:
        data["termination_fee"] = float(
            termination_match.group(1).replace(",", "")
        )

    # Mileage limit
    mileage_match = re.search(
        r"mileage\s+limit[:\s]*([\d,]+)",
        text,
        re.IGNORECASE
    )
    if mileage_match:
        data["mileage_limit"] = int(
            mileage_match.group(1).replace(",", "")
        )

    # Price
    price_match = re.search(
        r"(vehicle\s+price|price|amount)[:\s]*\$?\s*([\d,]+)",
        text,
        re.IGNORECASE
    )
    if price_match:
        data["price"] = float(
            price_match.group(2).replace(",", "")
        )

    return data
