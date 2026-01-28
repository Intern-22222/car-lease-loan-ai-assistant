
import streamlit as st
import requests
import os
import json
import pandas as pd
import pyperclip
from dotenv import load_dotenv

load_dotenv()

# Configuration
API_URL = "http://localhost:8000"

st.set_page_config(
    page_title="Car Lease/Loan AI Assistant",
    page_icon="🚗",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling for Glassmorphism and Premium feel
st.markdown("""
<style>
    .main {
        background: linear-gradient(135deg, #1e1e2f 0%, #121212 100%);
    }
    .stApp {
        background-color: transparent;
    }
    [data-testid="stSidebar"] {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
    }
    .stButton>button {
        border-radius: 20px;
        background: linear-gradient(90deg, #ff4b2b 0%, #ff416c 100%);
        color: white;
        border: none;
        padding: 10px 24px;
        transition: 0.3s;
        width: 100%;
    }
    .stButton>button:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 15px rgba(255, 75, 43, 0.4);
    }
    .card {
        background: rgba(255, 255, 255, 0.05);
        padding: 20px;
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 20px;
    }
    h1, h2, h3 {
        background: linear-gradient(90deg, #ff4b2b 0%, #ff416c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .copy-btn {
        background: #4CAF50;
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
    }
</style>
""", unsafe_allow_html=True)

# Initialize Session State
if 'logged_in' not in st.session_state:
    st.session_state.logged_in = False
if 'user_name' not in st.session_state:
    st.session_state.user_name = None
if 'user_email' not in st.session_state:
    st.session_state.user_email = None
if 'page' not in st.session_state:
    st.session_state.page = "Login"

# ======================
# AUTHENTICATION
# ======================

def login_page():
    st.title("🚗 Car Lease AI Assistant")
    
    tabs = st.tabs(["Login", "Create Account"])
    
    with tabs[0]:
        st.subheader("Welcome Back")
        email = st.text_input("Email", key="login_email", placeholder="you@example.com")
        pwd = st.text_input("Password", type="password", key="login_pwd")
        
        if st.button("Login"):
            try:
                response = requests.post(f"{API_URL}/login", json={"email": email, "password": pwd})
                if response.status_code == 200:
                    data = response.json()
                    st.session_state.logged_in = True
                    st.session_state.user_name = data.get("name", email.split("@")[0])
                    st.session_state.user_email = email
                    st.session_state.page = "Dashboard"
                    st.success("Login Successful!")
                    st.rerun()
                else:
                    st.error(response.json().get("detail", "Login Failed"))
            except Exception as e:
                st.error(f"Error connecting to backend: {e}")
                
    with tabs[1]:
        st.subheader("Join Us")
        new_name = st.text_input("Full Name", key="reg_name", placeholder="John Doe")
        new_email = st.text_input("Email", key="reg_email", placeholder="you@example.com")
        new_pwd = st.text_input("Password", type="password", key="reg_pwd")
        confirm_pwd = st.text_input("Confirm Password", type="password", key="reg_confirm")
        
        if st.button("Create Account"):
            if new_pwd != confirm_pwd:
                st.error("Passwords do not match")
            elif not new_name or not new_email:
                st.error("Please fill in all fields")
            else:
                try:
                    response = requests.post(f"{API_URL}/signup", json={"email": new_email, "name": new_name, "password": new_pwd})
                    if response.status_code == 200:
                        st.success("Account created successfully! Please login.")
                    else:
                        st.error(response.json().get("detail", "Signup Failed"))
                except Exception as e:
                    st.error(f"Error connecting to backend: {e}")

# ======================
# DASHBOARD
# ======================

def dashboard():
    st.sidebar.title(f"Welcome, {st.session_state.user_name}")
    if st.sidebar.button("Logout"):
        st.session_state.logged_in = False
        st.session_state.page = "Login"
        st.rerun()
    
    menu = st.sidebar.radio("Menu", ["Contract Analysis", "VIN Assistant", "Contract Comparison", "Chatbots"])
    
    if menu == "Contract Analysis":
        contract_analysis_view()
    elif menu == "VIN Assistant":
        vin_assistant_view()
    elif menu == "Contract Comparison":
        comparison_view()
    elif menu == "Chatbots":
        chatbots_view()

def contract_analysis_view():
    st.title("📄 Contract Analysis")
    
    uploaded_file = st.file_uploader("Upload Car Lease or Loan Contract (PDF/Image)", type=["pdf", "png", "jpg", "jpeg"])
    
    if uploaded_file:
        if st.button("Process Document"):
            with st.spinner("Analyzing contract with AI..."):
                response = requests.post(f"{API_URL}/upload", files={"file": (uploaded_file.name, uploaded_file.getvalue(), uploaded_file.type)})
                
                if response.status_code == 200:
                    data = response.json()
                    st.session_state.analysis_data = data
                    st.success("Analysis Complete!")
                else:
                    st.error("Failed to process document")
        
    if 'analysis_data' in st.session_state:
        data = st.session_state.analysis_data
        
        col1, col2 = st.columns([1.2, 0.8])
        
        with col1:
            st.markdown(f"### Fairness Score: {data['fairness_score']['overall_score']}")
            st.progress(data['fairness_score']['overall_score'] / 100)
            
            st.markdown("#### 📋 Extracted Contract Terms")
            analysis = data['analysis']
            
            # Comprehensive terms extraction - all fields the user requested
            terms = [
                ("Interest Rate / APR", analysis.get('interest_rate_apr') or analysis.get('interest_rate', 'N/A')),
                ("Money Factor", analysis.get('money_factor', 'N/A')),
                ("Lease Term Duration", f"{analysis.get('lease_term_months') or analysis.get('loan_term_months', 'N/A')} months"),
                ("Monthly Payment", f"${analysis.get('monthly_payment', 'N/A')}"),
                ("Down Payment", f"${analysis.get('down_payment', 'N/A')}"),
                ("Residual Value", analysis.get('residual_value', 'N/A')),
                ("Mileage Allowance", analysis.get('mileage_allowance', 'N/A')),
                ("Overage Charge", analysis.get('mileage_overage_charge', 'N/A')),
                ("Early Termination", analysis.get('early_termination_clause', 'N/A')),
                ("Purchase Option (Buyout)", analysis.get('purchase_option', 'N/A')),
                ("Maintenance Responsibility", analysis.get('maintenance_responsibility', 'N/A')),
                ("Warranty Coverage", analysis.get('warranty_coverage', 'N/A')),
                ("Insurance Requirements", analysis.get('insurance_requirements', 'N/A')),
                ("Late Payment Penalty", analysis.get('late_payment_penalty', 'N/A')),
                ("Total Cost", analysis.get('total_cost', 'N/A'))
            ]
            
            # Convert to string and handle None values
            terms_clean = [(k, str(v) if v and v != 'N/A' and v != 'None' and v != '$None' else 'Not Found') for k, v in terms]
            st.table(pd.DataFrame(terms_clean, columns=["Term", "Value"]))
            
        with col2:
            st.markdown("#### ⚠️ AI Risks & Observations")
            risks = data.get('risks', {})
            if isinstance(risks, dict):
                if risks.get('risk_level'):
                    st.metric("Risk Level", risks.get('risk_level', 'MODERATE'))
                for flag in risks.get('red_flags', []):
                    if isinstance(flag, dict):
                        st.warning(f"**{flag.get('issue', 'Issue')}**: {flag.get('explanation', '')}")
                    else:
                        st.warning(str(flag))
                for fee in risks.get('junk_fees', []):
                    st.error(f"💰 Junk Fee: {fee}")
                for term in risks.get('unfair_terms', []):
                    st.error(f"⚠️ Unfair: {term}")
                for rec in risks.get('recommendations', []):
                    st.info(f"💡 {rec}")
            elif isinstance(risks, list):
                for risk in risks:
                    st.warning(str(risk))
            else:
                st.info("No significant risks identified.")
                
        # AI Email Generator with Copy Button
        if st.button("📧 AI Email Generator & Negotiator"):
            with st.spinner("Generating counter-offer..."):
                resp = requests.post(f"{API_URL}/negotiate/script/{data['file_id']}")
                if resp.status_code == 200:
                    script = resp.json()['script']
                    st.session_state.generated_email = script
                else:
                    st.error(f"Failed to generate script: {resp.text}")
        
        if 'generated_email' in st.session_state:
            st.markdown("### 📧 Generated Counter-Email")
            st.text_area("Email Content:", st.session_state.generated_email, height=300, key="email_display")
            
            # Copy button using Pyperclip (since running locally)
            if st.button("📋 Copy Email to Clipboard"):
                try:
                    pyperclip.copy(st.session_state.generated_email)
                    st.success("✅ Email copied to clipboard!")
                except Exception as e:
                    st.warning("Could not copy automatically. Please copy manually below:")
                    st.code(st.session_state.generated_email, language="text")

def vin_assistant_view():
    st.title("🚗 VIN Assistant")
    vin = st.text_input("Enter VIN")
    mileage = st.number_input("Approximate Mileage", min_value=0)
    
    if st.button("Decode VIN"):
        with st.spinner("Fetching data from NHTSA..."):
            resp = requests.get(f"{API_URL}/decode-vin/{vin}")
            if resp.status_code == 200:
                data = resp.json()
                st.markdown(f"### Vehicle Details: {data.get('Year', '')} {data.get('Make', '')} {data.get('Model', '')}")
                st.json(data)
                
                # Simple price prediction formula for demo
                predicted_price = 30000 - (mileage * 0.15)
                st.metric("Estimated Market Value", f"${max(2000, predicted_price):,.2f}")
            else:
                st.error("Invalid VIN or API Error")

def comparison_view():
    st.title("⚖️ Contract Comparison")
    st.write("Upload two contracts to compare their fairness and identify missing data.")
    
    col1, col2 = st.columns(2)
    with col1:
        f1 = st.file_uploader("Upload Contract A", type=["pdf", "png", "jpg", "jpeg"], key="comp1")
    with col2:
        f2 = st.file_uploader("Upload Contract B", type=["pdf", "png", "jpg", "jpeg"], key="comp2")
        
    if st.button("Compare Contracts") and f1 and f2:
        with st.spinner("Analyzing both contracts..."):
            r1 = requests.post(f"{API_URL}/upload", files={"file": (f1.name, f1.getvalue(), f1.type)})
            r2 = requests.post(f"{API_URL}/upload", files={"file": (f2.name, f2.getvalue(), f2.type)})
            
            if r1.status_code == 200 and r2.status_code == 200:
                data1 = r1.json()
                data2 = r2.json()
                st.session_state.comparison_data = (data1, data2, f1.name, f2.name)
                st.success("Comparison Complete!")
            else:
                st.error("Error processing comparison.")
    
    if 'comparison_data' in st.session_state:
        data1, data2, name1, name2 = st.session_state.comparison_data
        
        c1, c2 = st.columns(2)
        
        s1 = data1['fairness_score']['overall_score']
        s2 = data2['fairness_score']['overall_score']
        
        with c1:
            st.markdown(f"### Contract A: {name1}")
            st.metric("Fairness Score", s1)
        
        with c2:
            st.markdown(f"### Contract B: {name2}")
            st.metric("Fairness Score", s2)
            
        # Recommendation
        st.markdown("---")
        if s1 > s2:
            st.success(f"🏆 **Recommendation:** Contract A is better by {s1-s2} points!")
        elif s2 > s1:
            st.success(f"🏆 **Recommendation:** Contract B is better by {s2-s1} points!")
        else:
            st.info("🤝 Both contracts are equally fair.")
        
        # Insights: Missing Data Comparison
        st.markdown("### 🔍 Insights: Data Availability")
        a1 = data1['analysis']
        a2 = data2['analysis']
        
        key_fields = ['interest_rate', 'monthly_payment', 'loan_term_months', 'down_payment', 'total_amount', 'mileage_limit']
        insights = []
        for field in key_fields:
            v1 = a1.get(field)
            v2 = a2.get(field)
            if v1 and not v2:
                insights.append(f"✅ **{field.replace('_', ' ').title()}** found in Contract A but missing in Contract B")
            elif v2 and not v1:
                insights.append(f"✅ **{field.replace('_', ' ').title()}** found in Contract B but missing in Contract A")
        
        if insights:
            for insight in insights:
                st.info(insight)
        else:
            st.success("Both contracts have the same data fields available.")
        
        # Hidden Fees JSON Download
        st.markdown("### 📥 Download Hidden Fees Comparison")
        fees1 = a1.get('hidden_fees', [])
        fees2 = a2.get('hidden_fees', [])
        
        fees_json = {
            "contract_a": {"name": name1, "hidden_fees": fees1},
            "contract_b": {"name": name2, "hidden_fees": fees2}
        }
        
        st.download_button(
            label="⬇️ Download Hidden Fees JSON",
            data=json.dumps(fees_json, indent=2),
            file_name="hidden_fees_comparison.json",
            mime="application/json"
        )
        
        # AI Email Generator for better contract
        st.markdown("### 📧 AI Negotiation Email Generator")
        better_contract = data1 if s1 > s2 else data2
        worse_contract = data2 if s1 > s2 else data1
        better_name = name1 if s1 > s2 else name2
        
        col_email1, col_email2 = st.columns(2)
        
        with col_email1:
            if st.button(f"Generate Email for Contract A", key="email_a"):
                with st.spinner("Generating negotiation email..."):
                    resp = requests.post(f"{API_URL}/negotiate/script/{data1['file_id']}")
                    if resp.status_code == 200:
                        st.session_state.comparison_email_a = resp.json()['script']
                    else:
                        st.error("Failed to generate email")
        
        with col_email2:
            if st.button(f"Generate Email for Contract B", key="email_b"):
                with st.spinner("Generating negotiation email..."):
                    resp = requests.post(f"{API_URL}/negotiate/script/{data2['file_id']}")
                    if resp.status_code == 200:
                        st.session_state.comparison_email_b = resp.json()['script']
                    else:
                        st.error("Failed to generate email")
        
        if 'comparison_email_a' in st.session_state:
            st.markdown("#### Contract A - Counter Email")
            st.text_area("Email for Contract A:", st.session_state.comparison_email_a, height=200, key="comp_email_a_display")
            if st.button("📋 Copy Email A", key="copy_a"):
                try:
                    pyperclip.copy(st.session_state.comparison_email_a)
                    st.success("✅ Copied Contract A email!")
                except:
                    st.code(st.session_state.comparison_email_a)
        
        if 'comparison_email_b' in st.session_state:
            st.markdown("#### Contract B - Counter Email")
            st.text_area("Email for Contract B:", st.session_state.comparison_email_b, height=200, key="comp_email_b_display")
            if st.button("📋 Copy Email B", key="copy_b"):
                try:
                    pyperclip.copy(st.session_state.comparison_email_b)
                    st.success("✅ Copied Contract B email!")
                except:
                    st.code(st.session_state.comparison_email_b)

def chatbots_view():
    st.title("🤖 AI Assistants")
    
    chat_type = st.radio("Choose Assistant", ["Negotiation AI", "Legal Advisor AI"], horizontal=True)
    
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []
        
    for msg in st.session_state.chat_history:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])
            
    if prompt := st.chat_input(f"Ask the {chat_type}..."):
        st.session_state.chat_history.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
            
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                file_id = st.session_state.get('analysis_data', {}).get('file_id', 'none')
                resp = requests.post(f"{API_URL}/negotiate/chat/{file_id}", json={"message": prompt})
                if resp.status_code == 200:
                    answer = resp.json()['response']
                    st.markdown(answer)
                    st.session_state.chat_history.append({"role": "assistant", "content": answer})
                else:
                    st.error("Chatbot unavailable")

# ======================
# MAIN
# ======================

if st.session_state.page == "Login" and not st.session_state.logged_in:
    login_page()
else:
    dashboard()
