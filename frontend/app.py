import streamlit as st

# --- Page Config ---
st.set_page_config(page_title="Car Lease Negotiator", layout="centered")

# --- Custom CSS ---
st.markdown("""
    <style>
    body {
        background-color: #f0f4f8;
        font-family: 'Segoe UI', sans-serif;
    }
    .chat-bubble-user {
        background-color: #d1e7dd;
        padding: 10px;
        border-radius: 12px;
        margin: 5px 0;
        text-align: left;
    }
    .chat-bubble-gemini {
        background-color: #f8d7da;
        padding: 10px;
        border-radius: 12px;
        margin: 5px 0;
        text-align: left;
    }
    .floating-chat-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #ff69b4;
        color: white;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
    }
    .floating-box {
        position: fixed;
        bottom: 90px;
        right: 20px;
        background-color: #fff0f5;
        border: 2px solid #ff69b4;
        border-radius: 16px;
        padding: 15px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        width: 280px;
    }
    .floating-title {
        font-weight: bold;
        color: #ff69b4;
        text-align: center;
        margin-bottom: 10px;
    }
    </style>
""", unsafe_allow_html=True)

# --- Title ---
st.title("🚗 Car Lease/Loan AI Negotiator")

# --- Session State ---
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []
if "chat_open" not in st.session_state:
    st.session_state.chat_open = False

# --- Floating Chat Button ---
if st.button("💬", key="chat_toggle"):
    st.session_state.chat_open = not st.session_state.chat_open

# --- Floating Chat Box ---
if st.session_state.chat_open:
    st.markdown("<div class='floating-box'><div class='floating-title'>Quick Questions</div>", unsafe_allow_html=True)

    # Predefined Q&A (fixed answers, no API key)
    qa_pairs = {
        "What is the current rate of car lease?": "Typical car lease rates range from 8%–12% depending on model and tenure.",
        "What is the optimal time period for renting a car?": "Usually 3–5 years is optimal for balancing cost and flexibility.",
        "How can I negotiate a better lease agreement?": "Focus on lowering upfront fees, checking mileage limits, and asking for maintenance coverage.",
        "What hidden costs should I watch out for?": "Watch for insurance add-ons, mileage penalties, late fees, and service charges."
    }

    for q, a in qa_pairs.items():
        if st.button(q, key=q):
            st.session_state.chat_history.append(("You", q))
            st.session_state.chat_history.append(("Gemini", a))

    # User Input
    user_input = st.text_input("Ask your own question:", key="user_input")
    if user_input:
        st.session_state.chat_history.append(("You", user_input))
        st.session_state.chat_history.append(("Gemini", "This is a demo answer. In production, connect Gemini API here."))

    st.markdown("</div>", unsafe_allow_html=True)

# --- Chat Display ---
st.subheader("Conversation")
for sender, message in st.session_state.chat_history:
    if sender == "You":
        st.markdown(f"<div class='chat-bubble-user'><b>{sender}:</b> {message}</div>", unsafe_allow_html=True)
    else:
        st.markdown(f"<div class='chat-bubble-gemini'><b>{sender}:</b> {message}</div>", unsafe_allow_html=True)
