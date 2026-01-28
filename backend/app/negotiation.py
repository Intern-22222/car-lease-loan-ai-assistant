"""
Negotiation Engine - Powered by HuggingFace AI
Handles intelligent car negotiation advice using HuggingFace Inference API with conversation history.
"""

import os
import logging
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize HuggingFace
try:
    from backend.services.huggingface_service import huggingface_service
    HF_AVAILABLE = True
    logger.info("✅ HuggingFace service initialized successfully")
except Exception as e:
    HF_AVAILABLE = False
    logger.warning(f"⚠️ HuggingFace service not available: {e}")


class NegotiationEngine:
    def __init__(self):
        self.hf_service = huggingface_service if HF_AVAILABLE else None
        self.chat_sessions = {}  # Store chat history per session
        
        if HF_AVAILABLE and self.hf_service:
            logger.info("✅ HuggingFace Negotiation Engine loaded")

    def generate_system_prompt(self, vehicle_details: Dict[str, Any], market_value: Dict[str, Any]) -> str:
        """Creates the system context for the AI based on the specific car and its value."""
        car_name = f"{vehicle_details.get('year')} {vehicle_details.get('make')} {vehicle_details.get('model')} {vehicle_details.get('trim', '')}"
        fair_price = market_value.get('price')
        currency = market_value.get('currency', 'USD')
        
        prompt = f"""You are an expert car negotiation assistant helping a buyer negotiate a better deal.

VEHICLE: {car_name}
FAIR MARKET VALUE: {currency} {fair_price:,.2f}

YOUR ROLE:
- Help the user get a deal at or below the fair market value
- Analyze dealer offers and identify overcharges
- Suggest counter-offers and negotiation tactics
- Explain lease terms (Money Factor, Residual Value, Capitalized Cost) when asked
- Be confident, professional, and encouraging

RULES:
- Keep responses concise (2-3 sentences max)
- Always reference the market data when discussing prices
- If the dealer's offer is higher than fair value, calculate the difference
- Suggest specific dollar amounts for counter-offers
- Warn about common dealer add-ons and fees
- Remember the conversation history and refer back to previous messages when relevant"""
        
        return prompt

    def _get_or_create_session(self, session_id: str) -> List[Dict]:
        """Get or create a chat session history."""
        if session_id not in self.chat_sessions:
            self.chat_sessions[session_id] = []
        return self.chat_sessions[session_id]

    def _build_conversation_prompt(self, system_prompt: str, history: List[Dict], user_message: str) -> str:
        """Build the full prompt including conversation history."""
        prompt = system_prompt + "\n\n"
        
        # Add conversation history
        for msg in history[-10:]:  # Keep last 10 messages for context
            role = "User" if msg["role"] == "user" else "Assistant"
            prompt += f"{role}: {msg['content']}\n\n"
        
        # Add current message
        prompt += f"User: {user_message}\n\nAssistant:"
        return prompt

    def get_response(self, user_message: str, context: Optional[Dict[str, Any]] = None, session_id: str = "default") -> str:
        """
        Generates an AI response to the user's message.
        Maintains conversation history per session.
        Works with or without vehicle context.
        """
        
        vehicle_details = context.get('vehicle_details', {}) if context else {}
        market_value = context.get('market_value', {}) if context else {}
        
        has_vehicle_context = bool(vehicle_details and market_value)

        # Get session history
        history = self._get_or_create_session(session_id)
        
        # Add user message to history
        history.append({"role": "user", "content": user_message})

        response_text = None

        # Try HuggingFace AI first
        if HF_AVAILABLE and self.hf_service:
            try:
                if has_vehicle_context:
                    system_prompt = self.generate_system_prompt(vehicle_details, market_value)
                else:
                    # General car assistant prompt (no specific vehicle)
                    system_prompt = """You are a helpful AI car buying and negotiation assistant.
                    
You can help users with:
- General car buying advice and tips
- Understanding lease vs loan options
- Explaining car pricing, fees, and negotiation tactics
- Answering questions about car features and specifications
- Providing guidance on what to look for in a deal

If the user wants specific pricing analysis or negotiation help for a particular vehicle,
suggest they enter a VIN to get accurate market data.

Be friendly, professional, and concise in your responses."""

                # Build prompt with conversation history
                full_prompt = self._build_conversation_prompt(system_prompt, history[:-1], user_message)
                
                response_text = self.hf_service.generate_text(full_prompt, max_tokens=300)
                
                if response_text:
                    logger.info("✅ HuggingFace response generated")
                    
            except Exception as e:
                logger.error(f"HuggingFace API error: {e}")
                # Fall through to fallback

        # Fallback: Rule-based responses
        if not response_text:
            if has_vehicle_context:
                response_text = self._fallback_response(user_message, vehicle_details, market_value)
            else:
                response_text = "Hello! I'm your car buying assistant. I can help with general car advice, or enter a VIN in the sidebar for specific pricing analysis."
        
        # Add assistant response to history
        history.append({"role": "assistant", "content": response_text})
        
        return response_text

    def get_chat_history(self, session_id: str = "default") -> List[Dict]:
        """Get the chat history for a session."""
        return self.chat_sessions.get(session_id, [])

    def clear_chat_history(self, session_id: str = "default"):
        """Clear the chat history for a session."""
        if session_id in self.chat_sessions:
            self.chat_sessions[session_id] = []
            logger.info(f"Chat history cleared for session: {session_id}")

    def _fallback_response(self, user_message: str, vehicle_details: Dict, market_value: Dict) -> str:
        """Fallback rule-based responses when AI is unavailable."""
        user_message_lower = user_message.lower()
        price = market_value.get('price', 0)
        
        if "offer" in user_message_lower or "price" in user_message_lower or "$" in user_message:
            return (
                f"Based on market data, the fair value is ${price:,.2f}. "
                "If they're asking more, mention you have pricing data and ask to see the invoice price."
            )
        
        if "lease" in user_message_lower:
            return (
                "For leasing, focus on the Money Factor (aim for 0.0015-0.0025) and Residual Value. "
                "Ask: 'What's the base money factor before any markup?'"
            )

        return (
            f"Good info. Your target is around ${price:,.2f}. "
            "Have they added any dealer accessories or protection packages you didn't request?"
        )

    def analyze_document_text(self, text: str, user_prompt: str = None) -> Dict[str, Any]:
        """
        Analyze extracted text from a document using HuggingFace AI.
        Identifies document type, extracted values, and negotiation insights.
        If user_prompt is provided, answers the user's specific question about the document.
        """
        if not HF_AVAILABLE or not self.hf_service:
            logger.warning("HuggingFace not available for document analysis")
            return {
                "success": False,
                "error": "AI service unavailable",
                "extracted_text": text
            }
            
        try:
            # Build prompt based on whether user has a specific question
            if user_prompt:
                prompt = f"""
You are a car negotiation expert. The user has uploaded a document and asked a question about it.

DOCUMENT TEXT (extracted via OCR):
{text[:4000]}

USER'S QUESTION:
{user_prompt}

INSTRUCTIONS:
1. First, provide a clear, concise OVERVIEW (2-3 sentences) of what this document is (e.g., "This is a Buyer's Order for a 2024 Honda Civic showing a total price of...").
2. Then, provide a specific ANSWER to the user's question based on the document content.
3. Be professional and highlight any red flags if relevant to the answer.

FORMAT YOUR RESPONSE AS:
**Document Overview:**
[Overview text here]

**Answer:**
[Specific answer here]
"""
            else:
                prompt = f"""
Analyze the following text extracted from a car dealer document (window sticker, quote, contract, invoice, etc.):

TEXT:
{text[:4000]}

YOUR TASK:
1. Identify the Document Type (e.g. Window Sticker, Buyer's Order, Lease Worksheet)
2. Extract Key Details: VIN, Year, Make, Model, Trim, Price (MSRP/Selling Price), Fees, Add-ons
3. Provide Negotiation Insights: Identify hidden fees, dealer markups (ADM), or non-negotiable items.

OUTPUT FORMAT (JSON):
{{
    "document_type": "string",
    "vehicle": {{
        "vin": "string (or null)",
        "year": "string (or null)",
        "make": "string (or null)",
        "model": "string (or null)",
        "trim": "string (or null)"
    }},
    "financials": {{
        "price": number (or null),
        "currency": "USD",
        "doc_fee": number (or null),
        "freight_fee": number (or null),
        "add_ons_total": number (or null)
    }},
    "insights": [
        "insight 1",
        "insight 2"
    ],
    "summary": "Brief summary of what this document represents."
}}
Return ONLY the valid JSON with no markdown formatting.
"""
            
            result = self.hf_service.analyze_with_prompt(prompt, text)
            
            if isinstance(result, dict):
                # If user asked a question, return the text response
                if user_prompt and "response" in result:
                    return {
                        "success": True,
                        "response": result["response"],
                        "is_conversation": True
                    }
                else:
                    # Parse JSON for auto-analysis
                    return {
                        "success": True,
                        "analysis": result,
                        "raw_text": text
                    }
            else:
                return {
                    "success": False,
                    "error": "Failed to parse AI response",
                    "raw_response": str(result)
                }
                    
        except Exception as e:
            logger.error(f"Document analysis error: {e}")
            return {"success": False, "error": str(e)}
