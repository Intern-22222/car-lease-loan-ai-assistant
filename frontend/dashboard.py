import streamlit as st
import pandas as pd
import pytesseract
from pdf2image import convert_from_bytes
import re

# For Windows users – uncomment and set path if needed
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

st.set_page_config(page_title="Lease Contract Comparison", layout="wide")
st.title("🚗 Car Lease Contract Comparison Dashboard (OCR + Numeric Extraction)")

# =========================
# 1. OCR TEXT EXTRACTION
# =========================
def extract_text_from_pdf_ocr(file):
    images = convert_from_bytes(file.read())
    full_text = ""

    for img in images:
        text = pytesseract.image_to_string(img)
        full_text += text + "\n"

    return full_text


# =========================
# 2. NUMERIC + CLEAN FIELD EXTRACTION
# =========================
def extract_fields(text):

    def find_float(pattern):
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return float(match.group(1).replace(",", ""))
        return "Not Found"

    def find_int(pattern):
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return int(match.group(1).replace(",", ""))
        return "Not Found"

    def find_text(pattern):
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
        return "Not Found"

    data = {
        "Interest Rate (APR %)": find_float(r"(?:APR|Interest Rate)[^\d]*([\d\.]+)\s*%"),
        "Lease Term (Months)": find_int(r"(\d{2,3})\s*months"),
        "Monthly Payment ($)": find_int(r"\$[\s]*([\d,]+)\s*(?:per month|/month|monthly)"),
        "Down Payment ($)": find_int(r"(?:Down Payment|Due at Signing)[^\$]*\$([\d,]+)"),
        "Residual Value ($)": find_int(r"(?:Residual Value)[^\$]*\$([\d,]+)"),
        "Mileage Allowance (Miles)": find_int(r"(\d{1,2},?\d{3})\s*(?:miles per year|miles/year|miles)"),
        "Overage Charge ($/mile)": find_float(r"\$([\d\.]+)\s*(?:per mile|/mile)"),
        "Early Termination Penalty (Months)": find_int(r"(\d+)\s*months?\s*penalty"),
        "Buyout Price ($)": find_int(r"(?:purchase option|buyout)[^\$]*\$([\d,]+)"),
        "Maintenance Clause": find_text(r"(maintenance.{0,80})"),
        "Warranty / Insurance Clause": find_text(r"(warranty.{0,80}|insurance.{0,80})"),
        "Late Fee ($)": find_int(r"\$([\d,]+)\s*(?:late fee|penalty)")
    }

    return data


# =========================
# 3. FILE UPLOAD
# =========================
uploaded_files = st.file_uploader(
    "📄 Upload Lease Contract PDFs (2 or more)",
    type=["pdf"],
    accept_multiple_files=True
)

contracts = []

if uploaded_files:
    for file in uploaded_files:
        text = extract_text_from_pdf_ocr(file)
        fields = extract_fields(text)
        fields["Contract"] = file.name
        contracts.append(fields)

# =========================
# 4. DISPLAY COMPARISON
# =========================
if contracts:
    df = pd.DataFrame(contracts).set_index("Contract").T

    tab1, tab2 = st.tabs(["📊 Comparison Dashboard", "💡 Insights View"])

    # ---------- TAB 1 ----------
    with tab1:
        st.subheader("Side-by-Side Contract Comparison")
        st.dataframe(df, use_container_width=True)

    # ---------- TAB 2 ----------
    with tab2:
        st.subheader("Contract Insights & Red Flags")

        for contract in contracts:
            st.markdown(f"## {contract['Contract']}")
            col1, col2, col3 = st.columns(3)

            with col1:
                st.metric("APR (%)", contract["Interest Rate (APR %)"])
                st.metric("Monthly ($)", contract["Monthly Payment ($)"])

            with col2:
                st.metric("Down ($)", contract["Down Payment ($)"])
                st.metric("Residual ($)", contract["Residual Value ($)"])

            with col3:
                st.metric("Mileage", contract["Mileage Allowance (Miles)"])
                st.metric("Overage ($/mile)", contract["Overage Charge ($/mile)"])

            # Red Flags
            st.markdown("### ⚠️ Red Flags")
            flags = []

            if contract["Interest Rate (APR %)"] == "Not Found":
                flags.append("APR not detected.")
            if contract["Early Termination Penalty (Months)"] == "Not Found":
                flags.append("Early termination clause missing.")
            if contract["Maintenance Clause"] == "Not Found":
                flags.append("Maintenance responsibility unclear.")
            if contract["Late Fee ($)"] == "Not Found":
                flags.append("Late fee / penalty not specified.")
            if contract["Overage Charge ($/mile)"] != "Not Found" and contract["Overage Charge ($/mile)"] > 0.30:
                flags.append("High overage charge.")

            if flags:
                for f in flags:
                    st.error(f)
            else:
                st.success("No major red flags detected.")

            st.divider()

else:
    st.info("👆 Upload at least 2 lease contract PDFs to compare.")
