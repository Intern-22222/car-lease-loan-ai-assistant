import os
import json
import google.generativeai as genai

from contract_loader import load_contract
from prompts import (
    EXPLAIN_CONTRACT_PROMPT,
    NEGOTIATION_GUIDANCE_PROMPT,
    DRAFT_NEGOTIATION_MESSAGE_PROMPT,
    USER_QUESTION_PROMPT
)

# Configure Gemini with environment variable
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))


def get_ai_response(user_intent: str, user_question: str = None) -> str:
    """
    Generate AI response based on user intent and optional user question.
    """

    contract_data = load_contract()
    contract_json = json.dumps(contract_data, indent=2)

    if user_intent == "explain":
        prompt = EXPLAIN_CONTRACT_PROMPT.format(contract_json=contract_json)

    elif user_intent == "negotiate":
        prompt = NEGOTIATION_GUIDANCE_PROMPT.format(contract_json=contract_json)

    elif user_intent == "draft":
        prompt = DRAFT_NEGOTIATION_MESSAGE_PROMPT.format(contract_json=contract_json)

    elif user_intent == "ask" and user_question:
        prompt = USER_QUESTION_PROMPT.format(
            user_question=user_question,
            contract_json=contract_json
        )

    else:
        return "Invalid request."

    try:
        model = genai.GenerativeModel(model_name="gemini-2.5-flash")
        response = model.generate_content(prompt)

        if not response or not response.text:
            return "No response generated."

        return response.text.strip()

    except Exception:
        return "AI service is currently unavailable."
