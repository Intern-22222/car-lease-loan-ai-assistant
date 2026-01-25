import google.generativeai as genai
from backend.config import settings
import json
from typing import Dict, Any, Optional
import re


class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
        print(f"✅ Gemini initialized with: {settings.GEMINI_MODEL}")

    def analyze_with_prompt(self, prompt: str, context: str) -> Optional[Dict[str, Any]]:
        """
        Used for contract analysis & extraction (JSON expected)
        """
        try:
            full_prompt = f"{prompt}\n\nCONTRACT TEXT:\n{context}"

            response = self.model.generate_content(
                full_prompt,
                generation_config={
                    "temperature": 0.1,
                    "top_p": 0.9,
                    "max_output_tokens": 4096,  # ✅ Increased from 2048
                }
            )

            if not response or not response.text:
                print("⚠️ No response from Gemini")
                return None

            text = response.text.strip()
            print(f"Gemini Response: {text[:200]}...")

            # ✅ IMPROVED: Better JSON extraction
            # Remove markdown code blocks
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()

            # Find JSON object
            if "{" in text and "}" in text:
                # Find the outermost JSON object
                start = text.find("{")
                
                # Count braces to find matching closing brace
                brace_count = 0
                end = start
                for i in range(start, len(text)):
                    if text[i] == "{":
                        brace_count += 1
                    elif text[i] == "}":
                        brace_count -= 1
                        if brace_count == 0:
                            end = i + 1
                            break
                
                json_str = text[start:end]
                
                # ✅ Clean up common JSON issues
                json_str = json_str.replace('\n', ' ')  # Remove newlines
                json_str = re.sub(r',\s*}', '}', json_str)  # Remove trailing commas
                json_str = re.sub(r',\s*]', ']', json_str)  # Remove trailing commas in arrays
                
                try:
                    return json.loads(json_str)
                except json.JSONDecodeError as je:
                    print(f"❌ JSON Parse Error: {je}")
                    print(f"Attempted to parse: {json_str[:500]}...")
                    # Return raw response if JSON parsing fails
                    return {"raw_response": text, "parse_error": str(je)}

            return {"raw_response": text}

        except Exception as e:
            print(f"❌ Gemini analyze error: {e}")
            return {
                "error": str(e),
                "message": "Unable to analyze at this time. Please try again later."
            }

    def generate_text(self, prompt: str) -> str:
        """
        Used for negotiation chat & advice (plain text)
        """
        try:
            response = self.model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.4,
                    "top_p": 0.8,
                    "max_output_tokens": 500,  # ✅ Increased from 300
                }
            )

            if not response or not response.text:
                print("⚠️ No text response from Gemini")
                return "Unable to generate response. Please try again."

            print(f"Gemini chat response: {response.text[:100]}...")
            return response.text.strip()

        except Exception as e:
            print(f"❌ Gemini generate error: {e}")
            return f"Service temporarily unavailable: {str(e)}"

    def chat(self, message: str, context: str = "") -> str:
        """
        Chat-style helper for negotiation assistant
        """
        final_prompt = f"{context}\n\nUser: {message}" if context else message
        return self.generate_text(final_prompt)


# Global instance
gemini_service = GeminiService()
