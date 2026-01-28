
import os
import requests
import json
import logging
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HuggingFaceService:
    def __init__(self):
        self.api_key = os.getenv("HF_TOKEN", "")
        self.model = os.getenv("HF_MODEL", "Qwen/Qwen2.5-7B-Instruct")
        # OpenAI-compatible endpoint on HuggingFace Router
        self.api_url = "https://router.huggingface.co/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        if not self.api_key:
            logger.warning("⚠️ HF_TOKEN not found in .env file")
        else:
            logger.info(f"✅ HuggingFace initialized with model: {self.model}")
    
    def _call_api(self, messages: list, max_tokens: int = 1000, temperature: float = 0.7) -> Optional[str]:
        """
        Make API call to HuggingFace Router (OpenAI-compatible).
        """
        if not self.api_key:
            logger.error("❌ HF_TOKEN not configured")
            return None
        
        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "top_p": 0.9
        }
        
        try:
            response = requests.post(
                self.api_url,
                headers=self.headers,
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                if "choices" in result and len(result["choices"]) > 0:
                    return result["choices"][0]["message"]["content"].strip()
                else:
                    logger.warning("⚠️ Unexpected response format from HuggingFace Router")
                    return None
            else:
                logger.error(f"❌ HuggingFace API error: {response.status_code} - {response.text}")
                return None
                
        except requests.exceptions.Timeout:
            logger.error("❌ HuggingFace API timeout")
            return None
        except Exception as e:
            logger.error(f"❌ HuggingFace API exception: {e}")
            return None
    
    def generate_text(self, prompt: str, max_tokens: int = 500) -> str:
        """Compatibility method for direct prompts"""
        messages = [{"role": "user", "content": prompt}]
        result = self._call_api(messages, max_tokens=max_tokens)
        return result if result else "Unable to generate response."
    
    def analyze_with_prompt(self, prompt: str, text: str, max_length: int = 4000) -> Dict[str, Any]:
        """Analyze text with a custom prompt (JSON-centric)"""
        system_msg = "You are a specialized contract analyzer. You must return only valid JSON."
        user_msg = f"{prompt}\n\nTEXT TO ANALYZE:\n{text[:max_length]}"
        
        messages = [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg}
        ]
        
        result = self._call_api(messages, max_tokens=1000, temperature=0.1)
        
        if result:
            try:
                # Extra cleaning for markdown/junk
                cleaned = result.replace("```json", "").replace("```", "").strip()
                # Find the first { and last }
                start = cleaned.find("{")
                end = cleaned.rfind("}") + 1
                if start != -1 and end > start:
                    cleaned = cleaned[start:end]
                return json.loads(cleaned)
            except Exception as e:
                logger.warning(f"⚠️ JSON parse failed: {e}. Raw: {result[:100]}")
                return {"raw_response": result}
        return {"error": "Failed to get response from AI"}

    def chat(self, message: str, context: str = "") -> str:
        """Conversational interface"""
        messages = []
        if context:
            messages.append({"role": "system", "content": f"Context: {context}"})
        messages.append({"role": "user", "content": message})
        
        result = self._call_api(messages, max_tokens=500)
        return result if result else "I'm sorry, I couldn't process your message."

huggingface_service = HuggingFaceService()
