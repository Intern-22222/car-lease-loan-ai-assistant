import streamlit as st
import PyPDF2
import docx
import json
import numpy as np
from io import BytesIO
from huggingface_hub import InferenceClient
import re
from datetime import datetime

st.set_page_config(page_title="Contract Comparison Dashboard", layout="wide")

st.title("📄 Contract Comparison Dashboard")
st.markdown("Upload two contract files to compare their key terms and fairness scores")

# Sidebar for HuggingFace configuration
with st.sidebar:
    st.header("⚙️ Configuration")
    hf_token = st.text_input("HuggingFace Access Token", type="password", 
                             help="Enter your HuggingFace API token")
    model_name = st.selectbox(
        "Select Model",
        ["Qwen/Qwen2.5-7B-Instruct",
         "meta-llama/Llama-3.2-3B-Instruct",
         "microsoft/Phi-3-mini-4k-instruct",
         "HuggingFaceH4/zephyr-7b-beta"],
        help="Choose the LLM model for analysis"
    )
    
    st.info("💡 Using HuggingFace Inference Client")
    st.caption("First request may take 20-30s (model loading)")
    
    st.markdown("---")
    st.subheader("📊 Market Benchmarks")
    st.caption("Set average market values for fairness scoring")
    avg_payment = st.number_input("Average Monthly Payment ($)", value=450.0, min_value=0.0, step=50.0)
    avg_apr = st.number_input("Average APR (%)", value=4.0, min_value=0.0, max_value=30.0, step=0.5)

def calculate_fairness_score(contract_data, market_benchmarks):
    """
    contract_data: dict containing 'monthly_payment', 'apr', 'fees'
    market_benchmarks: dict containing 'avg_payment', 'avg_apr'
    """
    # 1. Price Score (0-50 points)
    if contract_data['monthly_payment'] > 0:
        price_ratio = market_benchmarks['avg_payment'] / contract_data['monthly_payment']
        price_score = np.clip(price_ratio * 50, 0, 50)
    else:
        price_score = 0
    
    # 2. Interest/Risk Score (0-30 points)
    apr_diff = contract_data['apr'] - market_benchmarks['avg_apr']
    risk_score = 30 - np.clip(apr_diff * 5, 0, 30)
    
    # 3. Fee Penalty (0-20 points)
    fee_penalty = len(contract_data.get('junk_fees', [])) * 5
    final_fee_score = np.clip(20 - fee_penalty, 0, 20)
    
    total_score = price_score + risk_score + final_fee_score
    
    return {
        'total_score': round(total_score, 2),
        'price_score': round(price_score, 2),
        'risk_score': round(risk_score, 2),
        'fee_score': round(final_fee_score, 2)
    }

def extract_numeric_value(text):
    """Extract numeric values from text with better error handling"""
    if not text or text == "Not specified" or text == "Not analyzed":
        return None
    
    numbers = re.findall(r'\d+\.?\d*', str(text))
    if numbers:
        try:
            return float(numbers[0])
        except (ValueError, IndexError):
            return None
    return None

def identify_junk_fees(penalties_text):
    """Identify potential junk fees from penalties text with word boundary matching"""
    if not penalties_text or penalties_text == "Not specified" or penalties_text == "Not analyzed":
        return []
    
    junk_fee_keywords = [
        'vin etching', 'nitrogen', 'dealer prep', 'documentation fee',
        'market adjustment', 'advertising fee', 'processing fee', 'delivery charge',
        'reconditioning', 'fabric protection', 'paint protection', 'theft deterrent',
        'etching fee', 'prep fee', 'doc fee', 'dealer fee'
    ]
    
    identified_fees = []
    text_lower = penalties_text.lower()
    
    for keyword in junk_fee_keywords:
        if re.search(rf'\b{re.escape(keyword)}\b', text_lower):
            identified_fees.append(keyword.title())
    
    return list(set(identified_fees))

