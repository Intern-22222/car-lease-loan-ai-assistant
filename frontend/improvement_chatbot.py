import streamlit as st
import pandas as pd

# Page Config
st.set_page_config(page_title="Contract Review Assistant", layout="wide")

# Initialize Session State for Chatbot Integration later
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

## --- SIDEBAR: Navigation & Chatbot Integration ---
with st.sidebar:
    st.title("🤖 Negotiation AI")
    st.info("The chatbot will be integrated here to guide your negotiation.")
    
    # Chat Interface Placeholder (Intern A's future task)
    chat_container = st.container(height=400)
    for message in st.session_state.chat_history:
        chat_container.chat_message(message["role"]).write(message["content"])
    
    if prompt := st.chat_input("Ask about the contract..."):
        st.session_state.chat_history.append({"role": "user", "content": prompt})
        # For now, just a dummy response
        st.session_state.chat_history.append({"role": "assistant", "content": "Analyzing terms..."})
        st.rerun()

## --- MAIN UI: Comparison Dashboard ---
st.header("📄 AI-based Negotiation Chatbot for Contract Comparison & Insights")

# Mock Data for Comparison (Normally these would come from your DB/Intern B)
col1, col2 = st.columns(2)

with col1:
    st.subheader("Contract A (Current)")
    st.metric(label="Monthly Payment", value="$450", delta="- $20 vs Market")
    st.write("**Key Terms:**")
    st.json({"APR": "4.5%", "Term": "36 Months", "Mileage": "12k/year"})

with col2:
    st.subheader("Contract B (Competitor)")
    st.metric(label="Monthly Payment", value="$425", delta="Best Value", delta_color="normal")
    st.write("**Key Terms:**")
    st.json({"APR": "3.9%", "Term": "36 Months", "Mileage": "10k/year"})

st.divider()

## --- INSIGHTS VIEW ---
st.subheader("🚩 AI Insights & Red Flags")
tab1, tab2 = st.tabs(["Fairness Score", "Red Flags"])

with tab1:
    st.progress(85, text="Fairness Score: 85/100")
    st.caption("This contract is highly competitive based on current market data for your region.")

with tab2:
    st.warning("Found 1 Red Flag: Early Termination Penalty is 15% higher than industry average.")
    st.error("Missing Clause: No explicit 'Gap Insurance' mention found.")