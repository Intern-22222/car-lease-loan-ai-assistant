from typing import Dict, Any, List

class FairnessScorer:
    def calculate_score(self, contract_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Fairness Score Algorithm (0–100)
        EXACTLY as per Milestone requirement
        """
        score = 100
        reasons: List[str] = []

        apr = self._safe_float(contract_data.get("interest_rate"), 0)
        monthly = self._safe_float(contract_data.get("monthly_payment"), 0)
        mileage = self._safe_float(contract_data.get("mileage_limit"), 0)
        fees = contract_data.get("hidden_fees", [])

        # 1️⃣ APR Penalty
        if apr > 10:
            score -= 25
            reasons.append(f"High APR detected: {apr}% (>10%)")

        # 2️⃣ Monthly Payment Penalty
        if monthly > 800:
            score -= 10
            reasons.append(f"High monthly payment: ${monthly}")

        # 3️⃣ Mileage Penalty (only if lease)
        if mileage and mileage < 12000:
            score -= 5
            reasons.append(f"Low mileage limit: {mileage} miles/year")

        # 4️⃣ Junk Fee Penalty
        junk_fees = [f for f in fees if f.get("is_junk", False)]
        if junk_fees:
            penalty = len(junk_fees) * 15
            score -= penalty
            reasons.append(f"{len(junk_fees)} junk fees found (−{penalty})")

        score = max(0, min(score, 100))
        category = self._get_category(score)

        return {
            "overall_score": score,
            "category": category,
            "reasons": reasons
        }

    def _safe_float(self, value, default=0.0) -> float:
        try:
            return float(value)
        except (TypeError, ValueError):
            return default

    def _get_category(self, score: float) -> str:
        if score >= 85:
            return "EXCELLENT"
        elif score >= 70:
            return "GOOD"
        elif score >= 55:
            return "FAIR"
        elif score >= 40:
            return "POOR"
        else:
            return "VERY_POOR"


# Global instance
fairness_scorer = FairnessScorer()