def validate_contract_data(analysis, contract_name):
    """Validate extracted contract data and log any issues"""
    validation_issues = []
    
    critical_fields = ['monthly_payment', 'interest_rate_apr', 'lease_term_duration']
    for field in critical_fields:
        value = analysis.get(field)
        if not value or value == "Not specified" or value == "Not analyzed":
            validation_issues.append(f"⚠️ {field.replace('_', ' ').title()} not found")
    
    monthly_payment = extract_numeric_value(analysis.get('monthly_payment'))
    apr = extract_numeric_value(analysis.get('interest_rate_apr'))
    
    if monthly_payment and monthly_payment <= 0:
        validation_issues.append(f"❌ Invalid monthly payment: ${monthly_payment}")
    
    if apr and (apr < 0 or apr > 30):
        validation_issues.append(f"❌ Unusual APR value: {apr}% (typically 0-30%)")
    
    if monthly_payment and monthly_payment > 2000:
        validation_issues.append(f"⚠️ High monthly payment: ${monthly_payment} - please verify")
    
    if validation_issues:
        with st.expander(f"⚠️ Validation Issues for {contract_name}", expanded=False):
            for issue in validation_issues:
                st.warning(issue)
    else:
        st.success(f"✅ {contract_name} passed all validation checks")
    
    return len(validation_issues) == 0

def prepare_contract_for_scoring(analysis):
    """Convert contract analysis to format needed for fairness scoring"""
    monthly_payment = extract_numeric_value(analysis.get('monthly_payment'))
    apr = extract_numeric_value(analysis.get('interest_rate_apr'))
    junk_fees = identify_junk_fees(analysis.get('penalties_late_fees'))
    
    return {
        'monthly_payment': monthly_payment if monthly_payment else 0,
        'apr': apr if apr else 0,
        'junk_fees': junk_fees,
        'extraction_failed': {
            'monthly_payment': monthly_payment is None,
            'apr': apr is None
        }
    }

def get_score_color(score):
    """Return color based on score"""
    if score >= 80:
        return "🟢"
    elif score >= 60:
        return "🟡"
    else:
        return "🔴"

def extract_text_from_pdf(file):
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(BytesIO(file.read()))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        st.error(f"Error reading PDF: {str(e)}")
        return None

def extract_text_from_docx(file):
    """Extract text from DOCX file"""
    try:
        doc = docx.Document(BytesIO(file.read()))
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text
    except Exception as e:
        st.error(f"Error reading DOCX: {str(e)}")
        return None

def extract_text_from_txt(file):
    """Extract text from TXT file"""
    try:
        return file.read().decode('utf-8')
    except Exception as e:
        st.error(f"Error reading TXT: {str(e)}")
        return None

def extract_text(file):
    """Extract text based on file type"""
    file_type = file.name.split('.')[-1].lower()
    
    if file_type == 'pdf':
        return extract_text_from_pdf(file)
    elif file_type == 'docx':
        return extract_text_from_docx(file)
    elif file_type == 'txt':
        return extract_text_from_txt(file)
    else:
        st.error(f"Unsupported file type: {file_type}")
        return None

def extract_json_from_response(response_text):
    """Extract JSON from LLM response with multiple fallback strategies"""
    
    # Strategy 1: Try markdown code block
    if '```json' in response_text:
        try:
            json_str = response_text.split('```json')[1].split('```')[0].strip()
            return json.loads(json_str)
        except (IndexError, json.JSONDecodeError):
            pass
    
    # Strategy 2: Try generic code block
    if '```' in response_text:
        try:
            json_str = response_text.split('```')[1].split('```')[0].strip()
            return json.loads(json_str)
        except (IndexError, json.JSONDecodeError):
            pass
    
    # Strategy 3: Find first complete JSON object
    patterns = [
        r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}',
        r'\{.*?\}',
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, response_text, re.DOTALL)
        for match in matches:
            try:
                return json.loads(match)
            except json.JSONDecodeError:
                continue
    
    # Strategy 4: Try raw text between first { and last }
    try:
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        
        if json_start != -1 and json_end > json_start:
            json_str = response_text[json_start:json_end]
            return json.loads(json_str)
    except json.JSONDecodeError:
        pass
    
    return None

