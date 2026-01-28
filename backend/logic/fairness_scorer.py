from typing import Dict, Any, List

class FairnessScorer:
    """
    Fairness Score Calculation (0-100 scale)
    
    Components:
    - Price Score: 50 max points (market average comparison)
    - Risk Score: 30 max points (APR penalty)
    - Fee Score: 20 max points (junk fee penalty)
    
    HIGHER SCORE = BETTER CONTRACT
    """
    
    # Market average values for comparison
    MARKET_AVG_APR = 7.5  # Average market APR for reference
    MARKET_AVG_MONTHLY = 500  # Average monthly payment for reference
    
    def calculate_score(self, contract_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Fairness Score Algorithm (0-100)
        Based on user's formula:
        - Price Score: 50 max (calculated as Market Avg/Contract Price × 50)
        - Risk Score: 30 max (starts at 30, loses 5 points for every 1% APR above market average)
        - Fee Score: 20 max (starts at 20, loses 5 points for every junk fee found)
        """
        explanations: List[str] = []
        
        # Extract values safely
        apr = self._safe_float(contract_data.get("interest_rate_apr") or contract_data.get("interest_rate"), 0)
        monthly = self._safe_float(contract_data.get("monthly_payment"), 0)
        fees = contract_data.get("hidden_fees", [])
        
        # =========================================
        # 1. PRICE SCORE (50 max points)
        # Calculated as: (Market Avg / Contract Price) × 50
        # If your price is lower than market average, you get full 50 points
        # =========================================
        if monthly > 0:
            price_ratio = self.MARKET_AVG_MONTHLY / monthly
            price_score = min(50, price_ratio * 50)  # Cap at 50
            if price_ratio >= 1:
                explanations.append(f"Price Score: {price_score:.0f}/50 - Your payment (${monthly:.2f}) is at or below market average")
            else:
                explanations.append(f"Price Score: {price_score:.0f}/50 - Your payment (${monthly:.2f}) is above market average (${self.MARKET_AVG_MONTHLY})")
        else:
            price_score = 25  # Default to half if no monthly payment found
            explanations.append("Price Score: 25/50 - Monthly payment not found for comparison")
        
        # =========================================
        # 2. RISK SCORE (30 max points)
        # Starts at 30, loses 5 points for every 1% APR above market average
        # =========================================
        risk_score = 30
        if apr > 0:
            apr_excess = max(0, apr - self.MARKET_AVG_APR)
            apr_penalty = apr_excess * 5  # 5 points per 1% above average
            risk_score = max(0, 30 - apr_penalty)
            if apr_excess > 0:
                explanations.append(f"Risk Score: {risk_score:.0f}/30 - APR ({apr}%) is {apr_excess:.1f}% above market average ({self.MARKET_AVG_APR}%)")
            else:
                explanations.append(f"Risk Score: {risk_score:.0f}/30 - APR ({apr}%) is at or below market average")
        else:
            risk_score = 15  # Default to half if no APR found
            explanations.append("Risk Score: 15/30 - APR not found for analysis")
        
        # =========================================
        # 3. FEE SCORE (20 max points)
        # Starts at 20, loses 5 points for every junk fee found
        # =========================================
        fee_score = 20
        junk_fees = [f for f in fees if f.get("is_junk", False)]
        junk_fee_count = len(junk_fees)
        
        if junk_fee_count > 0:
            fee_penalty = junk_fee_count * 5  # 5 points per junk fee
            fee_score = max(0, 20 - fee_penalty)
            fee_names = [f.get("name", "Unknown") for f in junk_fees]
            explanations.append(f"Fee Score: {fee_score:.0f}/20 - Found {junk_fee_count} junk fee(s): {', '.join(fee_names)}")
        else:
            explanations.append(f"Fee Score: {fee_score}/20 - No junk fees detected")
        
        # =========================================
        # TOTAL SCORE (0-100)
        # =========================================
        total_score = price_score + risk_score + fee_score
        total_score = max(0, min(100, round(total_score)))  # Ensure 0-100 range
        
        category = self._get_category(total_score)
        ui_color = self._get_color(total_score)
        
        return {
            "overall_score": total_score,
            "category": category,
            "ui_color": ui_color,
            "breakdown": {
                "price_score": round(price_score),
                "risk_score": round(risk_score),
                "fee_score": round(fee_score)
            },
            "explanation": explanations,
            "note": "Higher score = Better contract (0-100 scale)"
        }

    def _safe_float(self, value, default=0.0) -> float:
        """Safely convert value to float"""
        if value is None:
            return default
        try:
            # Handle strings like "4.2%" or "$450.00"
            if isinstance(value, str):
                cleaned = value.replace('%', '').replace('$', '').replace(',', '').strip()
                return float(cleaned)
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
    
    def _get_color(self, score: float) -> str:
        if score >= 70:
            return "green"
        elif score >= 50:
            return "orange"
        else:
            return "red"


# Global instance
fairness_scorer = FairnessScorer()
