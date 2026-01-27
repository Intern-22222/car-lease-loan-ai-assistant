from typing import List

from . import schemas


def compute_fairness(
    risk_factors: List[schemas.RiskFactor],
    hidden_fees: List[schemas.HiddenFee],
    price_factors: schemas.PriceFactors,
) -> schemas.FairnessInfo:
    # Average severity (1–5); if none, treat as low risk
    if risk_factors:
        avg_severity = sum(r.severity for r in risk_factors) / len(risk_factors)
    else:
        avg_severity = 1.0

    hidden_fee_count = len(hidden_fees)

    total_hidden = sum(f.amount for f in hidden_fees if f.amount is not None)
    estimated_total = price_factors.estimated_total_cost or 0.0
    if estimated_total > 0:
        amount_ratio = total_hidden / estimated_total
    else:
        amount_ratio = 0.0

    # Convert to sub-scores 0–100 (higher is better)
    risk_score = max(0, 100 - avg_severity * 20)
    fee_score = max(0, 100 - hidden_fee_count * 15)

    #risk_score = max(0, 100 - avg_severity * 15)
    #fee_score = max(0, 100 - hidden_fee_count * 10)
    amount_score = max(0, 100 - min(amount_ratio * 200, 100))

    final_score = round(0.4 * risk_score + 0.3 * fee_score + 0.3 * amount_score)

    if final_score >= 75:
        rating = "Fair"
    elif final_score >= 50:
        rating = "Moderate"
    else:
        rating = "Unfair"

    explanation_parts = [
        f"Average risk severity: {avg_severity:.1f}",
        f"Hidden fee count: {hidden_fee_count}",
        f"Estimated hidden-fee ratio: {amount_ratio:.2f}",
    ]
    explanation = "; ".join(explanation_parts)

    return schemas.FairnessInfo(
        score=final_score,
        rating=rating,
        explanation=explanation,
    )
