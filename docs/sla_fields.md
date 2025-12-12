Service level agreement fields-> The standardized key terms extracted from car lease/loan contracts.

# SLA Field Dictionary (Canonical Definitions)

This document defines all standardized fields extracted from car lease and loan agreements. Each field includes a description, data type, normalization rules, examples, extraction notes, and confidence heuristics.

---

## Field: `interest_rate`

**Description:** Annual percentage rate (APR) or nominal interest rate, expressed as a percentage.
**Type (normalized):** `number` (float) — units: percent.
**Normalization:** Strip `%` and convert to float (e.g., `7.5%` → `7.5`).
**Examples:** `7.5`, `6.99`, `3.25`
**Common patterns:** `APR: 7.5%`, `interest rate 7.5% p.a.`, `7.5 percent per annum`
**Extraction Notes:** Prefer explicit APR over nominal rate. If only monthly rate is given, multiply by 12 and record conversion in `docs/manual_extraction.md`.
**Confidence Heuristic:** High when numeric + `%` appear together; medium when near “APR”; low if inferred from monthly rate.
**Speak-to-Mentor Summary:** “Interest rate is stored as a float without the % symbol.”

---

## Field: `lease_term_months`

**Description:** Total contract duration normalized to months.
**Type (normalized):** `integer`
**Normalization:** Convert years to months (e.g., `3 years` → `36`).
**Examples:** `24`, `36`, `48`
**Common patterns:** `Term: 36 months`, `36-month lease`, `3 years (36 months)`
**Extraction Notes:** If ambiguous wording like “for the duration of financing,” set to `null` and justify in manual extraction.
**Confidence Heuristic:** High when number + 'month(s)' appear; medium when year conversion is needed; low when ambiguous.
**Speak-to-Mentor Summary:** “All terms are converted to months.”

---

## Field: `monthly_payment`

**Description:** Recurring monthly payment amount the customer must pay during the lease or loan period.
**Type (normalized):** `number` (float) — currency amount without symbols.
**Normalization:** Remove currency symbols (`$`, `₹`, `USD`, etc.) and commas, then convert to float (e.g., `$3,999.00` → `3999.00`).
**Examples:** `399.00`, `1200.50`, `17500.0`
**Common patterns:** `$399 per month`, `399 USD/month`, `Monthly payment: 350.00`, `18,000 INR per month`.
**Extraction Notes:** If multiple monthly payments appear, select the standard recurring monthly payment (not promotional or optional add-ons). Document variations in `docs/manual_extraction.md`.
**Confidence Heuristic:** High when a currency amount is paired with “per month” or “monthly payment”; medium when inferred from tables; low when text is ambiguous.
**Speak-to-Mentor Summary:** “We extract the recurring monthly payment, normalize currency, and return a clean numeric float.”

---

## Field : `down_payment`

**Description:** One-time upfront payment made at the start of the lease or loan. Usually non-refundable.
**Type (normalized):** `number` (float) — currency amount without symbols.
**Normalization:** Remove currency symbols (`$`, `₹`, `USD`, etc.) and commas, then convert to float. For percentage-based amounts (e.g., `10% of MSRP`), set to `null` unless MSRP is provided.
**Examples:** `2000.0`, `1500.5`, `75000.0`
**Common patterns:** `Down payment: $2,000`, `Cash due at signing: $1,500`, `Initial payment ₹75,000`
**Extraction Notes:** Distinguish down payment from refundable security deposits. If contract only provides “cash due at signing,” extract the explicit down payment portion; if unclear, set `null` and document in `docs/manual_extraction.md`.
**Confidence Heuristic:** High when phrase contains “down payment” or “cash due at signing”; medium when inferred; low when contract expresses percentage without base amount.
**Speak-to-Mentor Summary:** “Down payment is the upfront one-time payment, normalized to a float. If only percentage is given without MSRP, we set it to null.”

---

## Field : `residual_value`

**Description:** Expected value of the vehicle at the end of the lease. Often stated as a currency amount or a percentage of MSRP.
**Type (normalized):** `number` (float) or `null`
**Normalization:** If stated as a currency (e.g., `$15,000`), remove symbols and convert to float. If stated as a percentage (e.g., `50% of MSRP`) and MSRP is present, compute currency value. If MSRP is missing, set to `null` and document evidence.
**Examples:** `15000.0`, `18000.50`, `null`
**Common patterns:** `Residual value $15,000`, `GFV: 50% of MSRP`, `Guaranteed future value ₹6,75,000`
**Extraction Notes:** If residual is expressed only as a percentage and MSRP is not available, set to `null`. Keep textual evidence (page number + snippet) in `docs/manual_extraction.md`. Do not guess or assume a value.
**Confidence Heuristic:** High when a currency amount is explicitly provided; medium when percentage requires matching MSRP; low when residual is implied or missing.
**Speak-to-Mentor Summary:** “Residual value is the end-of-lease vehicle value. If it’s a percentage without MSRP, we store null to avoid incorrect calculations.”

