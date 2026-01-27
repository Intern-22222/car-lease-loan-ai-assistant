from backend.services.gemini_service import gemini_service
from typing import Dict, Any, Optional
import json
import os

class ContractAnalyzer:
    def __init__(self):
        self.gemini = gemini_service

    def load_prompt(self, prompt_file: str) -> str:
        """Load prompt from JSON file safely"""
        try:
            base_dir = os.path.dirname(__file__)
            prompt_path = os.path.join(base_dir, "..", "prompts", prompt_file)

            with open(prompt_path, "r", encoding="utf-8") as f:
                prompt_data = json.load(f)
                return prompt_data.get("prompt", "")
        except Exception:
            return ""

    def analyze_contract(self, contract_text: str) -> Dict[str, Any]:
        """Analyze contract text using Gemini"""
        # Increased limit for better extraction
        limited_text = contract_text[:3000]

        prompt = self.load_prompt("contract_analysis.json")

        if not prompt:
            prompt = """Analyze this car loan or lease contract and return ONLY valid JSON.

Expected JSON structure:
{
  "contract_type": "LOAN or LEASE",
  "monthly_payment": number,
  "interest_rate": number,
  "loan_term_months": number,
  "down_payment": number,
  "total_amount": number,
  "hidden_fees": [
    {"name": "string", "amount": number, "is_junk": true/false}
  ],
  "penalties": {
    "late_payment": "string",
    "early_termination": "string",
    "prepayment": "string"
  },
  "red_flags": ["list"],
  "summary": "brief summary"
}

Use null for missing values. Return JSON only.
"""

        result = self.gemini.analyze_with_prompt(prompt, limited_text)

        # Ensure always dictionary output
        if not isinstance(result, dict):
            return {
                "contract_type": None,
                "monthly_payment": None,
                "interest_rate": None,
                "loan_term_months": None,
                "down_payment": None,
                "total_amount": None,
                "hidden_fees": [],
                "penalties": {},
                "red_flags": [],
                "summary": "Unable to analyze contract text"
            }

        return result

    def identify_risks(self, contract_text: str) -> Dict[str, Any]:
        """Identify risks and unfair terms"""
        limited_text = contract_text[:3000]

        prompt = """Identify risks in this car loan or lease contract.
Return ONLY valid JSON in this structure:

{
  "risk_level": "LOW | MODERATE | HIGH | CRITICAL",
  "red_flags": [
    {"issue": "string", "severity": "LOW | MEDIUM | HIGH", "explanation": "string"}
  ],
  "junk_fees": ["list"],
  "unfair_terms": ["list"],
  "recommendations": ["list"]
}
"""

        result = self.gemini.analyze_with_prompt(prompt, limited_text)

        if not isinstance(result, dict):
            return {
                "risk_level": "MODERATE",
                "red_flags": [],
                "junk_fees": [],
                "unfair_terms": [],
                "recommendations": ["Review contract carefully"]
            }

        return result


# Global instance
contract_analyzer = ContractAnalyzer()
