import os
import json
from typing import Any, Dict

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from groq import Groq
from . import schemas

from groq import Groq, APIStatusError

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY is not set. Groq calls will fail when used.")

client = Groq(api_key=GROQ_API_KEY)

# Use Llama 3 8B; fast and good enough for this use case.
MODEL_NAME = "llama-3.1-8b-instant"



def analyze_contract_text(raw_text: str) -> Dict[str, Any]:
    """
    Call Groq Llama 3 to extract risk factors, price factors, hidden fees.
    If the contract is too large for the model, use only the first N characters.
    """
    system_prompt = """
You are an expert assistant analyzing car lease or loan contracts for consumer fairness.

You MUST output ONLY a single valid JSON object with this EXACT structure:

{
  "file_id": "",
  "risk_factors": [
    {
      "name": "Early termination penalty",
      "severity": 4,
      "description": "Why this clause is risky for the consumer"
    }
  ],
  "price_factors": {
    "base_price": 0,
    "total_monthly_payment": 0,
    "total_due_at_signing": 0,
    "estimated_total_cost": 0,
    "currency": "USD"
  },
  "hidden_fees": [
    {
      "fee_name": "Documentation fee",
      "amount": 500,
      "currency": "USD",
      "frequency": "one-time",
      "clause_excerpt": "short excerpt mentioning the fee"
    }
  ],
  "fairness": {
    "score": 0,
    "rating": "Moderate",
    "explanation": "Short explanation of fairness; numeric score will be overridden by backend logic."
  }
}

Rules:
- severity is an integer from 1 (low risk) to 5 (very high risk).
- Hidden or junk fees include any add-on, unclear, or not-obvious fees.
- If a numeric value is not explicitly present, set it to 0.
- Do NOT include any extra keys or commentary outside the JSON.
"""

    # Simple truncation to avoid 413 errors for very long contracts
    MAX_CHARS = 8000  # adjust if needed
    truncated_text = raw_text[:MAX_CHARS]

    def _call_llm(text: str) -> str:
        user_prompt = f"""
Here is the contract text to analyze (may be truncated if the original is very long):

\"\"\"{text}\"\"\"
"""
        chat_completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt.strip()},
                {"role": "user", "content": user_prompt.strip()},
            ],
            temperature=0.2,
            max_tokens=2048,
        )
        return chat_completion.choices[0].message.content.strip()

    try:
        text = _call_llm(raw_text)
    except APIStatusError as e:
        # If request is too large, retry with truncated text
        if e.status_code == 413 or "Request too large" in str(e):
            text = _call_llm(truncated_text)
        else:
            raise

    # Strip code fences if present
    if text.startswith("```"):
        text = text.strip("`")
        lines = text.splitlines()
        if lines and lines.lower().startswith("json"):
            text = "\n".join(lines[1:])

    import json
    data = json.loads(text)
    return data

def generate_chat_reply(
    analysis: schemas.ContractAnalysisPayload,
    request: schemas.ChatRequest,
) -> Dict[str, str]:
    """
    Use Groq Llama 3 to generate chat or counter-offer email using existing analysis.
    Returns dict with keys: assistant_message, counter_email_draft (optional).
    """
    analysis_summary = f"""
Fairness score: {analysis.fairness.score} ({analysis.fairness.rating}).
Explanation: {analysis.fairness.explanation}

Number of risk factors: {len(analysis.risk_factors)}.
Number of hidden fees: {len(analysis.hidden_fees)}.
"""

    history_text = ""
    if request.history:
        for msg in request.history:
            prefix = "User" if msg.role == "user" else "Assistant"
            history_text += f"{prefix}: {msg.content}\n"

    mode_instruction = ""
    if request.intent == "email":
        mode_instruction = """
The user wants you to generate a polite but firm negotiation email to the dealer.
Focus on asking to remove or reduce specific hidden or unfair fees, or to improve key terms.
"""

    system_prompt = """
You are a negotiation assistant helping a consumer negotiate a car lease/loan.
Use the provided analysis and fairness score to answer questions and suggest negotiation points.

Rules:

1) Normal chat (intent = "chat"):
   - Respond as a helpful assistant in plain text.
   - You MUST return JSON with this exact shape:
     {
       "assistant_message": "Your reply to the user.",
       "counter_email_draft": null
     }

2) Email generation (intent = "email" OR user clearly asks for an email / counter-offer):
   - Write a professional email the user can send to the dealer.
   - Email MUST include:
       - A clear subject line starting with "Subject: ..."
       - A greeting (e.g., "Dear [Dealer Name],")
       - One or more short paragraphs referencing the unfair clauses / hidden fees.
       - A polite but firm request to revise the offer.
       - A closing and sign-off (e.g., "Sincerely," or "Best regards,").
   - You MUST return JSON with this exact shape:
     {
       "assistant_message": "Short explanation of what you recommend.",
       "counter_email_draft": "Full email text including Subject, greeting, body, and regards."
     }

3) Output format:
   - ALWAYS return a single valid JSON object.
   - Do NOT include markdown, bullet points, or any text outside the JSON.
"""

    user_prompt = f"""
Contract analysis summary:
{analysis_summary}

Conversation so far:
{history_text}

User's latest message:
{request.message}

Intent: {request.intent}
{mode_instruction}
"""

    chat_completion = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": system_prompt.strip()},
            {"role": "user", "content": user_prompt.strip()},
        ],
        temperature=0.5,
        max_tokens=1536,
    )

    text = chat_completion.choices[0].message.content.strip()

    # Strip possible ```json fences
    if text.startswith("```"):
        text = text.strip("`")
        lines = text.splitlines()
        if lines and lines[0].lower().startswith("json"):
            text = "\n".join(lines[1:])

    import json
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        # Fallback: wrap raw text so API never crashes
        data = {
            "assistant_message": text,
            "counter_email_draft": None,
        }

    assistant_message = data.get("assistant_message", "")
    counter_email_draft = data.get("counter_email_draft")

    return {
        "assistant_message": assistant_message,
        "counter_email_draft": counter_email_draft,
    }
