import streamlit as st
import requests

API_BASE_URL = "http://localhost:8000"

st.set_page_config(
    page_title="AI Contract Negotiator",
    page_icon="🤖",
    layout="wide"
)

# ======================
# CSS
# ======================
st.markdown("""
<style>
.score-green { color: #2ecc71; font-size: 28px; font-weight: bold; }
.score-orange { color: #f39c12; font-size: 28px; font-weight: bold; }
.score-red { color: #e74c3c; font-size: 28px; font-weight: bold; }

.email-container {
    background: #1e1e1e;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #444;
    font-family: 'Courier New', monospace;
    white-space: pre-wrap;
    line-height: 1.6;
}

.tips-box {
    background: #e8f4f8;
    border-left: 4px solid #2196F3;
    padding: 15px;
    margin: 15px 0;
    border-radius: 4px;
    color: #1a1a1a;
}

.tips-box h4 {
    color: #1565C0;
    margin-bottom: 10px;
}

.tips-box ul {
    color: #2c3e50;
    line-height: 1.8;
}

.tips-box strong {
    color: #0d47a1;
}

.stat-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 15px;
    border-radius: 8px;
    color: white;
    text-align: center;
}
</style>
""", unsafe_allow_html=True)

# ======================
# SESSION STATE
# ======================
if "file_id" not in st.session_state:
    st.session_state.file_id = None

if "analysis_result" not in st.session_state:
    st.session_state.analysis_result = None

if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

if "generated_email" not in st.session_state:
    st.session_state.generated_email = None

# ======================
# TITLE
# ======================
st.title("🤖 AI Car Loan / Lease Negotiation Assistant")

# ======================
# SIDEBAR – UPLOAD & ANALYZE
# ======================
with st.sidebar:
    st.header("📄 Upload Contract")
    uploaded_file = st.file_uploader("Upload PDF", type=["pdf"])

    if uploaded_file and st.button("🔍 Analyze Contract"):
        with st.spinner("Uploading & Analyzing..."):
            try:
                files = {
                    "file": (
                        uploaded_file.name,
                        uploaded_file.getvalue(),
                        "application/pdf"
                    )
                }

                upload_res = requests.post(
                    f"{API_BASE_URL}/upload",
                    files=files
                )

                if upload_res.status_code != 200:
                    st.error("Upload failed")
                else:
                    file_id = upload_res.json()["file_id"]
                    st.session_state.file_id = file_id

                    analyze_res = requests.post(
                        f"{API_BASE_URL}/analyze/{file_id}"
                    )

                    if analyze_res.status_code == 200:
                        st.session_state.analysis_result = analyze_res.json()
                        st.session_state.chat_history = []
                        st.session_state.generated_email = None
                        st.success("✅ Analysis completed")
                    else:
                        st.error("Analysis failed")

            except Exception as e:
                st.error(str(e))

