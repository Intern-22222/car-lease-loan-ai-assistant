from pydantic import BaseModel

# These models are used by main.py for data validation
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

def negotiation_chatbot(message: str) -> str:
    """
    Core logic for Milestone 3: Provide negotiation guidance to the user.
    """
    msg = message.lower()

    if "apr" in msg or "interest" in msg:
        return "Guidance: Ask the dealer for the 'Buy Rate.' Dealers often add a markup to the bank's interest rate."

    if "fees" in msg or "hidden" in msg:
        return "Guidance: Review the 'Acquisition Fee' and 'Doc Fee.' Ask which fees are state-mandated and which are dealer-added."

    if "price" in msg or "negotiate" in msg:
        return "Guidance: Negotiate the 'Gross Capitalized Cost' (selling price) first, before discussing monthly payments."

    return "I can help you negotiate APR, identify hidden fees, or check car pricing. What would you like to ask?"