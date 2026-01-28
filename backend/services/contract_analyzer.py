from backend.services.huggingface_service import huggingface_service
from typing import Dict, Any, Optional
import json
import os

class ContractAnalyzer:
    def __init__(self):
        self.hf = huggingface_service

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
        """Analyze contract text using AI - extract ALL key lease/loan terms"""
        # Use more text for comprehensive extraction
        limited_text = contract_text[:4000]

        # Comprehensive prompt for all contract fields
        prompt = """You are a contract analysis expert. Extract ALL key terms from this car lease or loan contract.

Return ONLY valid JSON with this EXACT structure (use null for missing values):

{
  "contract_type": "LEASE or LOAN",
  "interest_rate_apr": "exact APR percentage as string, e.g. '4.2%'",
  "money_factor": "lease money factor if applicable, e.g. '0.00175'",
  "lease_term_months": "number of months, e.g. 36",
  "monthly_payment": "dollar amount, e.g. 450.00",
  "down_payment": "dollar amount, e.g. 2500.00",
  "residual_value": "dollar amount and percentage, e.g. '$18,000 (60% of MSRP)'",
  "mileage_allowance": "annual or total miles allowed, e.g. '12,000 miles/year'",
  "mileage_overage_charge": "cost per excess mile, e.g. '$0.20/mile'",
  "early_termination_clause": "describe the penalty/terms",
  "purchase_option": "buyout price or terms, e.g. '$18,350 (Residual + $350 fee)'",
  "maintenance_responsibility": "who is responsible for maintenance",
  "warranty_coverage": "warranty details",
  "insurance_requirements": "insurance requirements",
  "late_payment_penalty": "late fee details, e.g. '5% of monthly payment if 10 days past due'",
  "total_cost": "total amount to be paid over lease/loan term",
  "vehicle_info": {
    "year": "vehicle year",
    "make": "vehicle make",
    "model": "vehicle model",
    "vin": "VIN if available"
  },
  "hidden_fees": [
    {"name": "fee name", "amount": "amount", "is_junk": true or false}
  ],
  "summary": "one sentence summary of the contract"
}

Extract values EXACTLY as they appear in the document. Return JSON only."""

        result = self.hf.analyze_with_prompt(prompt, limited_text)

        # Default structure with all fields
        default_result = {
            "contract_type": None,
            "interest_rate_apr": None,
            "money_factor": None,
            "lease_term_months": None,
            "monthly_payment": None,
            "down_payment": None,
            "residual_value": None,
            "mileage_allowance": None,
            "mileage_overage_charge": None,
            "early_termination_clause": None,
            "purchase_option": None,
            "maintenance_responsibility": None,
            "warranty_coverage": None,
            "insurance_requirements": None,
            "late_payment_penalty": None,
            "total_cost": None,
            "vehicle_info": {
                "vin": None,
                "make": None,
                "model": None,
                "year": None
            },
            "hidden_fees": [],
            "summary": "Unable to analyze contract text"
        }

        # Ensure always dictionary output
        if not isinstance(result, dict):
            return default_result
        
        # If result has 'error', return default with error
        if 'error' in result:
            default_result['error'] = result['error']
            return default_result
        
        # Merge result with defaults to ensure all fields exist
        for key in default_result:
            if key not in result:
                result[key] = default_result[key]
        
        # Ensure vehicle_info exists
        if 'vehicle_info' not in result or not isinstance(result['vehicle_info'], dict):
            result['vehicle_info'] = default_result['vehicle_info']

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
  "junk_fees": ["list of junk fees found"],
  "unfair_terms": ["list of unfair terms"],
  "recommendations": ["list of recommendations"]
}
"""

        result = self.hf.analyze_with_prompt(prompt, limited_text)

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
