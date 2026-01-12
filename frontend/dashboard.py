import streamlit as st
import pandas as pd
import pdfplumber
import re

st.set_page_config(page_title="Lease Contract Comparison", layout="wide")
st.title("🚗 Car Lease Contract Comparison Dashboard")

# =========================
# 1. PDF TEXT EXTRACTION
# =========================
def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            if page.extract_text():
                text += page.extract_text() + "\n"
    return text


# =========================
# 2. SLA FIELD EXTRACTION (Regex Based)
# =========================
def extract_fields(text):
    def find(pattern):
        match = re.search(pattern, text, re.IGNORECASE)
        return match.group(1).strip() if match else "Not Found"

    data = {
        "Interest Rate / APR": find(r"(APR|Interest Rate)[^\d]*(\d+\.?\d*%)"),
        "Lease Term": find(r"(\d{2,3}\s*months)"),
        "Monthly Payment": find(r"\$[\s]*([\d,]+\.?\d*)\s*(per month|/month|monthly)"),
        "Down Payment": find(r"(Down Payment|Due at Signing)[^\$]*\$([\d,]+\.?\d*)"),
        "Residual Value": find(r"(Residual Value)[^\$]*\$([\d,]+\.?\d*)"),
        "Mileage Allowance": find(r"(\d{1,2},?\d{3})\s*(miles per year|miles/year)"),
        "Overage Charges": find(r"(\$0\.\d{2})\s*(per mile|/mile)"),
        "Early Termination": find(r"(early termination.*)"),
        "Buyout Price": find(r"(purchase option|buyout)[^\$]*\$([\d,]+\.?\d*)"),
        "Maintenance": find(r"(maintenance.*)"),
        "Warranty & Insurance": find(r"(warranty.*|insurance.*)"),
        "Penalties / Late Fees": find(r"(late fee.*|penalty.*)")
    }

    # Clean tuples from regex groups
    cleaned = {}
    for k, v in data.items():
        if isinstance(v, tuple):
            cleaned[k] = v[1]
        else:
            cleaned[k] = v

    return cleaned


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
        text = extract_text_from_pdf(file)
        fields = extract_fields(text)
        fields["Contract"] = file.name
        contracts.append(fields)

# =========================
# 4. DISPLAY COMPARISON
# =========================
if contracts:
    df = pd.DataFrame(contracts).set_index("Contract").T

    tab1, tab2 = st.tabs(["📊 Comparison Dashboard", "💡 Insights View"])

    with tab1:
        st.subheader("Side-by-Side Contract Comparison")
        st.dataframe(df, use_container_width=True)

    with tab2:
        st.subheader("Contract Insights & Red Flags")

        for contract in contracts:
            st.markdown(f"## {contract['Contract']}")
            col1, col2, col3 = st.columns(3)

            with col1:
                st.metric("APR", contract["Interest Rate / APR"])
                st.metric("Monthly Payment", contract["Monthly Payment"])

            with col2:
                st.metric("Down Payment", contract["Down Payment"])
                st.metric("Residual Value", contract["Residual Value"])

            with col3:
                st.metric("Mileage", contract["Mileage Allowance"])
                st.metric("Overage", contract["Overage Charges"])

            # Red Flags
            st.markdown("### ⚠️ Red Flags")
            flags = []

            if "Not Found" in contract["Interest Rate / APR"]:
                flags.append("APR not clearly mentioned.")
            if "Not Found" in contract["Early Termination"]:
                flags.append("Early termination clause missing.")
            if "Not Found" in contract["Maintenance"]:
                flags.append("Maintenance responsibility unclear.")
            if "Not Found" in contract["Penalties / Late Fees"]:
                flags.append("Late fee / penalty not specified.")

            if flags:
                for f in flags:
                    st.error(f)
            else:
                st.success("No major red flags detected.")

            st.divider()

else:
    st.info("👆 Upload at least 2 lease contract PDFs to compare.")