# ======================
# MAIN CONTENT
# ======================
if st.session_state.analysis_result:

    data = st.session_state.analysis_result
    analysis = data.get("analysis", {})
    fairness = data.get("fairness_score", {})
    risks = data.get("risks", {})

    tab1, tab2, tab3 = st.tabs(
        ["📊 Analysis", "🤝 Negotiation Chat", "✉️ Counter-Email"]
    )

    # ======================
    # TAB 1 – ANALYSIS
    # ======================
    with tab1:
        st.header("📊 Contract Analysis")

        score = fairness.get("overall_score", 0)
        color = fairness.get("ui_color", "orange")
        category = fairness.get("category", "FAIR")

        st.markdown(
            f"<div class='score-{color}'>{score}/100</div>",
            unsafe_allow_html=True
        )
        st.caption(f"Category: {category}")

        st.markdown("---")

        col1, col2 = st.columns(2)

        with col1:
            st.write(f"**Contract Type:** {analysis.get('contract_type')}")
            st.write(f"**Monthly Payment:** ${analysis.get('monthly_payment')}")
            st.write(f"**Interest Rate (APR):** {analysis.get('interest_rate')}%")
            st.write(f"**Loan Term:** {analysis.get('loan_term_months')} months")

        with col2:
            st.write(f"**Down Payment:** ${analysis.get('down_payment')}")
            st.write(f"**Total Amount:** ${analysis.get('total_amount')}")

        st.subheader("🚩 Fairness Score Explanation")
        reasons = fairness.get("explanation", [])
        if reasons:
            for r in reasons:
                st.warning(r)
        else:
            st.success("No major fairness issues detected")

        st.subheader("💰 Hidden / Junk Fees")
        fees = analysis.get("hidden_fees", [])
        if fees:
            for fee in fees:
                icon = "⚠️" if fee.get("is_junk") else "ℹ️"
                st.write(
                    f"{icon} {fee.get('name')} – ${fee.get('amount', 0)}"
                )
        else:
            st.success("No hidden fees found")

        st.subheader("⚠️ Risk Summary")
        st.write(f"**Risk Level:** {risks.get('risk_level', 'MODERATE')}")

        for flag in risks.get("red_flags", []):
            if isinstance(flag, dict):
                st.warning(flag.get("issue", "Risk detected"))
            else:
                st.warning(flag)

    # ======================
    # TAB 2 – CHAT
    # ======================
    with tab2:
        st.header("🤝 Negotiation Chat")

        for msg in st.session_state.chat_history:
            with st.chat_message(msg["role"]):
                st.write(msg["content"])

        user_input = st.chat_input("Ask negotiation advice…")

        if user_input:
            st.session_state.chat_history.append(
                {"role": "user", "content": user_input}
            )

            with st.chat_message("user"):
                st.write(user_input)

            with st.chat_message("assistant"):
                with st.spinner("Thinking..."):
                    try:
                        res = requests.post(
                            f"{API_BASE_URL}/negotiate/chat/{st.session_state.file_id}",
                            json={"message": user_input},
                            timeout=30
                        )

                        if res.status_code == 200:
                            reply = res.json()["response"]
                        else:
                            reply = "Unable to get response."

                    except Exception:
                        reply = "Error contacting server."

                    st.session_state.chat_history.append(
                        {"role": "assistant", "content": reply}
                    )
                    st.write(reply)

            st.rerun()

        if st.button("🗑️ Clear Chat"):
            st.session_state.chat_history = []
            st.rerun()

    # ======================
    # TAB 3 – COUNTER-EMAIL (NEW & IMPROVED)
    # ======================
    with tab3:
        st.header("✉️ Professional Counter-Offer Email")
        st.caption("Auto-generated negotiation email based on your contract analysis")

        # Quick Stats
        col1, col2, col3 = st.columns(3)
        
        current_apr = analysis.get('interest_rate', 0)
        target_apr = max(6.5, current_apr - 1.5)
        monthly = analysis.get('monthly_payment', 0)
        term = analysis.get('loan_term_months', 60)
        
        savings = (monthly * term) - (monthly * (target_apr / current_apr) * term) if current_apr else 0

        with col1:
            st.markdown(f"""
            <div class='stat-card'>
                <h4>Current APR</h4>
                <h2 style='color: #ff6b6b;'>{current_apr}%</h2>
            </div>
            """, unsafe_allow_html=True)

        with col2:
            st.markdown(f"""
            <div class='stat-card'>
                <h4>Target APR</h4>
                <h2 style='color: #51cf66;'>{target_apr:.1f}%</h2>
            </div>
            """, unsafe_allow_html=True)

        with col3:
            st.markdown(f"""
            <div class='stat-card'>
                <h4>Potential Savings</h4>
                <h2 style='color: #ffd43b;'>${savings:,.0f}</h2>
            </div>
            """, unsafe_allow_html=True)

        st.markdown("---")

        # Generate Button
        col_btn1, col_btn2, col_btn3 = st.columns([1, 1, 1])
        
        with col_btn1:
            if st.button("📧 Generate Counter-Email", use_container_width=True, type="primary"):
                with st.spinner("Generating professional email..."):
                    try:
                        res = requests.post(
                            f"{API_BASE_URL}/negotiate/script/{st.session_state.file_id}"
                        )

                        if res.status_code == 200:
                            st.session_state.generated_email = res.json()["script"]
                            st.success("✅ Email generated successfully!")
                        else:
                            st.error("Failed to generate email")
                    except Exception as e:
                        st.error(f"Error: {str(e)}")

        # Display Email
        if st.session_state.generated_email:
            
            with col_btn2:
                if st.button("📋 Copy to Clipboard", use_container_width=True):
                    st.code(st.session_state.generated_email, language=None)
                    st.info("👆 Select all and copy (Ctrl+C / Cmd+C)")

            with col_btn3:
                st.download_button(
                    label="📥 Download Email",
                    data=st.session_state.generated_email,
                    file_name="counter_offer_email.txt",
                    mime="text/plain",
                    use_container_width=True
                )

            st.markdown("### 📄 Your Counter-Offer Email:")
            
            # Email Preview in a nice container
            st.markdown(
                f"<div class='email-container'>{st.session_state.generated_email}</div>",
                unsafe_allow_html=True
            )

            # Edit Option
            st.markdown("---")
            with st.expander("✏️ Edit Email (Optional)"):
                edited_email = st.text_area(
                    "Customize your email:",
                    value=st.session_state.generated_email,
                    height=400,
                    key="email_editor"
                )
                if st.button("💾 Save Edited Version"):
                    st.session_state.generated_email = edited_email
                    st.success("✅ Email updated!")
                    st.rerun()

            # Tips Section
            st.markdown("---")
            st.markdown("""
            <div class='tips-box'>
                <h4>💡 Tips for Maximum Impact</h4>
                <ul>
                    <li><strong>Personalize:</strong> Replace [Your Name] and [Dealer Name] with actual details</li>
                    <li><strong>Timing:</strong> Send at month-end when dealers need to hit sales quotas</li>
                    <li><strong>Backup plan:</strong> Get a competing quote from a credit union first</li>
                    <li><strong>Tone:</strong> Professional but firm - you're partners, not adversaries</li>
                    <li><strong>Follow up:</strong> If no response in 2-3 days, call to discuss</li>
                    <li><strong>Be ready to walk:</strong> Don't be afraid to leave if they won't negotiate</li>
                </ul>
            </div>
            """, unsafe_allow_html=True)

        else:
            # Before generating
            st.info("👆 Click the button above to generate your personalized counter-offer email")
            
            st.markdown("### What you'll get:")
            st.markdown("""
            ✅ **Professional email template** ready to send  
            ✅ **Specific contract details** automatically filled in  
            ✅ **Market comparisons** to justify your requests  
            ✅ **Calculated savings** to show financial impact  
            ✅ **Negotiation tactics** built into the message  
            ✅ **Downloadable** text file for easy sharing  
            """)

else:
    st.info("👈 Upload a PDF and click Analyze to start")
    st.markdown("""
### Features
- ✅ Fairness Score (0–100)
- ✅ Hidden & Junk Fee Detection
- ✅ Risk Analysis
- ✅ Contract-Aware Negotiation Chat
- ✅ Professional Counter-Offer Email Generator
""")