def analyze_contract_with_llm(contract_text, hf_token, model_name):
    """Send contract text to HuggingFace LLM for analysis"""
    
    system_prompt = """You are a contract analysis assistant specializing in identifying hidden fees and unfair terms. Extract contract terms and return ONLY a valid JSON object with no additional text."""
    
    user_prompt = f"""Analyze this contract and extract these terms. Pay special attention to hidden/junk fees. Return ONLY a JSON object:

{{
  "interest_rate_apr": "value or 'Not specified'",
  "lease_term_duration": "value or 'Not specified'",
  "monthly_payment": "value or 'Not specified'",
  "down_payment": "value or 'Not specified'",
  "residual_value": "value or 'Not specified'",
  "mileage_allowance": "value or 'Not specified'",
  "mileage_overage_charges": "value or 'Not specified'",
  "early_termination_clause": "summary or 'Not specified'",
  "purchase_option": "value or 'Not specified'",
  "maintenance_responsibilities": "summary or 'Not specified'",
  "warranty_coverage": "summary or 'Not specified'",
  "insurance_coverage": "summary or 'Not specified'",
  "penalties_late_fees": "summary or 'Not specified'",
  "hidden_fees": [
    {{
      "fee_name": "name of fee",
      "amount": "fee amount or 'variable'",
      "description": "brief description",
      "is_junk_fee": true or false
    }}
  ]
}}

Look for these common junk/hidden fees:
- VIN Etching, Nitrogen tire fill, Dealer prep, Documentation fees, Market adjustment
- Advertising fees, Processing fees, Delivery charges, Reconditioning fees
- Fabric/Paint protection, Anti-theft devices, Extended warranties sold as mandatory

Contract text:
{contract_text[:2500]}"""

    try:
        client = InferenceClient(token=hf_token)
        
        with st.spinner(f"🤖 Analyzing with {model_name}... (first call may take 20-30s)"):
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
            
            response = client.chat_completion(
                messages=messages,
                model=model_name,
                max_tokens=800,
                temperature=0.1
            )
        
        response_text = response.choices[0].message.content.strip()
        
        parsed_data = extract_json_from_response(response_text)
        
        if parsed_data:
            st.success("✅ Successfully analyzed contract")
            return parsed_data
        else:
            st.warning(f"⚠️ Could not parse JSON. Response preview: {response_text[:200]}")
            return get_placeholder_data()
                
    except Exception as e:
        error_msg = str(e)
        
        if "Rate limit" in error_msg or "429" in error_msg:
            st.error("⏱️ Rate limit reached. Please wait a minute and try again.")
        elif "loading" in error_msg.lower() or "503" in error_msg:
            st.error("⏳ Model is loading. Please wait 20-30 seconds and try again.")
        elif "not found" in error_msg.lower() or "404" in error_msg:
            st.error(f"❌ Model '{model_name}' not accessible. Try a different model.")
        elif "authorization" in error_msg.lower() or "401" in error_msg:
            st.error("🔑 Invalid token. Check your HuggingFace access token.")
        elif "not supported" in error_msg.lower():
            st.error(f"❌ Model doesn't support this task. Try selecting 'Qwen/Qwen2.5-7B-Instruct' instead.")
        else:
            st.error(f"❌ Error: {error_msg}")
        
        return None

