import base64
import json
import os  # FIXED: Added missing import
from openai import OpenAI
from app.core.config import get_settings

settings = get_settings()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.OPENROUTER_API_KEY,
)

def encode_pdf_to_base64(file_path: str):
    """
    Reads a PDF file and encodes it to a base64 string for API transmission.
    """
    # Added safety check to prevent crash if file_path is None or missing
    if not file_path or not os.path.exists(file_path):
        return None
    try:
        with open(file_path, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")
    except Exception as e:
        print(f"Error encoding PDF: {e}")
        return None

async def extract_contract_info(file_path: str):
    """
    Analyzes the contract PDF and extracts specific financial data points.
    Structured to capture Balloon payments, APR, and Principal amounts.
    """
    pdf_base64 = encode_pdf_to_base64(file_path)
    
    if not pdf_base64:
        raise ValueError("Could not process PDF file for extraction.")

    prompt = """
    Extract lease or loan details from this document. Return ONLY a valid JSON object.
    
    Target Schema:
    {
        "make": "string (The vehicle brand/manufacturer, e.g., BMW, Audi, Toyota)",
        "model": "string (The specific vehicle model, e.g., X3, A4, Camry)",
        "vin": "string (17-character VIN)",
        "monthly_payment": number (Look for 'Monthly Payment', 'EMI', or 'Installment'),
        "contract_term": number (Look for 'Term', 'Tenure', or 'Duration' in months),
        "total_deposit": number (Look for 'Down Payment', 'Customer Deposit', or 'Initial Payment'),
        "apr": number (Look for 'Interest Rate', 'APR', 'p.a.', or 'Fixed Rate'),
        "balloon_payment": number (Look for 'Balloon Payment', 'GFV', or 'Guaranteed Future Value'),
        "loan_amount": number (Look for 'Principal', 'Amount Financed', or 'Vehicle Price'),
        "late_payment_fee": "string (Extract the late fee policy or penal interest rate)"
    }

    Strict Rules:
    1. Do NOT include currency symbols ($, ₹) or commas in numeric values.
    2. If a value is not explicitly found, return null for that key.
    3. If 'Vehicle Price' is found but 'Principal' is missing, calculate: Principal = Vehicle Price - Down Payment.
    4. Ensure 'make' and 'model' are extracted accurately as they are used for the document title.
    """

    try:
        response = client.chat.completions.create(
            model=settings.AI_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:application/pdf;base64,{pdf_base64}"
                            }
                        }
                    ]
                }
            ],
            response_format={"type": "json_object"}
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"DEBUG: OpenRouter Extraction failed: {str(e)}")
        raise e

async def get_chat_response(query: str, file_path: str = None):
    # 1. Setup a "Designer" persona for the AI
    system_persona = (
        "You are a sophisticated Car Finance Expert. Your goal is to provide 'beautiful' "
        "and scannable responses using clean Markdown. 🚗\n\n"
        "WRITING STYLE:\n"
        "1. FOCUS: Answer only what is asked. Don't repeat the whole summary every time.\n"
        "2. LANGUAGE: Use simple, relatable analogies for finance terms (e.g., 'A Balloon Payment is like a final big hurdle at the end of a race').\n"
        "3. TONE: Warm, professional, and concise.\n\n"
        "FORMATTING BLUEPRINT (MANDATORY):\n"
        "- Use '##' for Section Headers (e.g., ## 📊 Financial Overview).\n"
        "- Use '---' to separate different topics visually.\n"
        "- Use **bold** for all currency values and percentages.\n"
        "- Use bullet points for any list of items.\n"
        "- Add a relevant emoji to every header to make it friendly.\n"
    )

    message_content = [
        {"type": "text", "text": f"{system_persona}\n\nUser Question: {query}"}
    ]

    # 2. ONLY attempt to attach the PDF if file_path is valid and file exists
    if file_path and os.path.exists(file_path):
        pdf_base64 = encode_pdf_to_base64(file_path)
        if pdf_base64:
            message_content.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:application/pdf;base64,{pdf_base64}"
                }
            })

    try:
        response = client.chat.completions.create(
            model=settings.AI_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": message_content
                }
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"DEBUG: OpenRouter Chat failed: {str(e)}")
        raise e