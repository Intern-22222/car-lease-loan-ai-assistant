import streamlit as st
import pandas as pd

# Page Configuration for a wide, professional look
st.set_page_config(page_title="Group E2: Contract Comparison", layout="wide")

# Session State for Chatbot Integration
if "messages" not in st.session_state:
    st.session_state.messages = []

# --- SIDEBAR: Negotiation Assistant ---
with st.sidebar:
    st.title("🤖 Negotiation Assistant")
    st.markdown("---")
    
    # Chat Container
    chat_container = st.container(height=500)
    for msg in st.session_state.messages:
        chat_container.chat_message(msg["role"]).write(msg["content"])

    # Chat Input
    if prompt := st.chat_input("Ask about your negotiation points..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        # Placeholder logic for Intern A's chatbot
        st.session_state.messages.append({"role": "assistant", "content": f"Analyzing terms related to '{prompt}'..."})
        st.rerun()

# --- MAIN UI: Comparison Dashboard ---
st.title("📄 Lease Contract Comparison & Insights")
st.caption("Compare extracted terms against fair market benchmarks.")

# Mock Data for Comparison (Columns derived from your requested list)
contract_data = {
    "Features": [
        "Interest Rate / APR", "Lease Term Duration", "Monthly Payment", 
        "Down Payment", "Residual Value", "Mileage Allowance & Overage",
        "Early Termination Clause", "Purchase Option (Buyout Price)",
        "Maintenance Responsibilities", "Warranty & Insurance", "Late Fee Clauses"
    ],
    "Contract A (Current)": [
        "4.2%", "36 Months", "$450", "$2,000", "$18,500", "12k miles ($0.25/over)",
        "15% Penalty", "$19,000", "Dealer Service Included", "3yr/36k Factory", "5% of payment"
    ],
    "Contract B (Competitor)": [
        "3.9%", "36 Months", "$425", "$2,500", "$17,800", "10k miles ($0.20/over)",
        "Fixed $1,500", "$18,200", "Self-Maintenance", "Extended Warranty Included", "Flat $25 fee"
    ]
}

# 1. High-Level Metrics (Top Row)
col1, col2, col3 = st.columns(3)
with col1:
    st.metric("Best Monthly Payment", "$425", "-$25 vs Current")
with col2:
    st.metric("Best APR", "3.9%", "-0.3%")
with col3:
    st.metric("Fairness Score", "88/100", "Excellent", delta_color="normal")

st.markdown("---")

# 2. Comparison View (Table Layout inspired by your screenshots)
st.subheader("📊 Detailed Term Comparison")
df = pd.DataFrame(contract_data)

# Styling the comparison table
col_a, col_b = st.columns(2)
with col_a:
    st.markdown("### **Contract A**")
    for i, feature in enumerate(contract_data["Features"]):
        st.write(f"**{feature}:** {contract_data['Contract A (Current)'][i]}")

with col_b:
    st.markdown("### **Contract B**")
    for i, feature in enumerate(contract_data["Features"]):
        st.write(f"**{feature}:** {contract_data['Contract B (Competitor)'][i]}")

st.markdown("---")

# 3. AI Insights & Red Flags View
st.subheader("🚩 AI Insights")
tabs = st.tabs(["Fairness Summary", "Red Flags", "Market Benchmarks"])

with tabs[0]:
    st.write("This contract ranks in the top 15% for fairness in your region.")
    st.progress(88, text="Fairness Score: 88%")

with tabs[1]:
    st.error("RED FLAG: Early Termination penalty in Contract A is 5% higher than industry standard.")
    st.warning("WATCH: Mileage overage charges are slightly above market average ($0.25 vs $0.20).")

with tabs[2]:
    st.info("Average Market APR for 750+ Credit Score: 3.85%")
    st.info("Average Down Payment for this Make/Model: $2,200")