def generate_negotiation_email(analysis, score, contract_data, market_benchmarks, hf_token, model_name, user_info):
    """Generate a professional negotiation email using LLM"""
    
    # Build context for the LLM
    issues = []
    
    # Check monthly payment
    if contract_data['monthly_payment'] > market_benchmarks['avg_payment']:
        diff = contract_data['monthly_payment'] - market_benchmarks['avg_payment']
        issues.append(f"Monthly payment is ${diff:.2f} above market average (${contract_data['monthly_payment']:.2f} vs ${market_benchmarks['avg_payment']:.2f})")
    
    # Check APR
    if contract_data['apr'] > market_benchmarks['avg_apr']:
        diff = contract_data['apr'] - market_benchmarks['avg_apr']
        issues.append(f"APR is {diff:.2f}% above market average ({contract_data['apr']:.1f}% vs {market_benchmarks['avg_apr']:.1f}%)")
    
    # Check junk fees
    if contract_data['junk_fees']:
        issues.append(f"Contract contains questionable fees: {', '.join(contract_data['junk_fees'])}")
    
    # Overall fairness score
    if score['total_score'] < 70:
        issues.append(f"Overall fairness score is {score['total_score']}/100, indicating unfavorable terms")
    
    system_prompt = """You are a professional contract negotiation assistant. Generate a polite but firm counter-offer email based on the contract issues identified. The email should be professional, specific, and actionable."""
    
    user_prompt = f"""Generate a professional counter-offer email for a contract negotiation.

USER INFORMATION:
- Name: {user_info.get('name', '[Your Name]')}
- Email: {user_info.get('email', '[Your Email]')}
- Phone: {user_info.get('phone', '[Your Phone]')}

RECIPIENT:
- Dealer/Company: {user_info.get('dealer', '[Dealer Name]')}
- Contact Person: {user_info.get('contact', '[Sales Representative]')}

CONTRACT ISSUES IDENTIFIED:
{chr(10).join(f"- {issue}" for issue in issues)}

CURRENT CONTRACT TERMS:
- Monthly Payment: ${contract_data['monthly_payment']:.2f}
- APR: {contract_data['apr']:.1f}%
- Fairness Score: {score['total_score']}/100

MARKET BENCHMARKS:
- Average Monthly Payment: ${market_benchmarks['avg_payment']:.2f}
- Average APR: {market_benchmarks['avg_apr']:.1f}%

Generate a professional email that:
1. Thanks them for the initial offer
2. Professionally points out the specific issues
3. Provides data-backed reasoning (market averages)
4. Makes specific counter-proposals
5. Expresses continued interest while being firm
6. Requests a response within a reasonable timeframe

Format the email ready to send, including subject line."""

    try:
        client = InferenceClient(token=hf_token)
        
        with st.spinner("✍️ Generating negotiation email..."):
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
            
            response = client.chat_completion(
                messages=messages,
                model=model_name,
                max_tokens=1000,
                temperature=0.7
            )
        
        email_content = response.choices[0].message.content.strip()
        return email_content
                
    except Exception as e:
        st.error(f"❌ Error generating email: {str(e)}")
        return None

def get_placeholder_data():
    """Return placeholder structure when LLM fails"""
    return {
        "interest_rate_apr": "Not analyzed",
        "lease_term_duration": "Not analyzed",
        "monthly_payment": "Not analyzed",
        "down_payment": "Not analyzed",
        "residual_value": "Not analyzed",
        "mileage_allowance": "Not analyzed",
        "mileage_overage_charges": "Not analyzed",
        "early_termination_clause": "Not analyzed",
        "purchase_option": "Not analyzed",
        "maintenance_responsibilities": "Not analyzed",
        "warranty_coverage": "Not analyzed",
        "insurance_coverage": "Not analyzed",
        "penalties_late_fees": "Not analyzed",
        "hidden_fees": []
    }

def convert_to_native_types(obj):
    """Recursively convert numpy types to native Python types"""
    if isinstance(obj, dict):
        return {key: convert_to_native_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_native_types(item) for item in obj]
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    else:
        return obj

def find_missing_attributes(analysis1, analysis2):
    """Find attributes that are missing or not specified in either contract"""
    missing_insights = []
    
    all_fields = {
        "interest_rate_apr": "Interest Rate / APR",
        "lease_term_duration": "Lease Term Duration",
        "monthly_payment": "Monthly Payment",
        "down_payment": "Down Payment",
        "residual_value": "Residual Value",
        "mileage_allowance": "Mileage Allowance",
        "mileage_overage_charges": "Overage Charges",
        "early_termination_clause": "Early Termination",
        "purchase_option": "Purchase Option",
        "maintenance_responsibilities": "Maintenance",
        "warranty_coverage": "Warranty Coverage",
        "insurance_coverage": "Insurance Coverage",
        "penalties_late_fees": "Penalties/Late Fees"
    }
    
    for field_key, field_name in all_fields.items():
        val1 = analysis1.get(field_key, "Not specified")
        val2 = analysis2.get(field_key, "Not specified")
        
        is_missing_1 = val1 in ["Not specified", "Not analyzed", None, ""]
        is_missing_2 = val2 in ["Not specified", "Not analyzed", None, ""]
        
        if is_missing_1 and not is_missing_2:
            missing_insights.append({
                'field': field_name,
                'contract': 1,
                'value': val2,
                'type': 'missing'
            })
        elif is_missing_2 and not is_missing_1:
            missing_insights.append({
                'field': field_name,
                'contract': 2,
                'value': val1,
                'type': 'missing'
            })
        elif is_missing_1 and is_missing_2:
            missing_insights.append({
                'field': field_name,
                'contract': 'both',
                'value': None,
                'type': 'both_missing'
            })
    
    return missing_insights