---

## Field: `overage_fee_per_mile`

**Description:** Fee charged for each mile (or kilometer) exceeding the allowed mileage limit.
**Type (normalized):** `number` (float)
**Normalization:** Convert cents to decimal dollars if necessary (e.g., `25 cents` → `0.25`). Remove currency symbols and return a float. If a range is provided (e.g., `0.15–0.25`), use the higher value and document in `docs/manual_extraction.md`.
**Examples:** `0.25`, `0.15`, `5.0`
**Common patterns:** `$0.25 per mile`, `25 cents/mile`, `₹5 per km`, `Over-limit fee: 0.15 per mile`
**Extraction Notes:** Treat values stated in cents as fractional dollars. If fee is given per kilometer, preserve the numeric value and note the unit in `docs/manual_extraction.md`. For ranges, choose the higher value to reflect maximum possible cost.
**Confidence Heuristic:** High when paired with “per mile” or “cents/mile”; medium when textual numbers are present; low when fee is implied or missing.
**Speak-to-Mentor Summary:** “Overage fee is normalized to a decimal value per mile. Cents are converted, ranges use the maximum, and units are preserved when relevant.”

---

## Field: `early_termination_fee`

**Description:** Fee, formula, or clause describing the cost or conditions of ending the lease or loan early.
**Type (normalized):** `string` (free text)
**Normalization:** Preserve the clause as text. Do not attempt numeric calculation unless an explicit standalone dollar amount is provided. Include any referenced section numbers (e.g., “See Section 12”).
**Examples:** `"See section 12; prorated remaining payments plus $395 fee"`, `"Early termination charge: $500"`, `"Remaining balance + penalty as defined in section 11"`.
**Common patterns:** `"early termination:"`, `"if lessee terminates early"`, `"termination prior to maturity"`, `"payoff amount"`.
**Extraction Notes:** Keep wording close to the contract. If the clause spans multiple lines, join them into a single readable sentence. If early termination rules refer to another section, capture the reference without guessing the formula.
**Confidence Heuristic:** Medium by default because clauses vary widely. High only when a clear standalone fee is stated; low when the clause is highly ambiguous or scattered.
**Speak-to-Mentor Summary:** “This field captures the full early termination clause as text, including formulas or section references. We never guess a numeric value; we preserve the contract’s exact meaning.”

---

## Field: `maintenance_responsibility`

**Description:** Identifies which party (lessee, lessor, dealer, or manufacturer) is responsible for routine and scheduled maintenance during the lease.
**Type (normalized):** `string` (e.g., `"lessee"`, `"lessor"`, or a short clause when mixed responsibilities apply)
**Normalization:** Use a single-word label when unambiguous (e.g., `lessee`, `lessor`). When responsibilities are shared or conditional, preserve a concise textual summary without altering contract meaning.
**Examples:** `"lessee"`, `"dealer covers scheduled maintenance for first 12 months"`, `"manufacturer warranty applies"`
**Common patterns:** `"lessee shall maintain the vehicle"`, `"lessor is responsible for scheduled maintenance"`, `"maintenance included"` , `"as per manufacturer guidelines"`.
**Extraction Notes:** If multiple clauses describe maintenance, prioritize the one specifying financial responsibility. Join multi-line clauses and remove OCR artifacts. Include section references in `docs/manual_extraction.md` when relevant.
**Confidence Heuristic:** High when responsibility is explicitly assigned ("lessee shall..."); medium when inferred from warranty language; low when clause is vague or distributed across sections.
**Speak-to-Mentor Summary:** “We identify which party is responsible for routine maintenance. If clear, we normalize to ‘lessee’ or ‘lessor’; if complex, we provide a concise summary.”

---

## Field: `warranty_details`

