"""
Negotiation Engine - Powered by Google Gemini AI
Handles intelligent car negotiation advice using real AI.
"""

import os
import logging
from typing import Dict, Any, Optional
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
        self.conversation_history = []
        self.model = None
        self.chat = None
        
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
- Warn about common dealer add-ons and fees"""
        
        return prompt

    def get_response(self, user_message: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Generates an AI response to the user's message."""
        
        if not context:
            return "I need vehicle information first. Please enter a VIN to analyze the car you're interested in."

        vehicle_details = context.get('vehicle_details', {})
        market_value = context.get('market_value', {})
        
        if not vehicle_details or not market_value:
            return "I'm missing vehicle data. Let's start by analyzing the VIN."

        # Try Gemini AI first
        if GEMINI_AVAILABLE and self.model:
            try:
                system_prompt = self.generate_system_prompt(vehicle_details, market_value)
                
                # Create a new chat with system context
                full_prompt = f"{system_prompt}\n\nUser: {user_message}\n\nAssistant:"
                
                response = self.model.generate_content(full_prompt)
                
                if response and response.text:
                    logger.info("✅ Gemini response generated")
                    return response.text.strip()
                    
            except Exception as e:
                logger.error(f"Gemini API error: {e}")
                # Fall through to fallback

        # Fallback: Rule-based responses
        return self._fallback_response(user_message, vehicle_details, market_value)

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
