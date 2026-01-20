
import json
import os
import google.generativeai as genai

# --- CONFIGURATION ---
USE_REAL_AI = True 
os.environ["GOOGLE_API_KEY"] = "AIzaSyBs2kRLJzlrDXSuM5-mcYPlA3tvPPtjTRI" # Paste your AIza... key

def configure_gemini():
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key: return None
    genai.configure(api_key=api_key)
    return True

# --- HELPER: MODEL SELECTOR ---
def get_model():
    """Tries to find a working Gemini model."""
    try:
        # Try the latest Flash model first
        return genai.GenerativeModel('gemini-2.5-flash')
    except:
        # Fallback to Pro if Flash isn't available
        return genai.GenerativeModel('gemini-pro')

# ==========================================
# TASK 2: EXTRACTION (For Main Dashboard)
# ==========================================
def extract_contract_data(ocr_text):
    """
    Extracts structured JSON fields for the Comparison Table.
    """
    if not USE_REAL_AI:
        return {
            "Interest Rate": "9.2%",
            "Monthly Payment": "$550",
            "Junk Fees": ["Nitrogen ($199)", "Doc Fee ($499)"],
            "Mileage Limit": "10,000 miles/yr",
            "Lease Term": "36 Months"
        }

    try:
        configure_gemini()
        model = get_model()
        
        prompt = f"""
        Extract the following fields from the contract text below into valid JSON:
        - "Interest Rate" (e.g. "4.5%")
        - "Monthly Payment" (e.g. "$400")
        - "Junk Fees" (Return a list of strings, e.g. ["Nitrogen Fee", "Doc Fee"])
        - "Mileage Limit"
        - "Lease Term"

        TEXT: "{ocr_text[:3000]}..."
        
        Output ONLY raw JSON. No markdown formatting.
        """
        
        response = model.generate_content(prompt)
        text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)

    except Exception as e:
        return {"Error": f"AI Extraction Failed: {str(e)}"}

# ==========================================
# TASK 3: NEGOTIATION (For Chatbot Page)
# ==========================================
def analyze_lease_contract(ocr_text):
    """
    Analyzes the contract specifically for negotiation leverage.
    """
    if not USE_REAL_AI:
        return {"summary": "Mock Analysis: High APR found.", "leverage_points": ["High APR", "Junk Fees"]}

    try:
        configure_gemini()
        model = get_model()

        prompt = f"""
        You are an expert Car Lease Negotiator. Analyze this contract text and return a JSON object with:
        1. "summary": A brief 2-sentence summary of the deal.
        2. "negotiation_targets": A list of specific bad terms (e.g., "Money Factor too high", "Hidden Doc Fee").
        3. "strategy": A recommended strategy (e.g., "Ask to remove capital cost reduction").

        TEXT: "{ocr_text[:4000]}..."
        
        Output JSON only.
        """
        response = model.generate_content(prompt)
        text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)
    except Exception as e:
        return {"error": str(e)}

def get_negotiation_response(history, contract_context):
    """
    Generates a counter-offer based on lease rules.
    """
    if not USE_REAL_AI: return "Mock response."

    try:
        configure_gemini()
        model = get_model()

        # Convert history for Gemini
        chat_context = "\n".join([f"{m['role']}: {m['content']}" for m in history])

        prompt = f"""
        You are a Car Lease Negotiation Assistant.
        
        CONTRACT CONTEXT:
        {json.dumps(contract_context)}

        CHAT HISTORY:
        {chat_context}

        YOUR TASK:
        Draft a short, professional, and firm response based on the history above.
        """
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error: {e}"

# Backwards compatibility alias (if needed)
get_negotiation_chat_response = get_negotiation_response
