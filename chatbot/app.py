import streamlit as st
from response_engine import get_ai_response

st.set_page_config(
    page_title="Car Lease Negotiation Assistant",
    layout="centered"
)

st.title("🚗 Car Lease & Loan Negotiation Assistant")

st.write(
    "This assistant helps you understand your car lease or loan contract, "
    "identify negotiation opportunities, and ask contract-related questions."
)

st.divider()

# ---------------- Guided Actions ----------------
st.subheader("Guided Actions")

col1, col2, col3 = st.columns(3)

with col1:
    explain_clicked = st.button("📄 Understand My Contract")

with col2:
    negotiate_clicked = st.button("💬 Find Negotiation Points")

with col3:
    draft_clicked = st.button("✉️ Draft Negotiation Message")

# ---------------- Ask Your Own Question ----------------
st.divider()
st.subheader("Ask Your Own Question")

user_question = st.text_input(
    "Type your question about the contract",
    placeholder="Example: Can I negotiate the mileage limit?"
)

ask_clicked = st.button("Ask")

st.divider()

# ---------------- Response Area ----------------
if explain_clicked:
    with st.spinner("Analyzing your contract..."):
        st.subheader("Contract Explanation")
        st.write(get_ai_response("explain"))

elif negotiate_clicked:
    with st.spinner("Finding negotiation opportunities..."):
        st.subheader("Negotiation Guidance")
        st.write(get_ai_response("negotiate"))

elif draft_clicked:
    with st.spinner("Drafting negotiation message..."):
        st.subheader("Draft Message")
        st.write(get_ai_response("draft"))

elif ask_clicked:
    if not user_question.strip():
        st.warning("Please enter a question related to your contract.")
    else:
        with st.spinner("Thinking..."):
            st.subheader("Answer")
            st.write(get_ai_response("ask", user_question=user_question))

else:
    st.info("Choose an option above or ask your own question to get started.")