**Description:** Describes warranty coverage provided by the manufacturer, dealer, or third parties, including duration, mileage limits, and any conditions or exceptions.
**Type (normalized):** `string`
**Normalization:** Preserve warranty details as text. If multiple warranties are listed (e.g., basic, powertrain), combine them into a concise summary. Join multi-line clauses and remove OCR artifacts without altering meaning.
**Examples:** `"Manufacturer warranty 3 years/36,000 miles"`, `"Dealer warranty valid for 12 months"`, `"Warranty booklet referenced; no details in contract"`.
**Common patterns:** `"warranty"`, `"covered against defects"`, `"3 years/36,000 miles"`, `"manufacturer guarantees"`, `"bumper-to-bumper"`.
**Extraction Notes:** Capture warranty duration and mileage when mentioned. If contract references an external warranty document, record the reference. Do not infer coverage details not explicitly stated.
**Confidence Heuristic:** High when “warranty” and duration/mileage appear together; medium when coverage is implied; low when warranty details are missing or only referenced.
**Speak-to-Mentor Summary:** “Warranty details are captured as a text clause summarizing coverage, duration, and conditions. We keep the original meaning without converting it into structured fields.”

---

## Field: `penalties`

**Description:** Summarizes any monetary penalties such as late fees, default charges, returned payment fees, or condition-related charges stated in the contract.
**Type (normalized):** `string`
**Normalization:** Preserve penalty clauses as text. Combine multiple penalty types into one concise summary without altering meaning. Include both fixed amounts and percentage formulas when present.
**Examples:** `"Late fee: $50 or 5% of payment"`, `"Returned check fee $25; excessive wear charges apply"`, `"Penalties described in Section 8"`.
**Common patterns:** `"late fee"`, `"default charge"`, `"returned check fee"`, `"5% of amount due"`, `"excess wear and tear fees"`, `"daily penalty"`.
**Extraction Notes:** Penalty clauses may appear in multiple sections; extract all relevant components. Join multi-line text and remove OCR noise. If penalties are only referenced, capture the reference verbatim.
**Confidence Heuristic:** High when numeric penalties are explicitly stated; medium when penalties appear across multiple sections; low when penalties are implied or only referenced.
**Speak-to-Mentor Summary:** “Penalties include all extra monetary charges such as late fees or default charges. We combine these into a text summary while preserving exact contract meaning.”

---

## Field: `total_amount_financed`

**Description:** The total principal amount financed by the lender, excluding interest. Represents the net amount used to calculate loan or lease payments.
**Type (normalized):** `number` (float)
**Normalization:** Remove currency symbols and commas, convert to float. Use only the explicit amount labeled as “amount financed,” “principal,” or equivalent. If not explicitly stated, return `null` and document reasoning in `docs/manual_extraction.md`.
**Examples:** `24000.0`, `18750.0`, `null`
**Common patterns:** `"amount financed"`, `"loan amount"`, `"principal"`, `"net amount financed"`, `"you are financing"`.
**Extraction Notes:** Use the amount explicitly labeled in the contract. Do not calculate derived values unless the contract explicitly shows the result. If multiple similar amounts exist, prioritize the standardized disclosure box (e.g., Truth in Lending Act box in U.S. contracts).
**Confidence Heuristic:** High when a labeled amount appears in a standardized table; medium when found in narrative text; low when value must be inferred.
**Speak-to-Mentor Summary:** “Total amount financed is the principal loan amount. We only extract it when explicitly shown and normalize it to a float. We never calculate it ourselves unless the contract states the calculated value.”

---

## Field: `security_deposit`

**Description:** Any refundable deposit held by the lessor, which may be returned at the end of the lease subject to conditions such as vehicle inspection or payment history.
**Type (normalized):** `number`, `string`, or `null`
**Normalization:** Use a numeric value when the deposit amount is explicitly stated. If conditions or exceptions dominate the clause, preserve the full text. Use `"waived"` when the contract explicitly waives the deposit. If no deposit is mentioned, return `null`.
**Examples:** `500.0`, `"Refundable upon inspection"`, `"waived"`, `null`
**Common patterns:** `"security deposit"`, `"refundable deposit"`, `"deposit may be returned"`, `"deposit waived"`, `"held by lessor"`.
**Extraction Notes:** Distinguish clearly between down payment and security deposit. Join multi-line clauses and remove OCR noise. Document conditions affecting refund in `docs/manual_extraction.md`.
**Confidence Heuristic:** High when a numeric deposit is explicitly labeled; medium when text-only clauses appear; low when security deposit is not clearly distinguished from other upfront fees.
**Speak-to-Mentor Summary:** “Security deposit may be numeric or textual. We extract a number when stated, otherwise preserve the clause. Waived deposits are stored as the string 'waived', and missing deposits return null.”
