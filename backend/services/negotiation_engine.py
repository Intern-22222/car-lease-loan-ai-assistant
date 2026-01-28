from backend.services.huggingface_service import huggingface_service
from typing import Dict, Any, List

class NegotiationEngine:
    def __init__(self):
        self.hf = huggingface_service
        self.pdf_text = ""
        self.contract_data = {}

    def _safe_float(self, v, default=0.0) -> float:
        """Safely convert any value to float, handling $, %, commas"""
        if v is None:
            return default
        try:
            if isinstance(v, str):
                cleaned = v.replace('%', '').replace('$', '').replace(',', '').strip()
                return float(cleaned) if cleaned else default
            return float(v)
        except (TypeError, ValueError):
            return default
    
    def _sum_fees(self, fees: list) -> float:
        """Safely sum fee amounts"""
        total = 0.0
        for f in fees:
            amt = f.get('amount', 0)
            total += self._safe_float(amt, 0.0)
        return total

    def set_context(self, pdf_text: str, contract_data: Dict[str, Any]):
        self.pdf_text = pdf_text
        self.contract_data = contract_data

    def chat_negotiate(self, user_message: str, contract_context: Dict[str, Any]) -> str:
        def safe_float(v):
            return self._safe_float(v, 0.0)

        monthly = safe_float(contract_context.get('monthly_payment', 0))
        rate = safe_float(contract_context.get('interest_rate_apr') or contract_context.get('interest_rate', 0))
        term = safe_float(contract_context.get('lease_term_months') or contract_context.get('loan_term_months', 0))
        total_amount = safe_float(contract_context.get('total_amount', 0))
        score = safe_float(contract_context.get('fairness_score', {}).get('overall_score', 0))
        fees = contract_context.get('hidden_fees', [])
        contract_type = contract_context.get('contract_type', 'LOAN')

        q_lower = user_message.lower()

        # ---------- SPECIFIC CALCULATIONS ----------
        
        # Total interest calculation
        if any(phrase in q_lower for phrase in ['how much interest', 'total interest', 'interest will i pay', 'interest cost']):
            if monthly and term and total_amount:
                total_paid = monthly * term
                principal = total_amount / (1 + (rate/100) * (term/12))
                total_interest = total_paid - principal
                
                return f"""**Total Interest Over Loan Term:**
- Monthly Payment: ${monthly:,.2f}
- Term: {term} months
- Total Paid: ${total_paid:,.2f}
- Estimated Principal: ${principal:,.2f}
- **Total Interest: ${total_interest:,.2f}**

This is approximately {(total_interest/principal)*100:.1f}% of your principal amount."""
            elif monthly and term:
                total_paid = monthly * term
                return f"Total payments over {term} months: ${total_paid:,.2f}. Unable to calculate exact interest without principal amount."

        # ---------- NEGOTIATION ADVICE QUESTIONS ----------
        
        if any(phrase in q_lower for phrase in ['how to negotiate', 'negotiation advice', 'help me negotiate', 'negotiation tips', 'how do i negotiate']):
            market_apr = 7.5
            target_apr = max(6.5, rate - 2.0)
            junk_fees = [f for f in fees if f.get('is_junk')]
            total_junk = self._sum_fees(junk_fees)
            savings = ((rate - target_apr)/100 * total_amount * term/12)
            
            advice = f"""Okay, let's talk strategy. Your current deal has a {rate}% APR, which is honestly pretty high compared to the market average of around {market_apr}%. Here's how I'd approach this:

**First, tackle that interest rate.** Walk in there confident and say something like: "I've been shopping around, and I'm seeing rates closer to {target_apr}% for my credit profile. What can you do to match that?" Don't ask if they *can* lower it—assume they can and make them work for your business. If you can get them down to {target_apr}%, you're looking at saving around ${savings:,.2f} over the life of the loan. That's real money.

**Next, let's talk about fees.** """

            if junk_fees:
                advice += f"I see about ${total_junk:,.2f} in fees that honestly shouldn't be there. Things like "
                fee_names = [f['name'] for f in junk_fees[:2]]
                advice += ", ".join(fee_names)
                advice += f"—those are negotiable, and dealers add them because most people don't push back. Just calmly say: 'I'm not comfortable with these add-on fees. Can we remove them?' Most of the time, they'll fold."
            else:
                advice += "The good news is I don't see obvious junk fees here, so that's one less fight."

            advice += f"""

**Here's the secret weapon: be ready to walk.** Seriously. Before you even sit down, get a quote from a local credit union or another dealer. Then you can say: "I've got another offer at {target_apr}% with lower fees. I'd prefer to work with you, but I need you to match or beat it." Dealers hate losing a deal, especially at the end of the month when they're trying to hit quotas.

**One more thing:** Stay calm. Don't get emotional or defensive. Treat it like you're negotiating a business deal, because you are. If they won't budge on the rate, ask for other concessions—extended warranty at cost, free maintenance, whatever. Everything's negotiable.

Bottom line: You should be aiming for around {target_apr}% APR, a monthly payment closer to ${(monthly * (target_apr / rate)):,.2f}, and definitely get rid of any unnecessary fees. Don't settle for this current offer—it's costing you too much.

Want me to write you a specific script you can actually use when you talk to them?"""
            return advice

        # ---------- CONTRACT BASED ANSWERS ----------
        
        is_contract_question = any(word in q_lower for word in [
            'interest', 'rate', 'apr', 'monthly', 'payment', 'emi',
            'fee', 'fees', 'charge', 'contract', 'deal', 'loan', 'lease'
        ])

        if is_contract_question:
            # APR specific questions
            if any(word in q_lower for word in ['what is', 'tell me', 'show']) and any(word in q_lower for word in ['interest', 'rate', 'apr']) and rate:
                market_avg = 7.5
                diff = rate - market_avg

                if diff > 1:
                    advice = f"Your {rate}% APR is well above market average. Aim for 7–7.5%."
                elif diff > 0:
                    advice = f"Your APR is slightly high. Try negotiating down by 0.5–1%."
                else:
                    advice = "Your APR is competitive."

                return f"APR in your contract is **{rate}%** for {term} months.\n\n{advice}"

            # Monthly payment questions
            if any(word in q_lower for word in ['monthly', 'payment', 'emi']) and monthly:
                return f"Your monthly payment is **${monthly:,.2f}** for {term} months. Total to be paid: ${monthly * term:,.2f}. Reducing interest rate is the best way to lower it."

            # Fee questions
            if any(word in q_lower for word in ['fee', 'fees', 'charge', 'remove', 'negotiate fee']):
                junk_fees = [f for f in fees if f.get('is_junk')]
                if junk_fees:
                    lines = "\n".join([f"- {f['name']} (${f.get('amount',0):,.2f})" for f in junk_fees])
                    return f"**Negotiable junk fees found:**\n{lines}\n\nAsk dealer to remove these optional fees."
                return "No obvious junk fees detected in your contract."

            # Fairness score questions
            if any(word in q_lower for word in ['score', 'fair', 'good', 'bad', 'rating']):
                return f"**Fairness Score: {score}/100**\n\nLower scores indicate room for negotiation. Scores below 60 suggest unfavorable terms."

        # ---------- GENERAL QUESTIONS → GEMINI ----------
        prompt = f"""You are a car loan and lease negotiation expert.

**Contract Summary:**
- Contract Type: {contract_type}
- Monthly Payment: ${monthly:,.2f}
- APR: {rate}%
- Term: {term} months
- Total Amount: ${total_amount:,.2f}
- Fairness Score: {score}/100

**User Question:**
{user_message}

Provide a clear, specific answer based on the contract details above. If calculating costs, show your math. If asked about negotiation, provide step-by-step tactics with specific numbers and phrases to use. Keep your response under 150 words but be thorough.
"""
        try:
            response = self.hf.generate_text(prompt)
            if response and len(response.strip()) > 20:
                return response
        except Exception as e:
            print(f"HuggingFace error in chat: {e}")

        return "I can help you analyze your contract or give negotiation advice. Try asking about interest rate, fees, total cost, or fairness score."

    def generate_negotiation_script(self, contract_data: Dict[str, Any], fairness_score: Dict[str, Any]) -> str:
        """Generate a professional, personalized counter-offer email"""
        def safe_float(v):
            return self._safe_float(v, 0.0)

        monthly = safe_float(contract_data.get('monthly_payment', 0))
        rate = safe_float(contract_data.get('interest_rate_apr') or contract_data.get('interest_rate', 0))
        term = safe_float(contract_data.get('lease_term_months') or contract_data.get('loan_term_months', 0))
        total = safe_float(contract_data.get('total_amount', 0))
        fees = contract_data.get('hidden_fees', [])
        vehicle = contract_data.get('vehicle_info', {})
        score = safe_float(fairness_score.get('overall_score', 0))
        
        # Calculate better terms
        target_rate = max(6.5, rate - 1.5)
        target_monthly = monthly * (target_rate / rate) if rate else monthly
        junk_fees = [f for f in fees if f.get('is_junk')]
        total_junk = self._sum_fees(junk_fees)
        
        # Estimated savings
        current_total_paid = monthly * term
        improved_total_paid = target_monthly * term
        savings = current_total_paid - improved_total_paid
        
        script = f"""Subject: Counter-Offer on Vehicle Financing - Request for Revised Terms

Dear [Dealer/Finance Manager Name],

Thank you for providing the financing offer for the vehicle purchase. I've carefully reviewed the terms, and while I'm very interested in moving forward, I'd like to discuss some adjustments to ensure the deal works for both of us.

**Current Offer Summary:**
• Vehicle: {vehicle.get('make', 'Vehicle')} {vehicle.get('model', '')}
• APR: {rate}%
• Monthly Payment: ${monthly:,.2f}
• Loan Term: {term} months
• Total Amount Financed: ${total:,.2f}

After researching current market rates and comparing similar financing offers, I've identified a few areas where I believe we can reach more competitive terms:

**1. Interest Rate Adjustment**
The current APR of {rate}% is above the market average of 7-7.5% for qualified buyers. I've received competing offers in the {target_rate}% range from other lenders, including local credit unions. I would like to request an APR adjustment to {target_rate}%, which would bring the monthly payment to approximately ${target_monthly:,.2f}.

This adjustment would save me approximately ${savings:,.2f} over the loan term and demonstrates a more market-aligned rate.
"""

        if junk_fees:
            script += f"""
**2. Fee Review and Removal**
I noticed the following fees totaling ${total_junk:,.2f} that appear to be optional add-ons:
"""
            for fee in junk_fees[:3]:
                fee_amt = self._safe_float(fee.get('amount', 0))
                script += f"• {fee.get('name', 'Fee')}: ${fee_amt:,.2f}\n"
            
            script += """
I respectfully request the removal of these fees, as they are not standard charges and significantly increase the total cost. Most competing offers do not include these additional fees.
"""

        script += f"""
**Why This Makes Sense:**
• I'm a qualified buyer ready to close immediately upon agreement
• The revised terms align with current market standards
• I have alternative financing options available but prefer to work with you
• Accepting these terms means securing a sale today rather than risking the deal

**My Proposed Counter-Offer:**
• APR: {target_rate}%
• Monthly Payment: ${target_monthly:,.2f}
• Loan Term: {term} months
• Remove optional fees: ${total_junk:,.2f}
• **Total Savings to Me: ${savings + total_junk:,.2f}**

I'm prepared to move forward immediately if we can agree on these revised terms. I understand that some flexibility may be required on both sides, and I'm open to discussing a middle ground that works for everyone.

Please let me know if you can accommodate these adjustments. I'm available to discuss this further at your earliest convenience and would like to finalize this by [date - typically 3-5 days from now].

I appreciate your time and consideration, and I look forward to working together on this.

Best regards,
[Your Name]
[Your Phone Number]
[Your Email]

---
P.S. I'm comparing several offers and would like to make a decision soon. A competitive response would be greatly appreciated.
"""
        
        return script

    def generate_counter_offer(self, contract_data: Dict[str, Any], target_improvements: List[str]) -> Dict[str, Any]:
        monthly = contract_data.get('monthly_payment', 0)
        rate = contract_data.get('interest_rate', 0)
        term = contract_data.get('loan_term_months', 60)

        improved_rate = max(rate - 1.5, 6.5)
        improved_monthly = monthly * (improved_rate / rate) if rate else monthly

        return {
            "interest_rate": round(improved_rate, 2),
            "monthly_payment": round(improved_monthly, 2),
            "term": term,
            "message": "Counter-offer based on market-aligned terms"
        }

# Global instance
negotiation_engine = NegotiationEngine()