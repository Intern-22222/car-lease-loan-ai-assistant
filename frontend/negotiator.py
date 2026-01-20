import streamlit as st
import pdfplumber
import os
import re
from dotenv import load_dotenv
from google import genai
from datetime import datetime   # ✅ FIXED

load_dotenv()

# =========================
# PAGE CONFIG
# =========================
st.set_page_config(
    page_title="AI Lease Negotiation Assistant",
    page_icon="🤝",
    layout="wide"
)

st.title("🤖 AI Lease Negotiation Assistant")
st.caption("• Contract Aware • Rule-Based")

# =========================
# GEMINI CLIENT
# =========================
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    st.error("❌ GEMINI_API_KEY not found in environment variables")
    st.stop()

client = genai.Client(api_key=API_KEY)

# =========================
# SESSION STATE
# =========================
if "messages" not in st.session_state:
    st.session_state.messages = []

if "contract_text" not in st.session_state:
    st.session_state.contract_text = ""

if "email" not in st.session_state:
    st.session_state.email = ""

# =========================
# PDF TEXT EXTRACTION
# =========================
def extract_text(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

# =========================
# FAIRNESS SCORE
# =========================
def calculate_fairness_score(text):
    score = 100

    apr = re.search(r"(\d+\.?\d*)\s*%", text)
    if apr and float(apr.group(1)) > 5:
        score -= 15

    if "overage" in text.lower():
        score -= 10
    if "early termination" in text.lower():
        score -= 5
    if "documentation fee" in text.lower():
        score -= 10

    return max(score, 0)

# =========================
# SIDEBAR
# =========================
with st.sidebar:
    st.header("📄 Upload Lease / Loan Contract")
    uploaded_pdf = st.file_uploader("Upload PDF", type=["pdf"])

    if uploaded_pdf:
        st.session_state.contract_text = extract_text(uploaded_pdf)
        st.success("✅ Contract Loaded Successfully")

# =========================
# METRICS
# =========================
if st.session_state.contract_text:
    score = calculate_fairness_score(st.session_state.contract_text)
    c1, c2, c3 = st.columns(3)
    c1.metric("📊 Fairness Score", f"{score}/100")
    c2.metric("📄 Words", len(st.session_state.contract_text.split()))
    c3.metric("🕒 Time", datetime.now().strftime("%H:%M:%S"))
    st.divider()

# =========================
# CHAT HISTORY
# =========================
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# =========================
# CHAT INPUT
# =========================
user_input = st.chat_input("Ask to analyze or negotiate the contract...")

if user_input and st.session_state.contract_text:
    st.session_state.messages.append({"role": "user", "content": user_input})

    with st.chat_message("user"):
        st.markdown(user_input)

    prompt = f"""
You are an expert car lease and loan negotiation assistant.

Rules:
- Follow real-world lease rules
- Suggest realistic counter offers
- Identify hidden or junk fees
- Generate professional negotiation emails
- Never hallucinate numbers

Contract Text:
{st.session_state.contract_text}

Conversation History:
{st.session_state.messages}

User Question:
{user_input}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",   # ✅ UPDATED MODEL
        contents=prompt
    )

    reply = response.text

    st.session_state.messages.append({"role": "assistant", "content": reply})

    with st.chat_message("assistant"):
        st.markdown(reply)

    if "Subject:" in reply or "Dear" in reply:
        st.success("✅ Email Generated Successfully")
        