# File upload section
col1, col2 = st.columns(2)

with col1:
    st.subheader("📎 Contract 1")
    file1 = st.file_uploader("Upload first contract", type=['pdf', 'docx', 'txt'], key="file1")

with col2:
    st.subheader("📎 Contract 2")
    file2 = st.file_uploader("Upload second contract", type=['pdf', 'docx', 'txt'], key="file2")

# Analysis button
analyze_button = st.button("🔍 Analyze and Compare Contracts", type="primary", use_container_width=True)

if analyze_button:
    if not hf_token:
        st.error("⚠️ Please enter your HuggingFace access token in the sidebar")
    elif not file1 or not file2:
        st.error("⚠️ Please upload both contract files")
    else:
        results_container = st.container()
        
        with results_container:
            st.markdown('<div id="results"></div>', unsafe_allow_html=True)
            
            with st.spinner("Processing contracts..."):
                st.info("📄 Extracting text from Contract 1...")
                text1 = extract_text(file1)
                
                st.info("📄 Extracting text from Contract 2...")
                text2 = extract_text(file2)
            
            if text1 and text2:
                st.info("🤖 Analyzing Contract 1...")
                analysis1 = analyze_contract_with_llm(text1, hf_token, model_name)
                
                st.info("🤖 Analyzing Contract 2...")
                analysis2 = analyze_contract_with_llm(text2, hf_token, model_name)
                
                if analysis1 and analysis2:
                    st.success("✅ Analysis complete!")
                    
                    # Validate contract data
                    st.header("🔍 Data Validation")
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        valid1 = validate_contract_data(analysis1, "Contract 1")
                    
                    with col2:
                        valid2 = validate_contract_data(analysis2, "Contract 2")
                    
                    st.markdown("---")
                    
                    # Calculate fairness scores
                    market_benchmarks = {
                        'avg_payment': avg_payment,
                        'avg_apr': avg_apr
                    }
                    
                    contract1_data = prepare_contract_for_scoring(analysis1)
                    contract2_data = prepare_contract_for_scoring(analysis2)
                    
                    score1 = calculate_fairness_score(contract1_data, market_benchmarks)
                    score2 = calculate_fairness_score(contract2_data, market_benchmarks)
                    
                    # Store in session state for negotiation
                    st.session_state['analysis1'] = analysis1
                    st.session_state['analysis2'] = analysis2
                    st.session_state['score1'] = score1
                    st.session_state['score2'] = score2
                    st.session_state['contract1_data'] = contract1_data
                    st.session_state['contract2_data'] = contract2_data
                    st.session_state['market_benchmarks'] = market_benchmarks
                    st.session_state['analysis_complete'] = True
                    
                    # Recommendation
                    st.markdown("---")
                    if score1['total_score'] > score2['total_score']:
                        st.success(f"✅ **Recommendation:** Contract 1 is fairer (Score difference: +{round(score1['total_score'] - score2['total_score'], 2)} points)")
                        st.session_state['recommended_contract'] = 1
                    elif score2['total_score'] > score1['total_score']:
                        st.success(f"✅ **Recommendation:** Contract 2 is fairer (Score difference: +{round(score2['total_score'] - score1['total_score'], 2)} points)")
                        st.session_state['recommended_contract'] = 2
                    else:
                        st.info("ℹ️ Both contracts have equal fairness scores")
                        st.session_state['recommended_contract'] = 1
                    
                    # NEW: Insights Section - Only show missing attributes
                    st.markdown("---")
                    st.header("💡 Contract Insights - Missing Attributes")
                    
                    missing_insights = find_missing_attributes(analysis1, analysis2)
                    
                    if missing_insights:
                        for insight in missing_insights:
                            if insight['type'] == 'missing':
                                if insight['contract'] == 1:
                                    st.warning(f"⚠️ **{insight['field']}** is missing in Contract 1 (Contract 2 has: {insight['value']})")
                                else:
                                    st.warning(f"⚠️ **{insight['field']}** is missing in Contract 2 (Contract 1 has: {insight['value']})")
                            elif insight['type'] == 'both_missing':
                                st.error(f"❌ **{insight['field']}** is missing in BOTH contracts")
                    else:
                        st.success("✅ All attributes are present in both contracts!")
                    
                    # CHANGE 1: Download option - Modified to ONLY show junk/hidden fees
                    st.markdown("---")
                    st.subheader("💾 Download Junk/Hidden Fees Report")
                    
                    # Filter hidden_fees to only include junk fees (is_junk_fee: true)
                    contract1_junk_hidden_fees = [
                        fee for fee in analysis1.get('hidden_fees', [])
                        if fee.get('is_junk_fee', False)
                    ]
                    
                    contract2_junk_hidden_fees = [
                        fee for fee in analysis2.get('hidden_fees', [])
                        if fee.get('is_junk_fee', False)
                    ]
                    
                    results = {
                        "contract_1": {
                            "junk_fees_identified": contract1_data['junk_fees'],
                            "hidden_junk_fees": contract1_junk_hidden_fees
                        },
                        "contract_2": {
                            "junk_fees_identified": contract2_data['junk_fees'],
                            "hidden_junk_fees": contract2_junk_hidden_fees
                        },
                        "recommendation": f"Contract {st.session_state['recommended_contract']} is fairer"
                    }
                    
                    st.download_button(
                        label="📥 Download Junk/Hidden Fees Report (JSON)",
                        data=json.dumps(results, indent=2),
                        file_name="contract_junk_fees_report.json",
                        mime="application/json"
                    )
                    
                else:
                    st.error("❌ Failed to analyze one or both contracts. Please check the errors above.")
            else:
                st.error("❌ Failed to extract text from one or both files")

