import re
from typing import Dict


def safe_group(match, idx=1):
    """
    Safely extract regex group.
    Returns None if match or group does not exist.
    """
    try:
        return match.group(idx).strip()
    except (AttributeError, IndexError):
        return None


def extract_std_txt(text: str) -> Dict:
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

    # ---------------- VEHICLE ----------------
    vin = re.search(r"\b[A-HJ-NPR-Z0-9]{17}\b", text)
    data["vehicle"]["vin"] = safe_group(vin, 0)

    year = re.search(r"\b(19\d{2}|20\d{2})\b", text)
    data["vehicle"]["year"] = int(safe_group(year, 1)) if safe_group(year, 1) else None

    make_model = re.search(
        r"\b(Hyundai|Honda|Maruti|Tata|Toyota|Mahindra|Kia|BMW|Audi|Mercedes)[\s\-]+([A-Za-z0-9 ]+)",
        text,
        re.I
    )
    data["vehicle"]["make"] = safe_group(make_model, 1)
    data["vehicle"]["model"] = safe_group(make_model, 2)

    reg = re.search(r"\b[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}\b", text)
    data["vehicle"]["registration_number"] = safe_group(reg, 0)

    # ---------------- CUSTOMER ----------------
    name = re.search(
        r"(Borrower|Customer|Applicant|Name)\s*[:\-]?\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)",
        text
    )
    data["customer"]["name"] = safe_group(name, 2)

    phone = re.search(r"\b\d{10,15}\b", text)
    data["customer"]["phone"] = safe_group(phone, 0)

    address = re.search(
        r"Address\s*[:\-]?\s*(.+?)(?:\n|,?\s*Phone|\s*Mobile)",
        text,
        re.I | re.S
    )
    data["customer"]["address"] = safe_group(address, 1)

    # ---------------- LENDER ----------------
    lender = re.search(
        r"(ICICI Bank|HDFC Bank|AXIS Bank|SBI|Kotak Mahindra Bank|Yes Bank|IDFC First Bank|Mercedes-Benz Financial Services)",
        text,
        re.I
    )
    data["lender"]["lender_name"] = safe_group(lender, 0)

    if lender:
        data["lender"]["lender_type"] = "bank"

    # ---------------- FINANCIAL ----------------
    money = r"(?:₹|Rs\.?|INR|\$)\s?([\d,]+(?:\.\d+)?)"

    vehicle_price = re.search(
        r"(Vehicle Price|Ex[- ]?Showroom Price)[^\d₹$]*" + money,
        text,
        re.I
    )
    vp = safe_group(vehicle_price, 2)
    data["financial"]["vehicle_price"] = float(vp.replace(",", "")) if vp else None

    emi = re.search(
        r"(EMI|Monthly Installment|Monthly Payment)[^\d₹$]*" + money,
        text,
        re.I
    )
    mp = safe_group(emi, 2)
    data["financial"]["monthly_payment"] = float(mp.replace(",", "")) if mp else None

    total = re.search(
        r"(Total Payable|Total Amount Payable)[^\d₹$]*" + money,
        text,
        re.I
    )
    tp = safe_group(total, 2)
    data["financial"]["total_payable_amount"] = float(tp.replace(",", "")) if tp else None

    term = re.search(r"(\d{1,3})\s*(months|month)", text, re.I)
    lt = safe_group(term, 1)
    data["financial"]["loan_term_months"] = int(lt) if lt else None

    interest = re.search(r"Interest Rate[^\d]*(\d+(?:\.\d+)?)%", text, re.I)
    ir = safe_group(interest, 1)
    data["financial"]["interest_rate"] = float(ir) if ir else None

    apr = re.search(r"APR[^\d]*(\d+(?:\.\d+)?)%", text, re.I)
    ar = safe_group(apr, 1)
    data["financial"]["apr"] = float(ar) if ar else None

    # ---------------- CONTRACT ----------------
    text_lower = text.lower()
    if "lease" in text_lower:
        data["contract"]["contract_type"] = "lease"
    elif "loan" in text_lower:
        data["contract"]["contract_type"] = "loan"

    date = re.search(
        r"\b(\d{2}[/-]\d{2}[/-]\d{4}|\d{4}-\d{2}-\d{2})\b",
        text
    )
    data["contract"]["contract_date"] = safe_group(date, 1)

    cid = re.search(
        r"(Contract ID|Loan No\.?|Agreement No\.?)\s*[:\-]?\s*([A-Z0-9\-]+)",
        text,
        re.I
    )
    data["contract"]["contract_id"] = safe_group(cid, 2)

    vendor = re.search(
        r"(Loan Agreement|Key Facts Statement|Hypothecation Agreement|Lease Agreement)",
        text,
        re.I
    )
    data["contract"]["vendor_source"] = safe_group(vendor, 1)

    return data
