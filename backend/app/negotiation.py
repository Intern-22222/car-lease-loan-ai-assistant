"""
Negotiation Engine - Powered by Google Gemini AI
Handles intelligent car negotiation advice using real AI with conversation history.
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

# Initialize Gemini
try:
    import google.generativeai as genai
    
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        genai.configure(api_key=api_key)
        GEMINI_AVAILABLE = True
        logger.info("✅ Gemini AI initialized successfully")
    else:
        GEMINI_AVAILABLE = False
        logger.warning("⚠️ GEMINI_API_KEY not found in .env - using fallback mode")
except ImportError:
    GEMINI_AVAILABLE = False
    logger.warning("⚠️ google-generativeai not installed - using fallback mode")


class NegotiationEngine:
    def __init__(self):
        self.model = None
        self.chat_sessions = {}  # Store chat history per session
        
        if GEMINI_AVAILABLE:
            try:
                # gemini-2.5-flash has the best availability on free tier
                model_names = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-exp']
                for model_name in model_names:
                    try:
                        self.model = genai.GenerativeModel(model_name)
                        logger.info(f"✅ Gemini model loaded: {model_name}")
                        break
                    except Exception:
                        continue
            except Exception as e:
                logger.error(f"Failed to load Gemini model: {e}")

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
        """
        
        if not context:
            return "I need vehicle information first. Please enter a VIN to analyze the car you're interested in."

        vehicle_details = context.get('vehicle_details', {})
        market_value = context.get('market_value', {})
        
        if not vehicle_details or not market_value:
            return "I'm missing vehicle data. Let's start by analyzing the VIN."

        # Get session history
        history = self._get_or_create_session(session_id)
        
        # Add user message to history
        history.append({"role": "user", "content": user_message})

        response_text = None

        # Try Gemini AI first
        if GEMINI_AVAILABLE and self.model:
            try:
                system_prompt = self.generate_system_prompt(vehicle_details, market_value)
                
                # Build prompt with conversation history
                full_prompt = self._build_conversation_prompt(system_prompt, history[:-1], user_message)
                
                response = self.model.generate_content(full_prompt)
                
                if response and response.text:
                    response_text = response.text.strip()
                    logger.info("✅ Gemini response generated")
                    
            except Exception as e:
                logger.error(f"Gemini API error: {e}")
                # Fall through to fallback

        # Fallback: Rule-based responses
        if not response_text:
            response_text = self._fallback_response(user_message, vehicle_details, market_value)
        
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
        Analyze extracted text from a document using Gemini AI.
        Identifies document type, extracted values, and negotiation insights.
        If user_prompt is provided, answers the user's specific question about the document.
        """
        if not GEMINI_AVAILABLE or not self.model:
            logger.warning("Gemini not available for document analysis")
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
                
                Provide a helpful, concise answer to their question based on the document content.
                Focus on car pricing, fees, negotiation tactics, and any red flags you notice.
                Keep your response conversational and actionable.
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
            
            response = self.model.generate_content(prompt)
            
            if response and response.text:
                # If user asked a question, return the text response
                if user_prompt:
                    return {
                        "success": True,
                        "response": response.text.strip(),
                        "is_conversation": True
                    }
                else:
                    # Parse JSON for auto-analysis
                    import json
                    raw_json = response.text.strip().replace('```json', '').replace('```', '')
                    try:
                        analysis = json.loads(raw_json)
                        return {
                            "success": True,
                            "analysis": analysis,
                            "raw_text": text
                        }
                    except json.JSONDecodeError:
                        logger.error("Failed to parse JSON from AI response")
                        return {
                            "success": False, 
                            "error": "AI response parsing failed",
                            "raw_response": response.text
                        }
                    
        except Exception as e:
            logger.error(f"Document analysis error: {e}")
            return {"success": False, "error": str(e)}