# Display fairness scores if analysis is complete (persists across button clicks)
if 'analysis_complete' in st.session_state and st.session_state['analysis_complete']:
    if 'score1' in st.session_state and 'score2' in st.session_state:
        st.markdown("---")
        st.header("🎯 Current Fairness Scores")
        
        col1, col2 = st.columns(2)
        
        score1 = st.session_state['score1']
        score2 = st.session_state['score2']
        contract1_data = st.session_state['contract1_data']
        contract2_data = st.session_state['contract2_data']
        
        with col1:
            st.metric(
                label="Contract 1 - Overall Fairness",
                value=f"{score1['total_score']}/100",
                delta=f"{get_score_color(score1['total_score'])} {'Excellent' if score1['total_score'] >= 80 else 'Fair' if score1['total_score'] >= 60 else 'Poor'}"
            )
            st.write("**Score Breakdown:**")
            st.write(f"💰 Price Score: {score1['price_score']}/50")
            st.write(f"⚠️ Risk Score: {score1['risk_score']}/30")
            st.write(f"📋 Fee Score: {score1['fee_score']}/20")
            if contract1_data['junk_fees']:
                st.warning(f"⚠️ Identified Fees: {', '.join(contract1_data['junk_fees'])}")
        
        with col2:
            st.metric(
                label="Contract 2 - Overall Fairness",
                value=f"{score2['total_score']}/100",
                delta=f"{get_score_color(score2['total_score'])} {'Excellent' if score2['total_score'] >= 80 else 'Fair' if score2['total_score'] >= 60 else 'Poor'}"
            )
            st.write("**Score Breakdown:**")
            st.write(f"💰 Price Score: {score2['price_score']}/50")
            st.write(f"⚠️ Risk Score: {score2['risk_score']}/30")
            st.write(f"📋 Fee Score: {score2['fee_score']}/20")
            if contract2_data['junk_fees']:
                st.warning(f"⚠️ Identified Fees: {', '.join(contract2_data['junk_fees'])}")

