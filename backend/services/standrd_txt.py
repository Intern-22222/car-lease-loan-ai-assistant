import re


def extract_std_txt(text: str) -> dict:
    data = {
        "vehicle": {
            "make": None,
            "model": None,
            "year": None,
            "vin": None,
            "registration_number": None
        },
        "customer": {
            "name": None,
            "address": None,
            "phone": None
        },
        "lender": {
            "lender_name": None,
            "lender_type": None
        },
        "contract": {
            "contract_type": None,
            "contract_date": None,
            "contract_id": None,
            "vendor_source": None
        },
        "financial": {
            "vehicle_price": None,
            "loan_term_months": None,
            "monthly_payment": None,
            "total_payable_amount": None,
            "interest_rate": None,
            "apr": None
        }
    }

    # VEHICLE
    vin = re.search(r"\b[A-HJ-NPR-Z0-9]{17}\b", text)
    if vin:
        data["vehicle"]["vin"] = vin.group()

    year = re.search(r"\b(19\d{2}|20\d{2})\b", text)
    if year:
        data["vehicle"]["year"] = int(year.group())

    #FINANCIAL 
    monthly = re.search(
        r"\$\s?(\d+(?:\.\d+)?)\s*(per month|monthly)",
        text,
        re.I
    )
    if monthly:
        data["financial"]["monthly_payment"] = float(monthly.group(1))

    term = re.search(r"(\d{1,3})\s*months", text, re.I)
    if term:
        data["financial"]["loan_term_months"] = int(term.group(1))

    apr = re.search(r"(APR|Interest Rate)[^\d]*(\d+(?:\.\d+)?)%", text, re.I)
    if apr:
        data["financial"]["apr"] = float(apr.group(2))

    interest = re.search(r"Interest Rate[^\d]*(\d+(?:\.\d+)?)%", text, re.I)
    if interest:
        data["financial"]["interest_rate"] = float(interest.group(1))

    # CONTRACT
    text_lower = text.lower()
    if "lease" in text_lower:
        data["contract"]["contract_type"] = "lease"
    elif "loan" in text_lower:
        data["contract"]["contract_type"] = "loan"

    return data
