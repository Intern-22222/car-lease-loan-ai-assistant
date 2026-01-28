from typing import Dict, Any
from backend.services.huggingface_service import huggingface_service


class RiskAnalyzer:
    """
    Identifies risks, unfair terms, and junk fees using Gemini
    """

    def analyze_risks(self, contract_text: str) -> Dict[str, Any]:
        # limit text to avoid token issues
        text = contract_text[:3000]

        prompt = """
You are a legal contract risk auditor for car loans and leases.

Analyze the contract text and return ONLY valid JSON
with the following structure:

{
  "risk_level": "LOW | MODERATE | HIGH | CRITICAL",
  "junk_fees": [
    {"name": "string", "reason": "string"}
  ],
  "unfair_terms": [
    {"term": "string", "explanation": "string"}
  ],
  "red_flags": [
    {"issue": "string", "severity": "LOW | MEDIUM | HIGH"}
  ],
  "recommendations": ["string"]
}

Rules:
- Use ONLY the given contract text
- If something is missing, do NOT guess
- Do not add explanations outside JSON
"""

        result = huggingface_service.analyze_with_prompt(prompt, text)

        # Safety: always return dict
        if not isinstance(result, dict):
            return {
                "risk_level": "MODERATE",
                "junk_fees": [],
                "unfair_terms": [],
                "red_flags": [],
                "recommendations": ["Review contract manually"]
            }

        # Ensure required keys exist
        result.setdefault("risk_level", "MODERATE")
        result.setdefault("junk_fees", [])
        result.setdefault("unfair_terms", [])
        result.setdefault("red_flags", [])
        result.setdefault("recommendations", [])

        return result


# Global instance
risk_analyzer = RiskAnalyzer()