# NEGOTIATION ASSISTANT SECTION
if 'analysis1' in st.session_state and 'analysis2' in st.session_state:
    st.markdown("---")
    st.header("📧 Negotiation Assistant")
    st.info("💡 Generate a professional counter-offer email based on your contract analysis")
    
    # Determine which contract to negotiate
    recommended = st.session_state.get('recommended_contract', 1)
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        contract_to_negotiate = st.radio(
            "Which contract would you like to negotiate?",
            options=[1, 2],
            format_func=lambda x: f"Contract {x} {'(Recommended - Better Score)' if x == recommended else '(Worse Score)'}",
            index=0 if recommended == 1 else 1
        )
    
    with col2:
        selected_score = st.session_state[f'score{contract_to_negotiate}']
        st.metric(
            "Fairness Score",
            f"{selected_score['total_score']}/100",
            delta=get_score_color(selected_score['total_score'])
        )
    
    # User information form
    st.subheader("📝 Your Information")
    
    col1, col2 = st.columns(2)
    
    with col1:
        user_name = st.text_input("Your Name", placeholder="John Doe")
        user_email = st.text_input("Your Email", placeholder="john.doe@email.com")
    
    with col2:
        user_phone = st.text_input("Your Phone", placeholder="+1 (555) 123-4567")
        dealer_name = st.text_input("Dealer/Company Name", placeholder="ABC Auto Dealers")
    
    contact_person = st.text_input("Sales Representative Name", placeholder="Jane Smith")
    
    # Additional negotiation preferences
    with st.expander("⚙️ Advanced Negotiation Options", expanded=False):
        negotiation_tone = st.select_slider(
            "Email Tone",
            options=["Very Firm", "Firm", "Balanced", "Friendly", "Very Friendly"],
            value="Balanced"
        )
        
        include_data = st.checkbox("Include specific market data in email", value=True)
        request_callback = st.checkbox("Request a phone call to discuss", value=True)
    
    # Generate email button
    if st.button("✍️ Generate Negotiation Email", type="primary", use_container_width=True):
        if not user_name or not dealer_name:
            st.error("⚠️ Please provide at least your name and the dealer/company name")
        else:
            user_info = {
                'name': user_name,
                'email': user_email if user_email else '[Your Email]',
                'phone': user_phone if user_phone else '[Your Phone]',
                'dealer': dealer_name,
                'contact': contact_person if contact_person else 'Sales Team'
            }
            
            selected_analysis = st.session_state[f'analysis{contract_to_negotiate}']
            selected_score = st.session_state[f'score{contract_to_negotiate}']
            selected_contract_data = st.session_state[f'contract{contract_to_negotiate}_data']
            
            email_content = generate_negotiation_email(
                selected_analysis,
                selected_score,
                selected_contract_data,
                st.session_state['market_benchmarks'],
                hf_token,
                model_name,
                user_info
            )
            
            if email_content:
                st.success("✅ Negotiation email generated successfully!")
                
                # Display the email
                st.subheader("📧 Generated Email")
                
                # Add timestamp and metadata to email for display only
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                email_with_metadata = f"""{'='*80}
CONTRACT NEGOTIATION EMAIL
Generated on: {timestamp}
Contract: Contract {contract_to_negotiate}
Fairness Score: {selected_score['total_score']}/100
{'='*80}

{email_content}

{'='*80}
ANALYSIS SUMMARY
{'='*80}
Monthly Payment: ${selected_contract_data['monthly_payment']:.2f} (Market Avg: ${st.session_state['market_benchmarks']['avg_payment']:.2f})
APR: {selected_contract_data['apr']:.1f}% (Market Avg: {st.session_state['market_benchmarks']['avg_apr']:.1f}%)
Identified Issues: {', '.join(selected_contract_data['junk_fees']) if selected_contract_data['junk_fees'] else 'None'}
{'='*80}
"""
                
                st.text_area(
                    "Email Content",
                    value=email_with_metadata,
                    height=400,
                    key="generated_email"
                )
                
                # CHANGE 2: Use Streamlit's code block with copy button for the email content
                st.markdown("### 📋 Copy Email Content")
                st.code(email_content, language=None)
                
                st.info("💡 **Next Steps:** Click the copy icon (top-right of the box above) to copy the email, then paste it into your email client and send it to your dealer!")

# Footer
st.markdown("---")
st.markdown("💡 **Tip:** Get your token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)")