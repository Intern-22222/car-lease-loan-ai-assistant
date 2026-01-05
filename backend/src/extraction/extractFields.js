const extractFields = (cleanedText) => {
  if (!cleanedText || typeof cleanedText !== "string") {
    return {
      fields: {},
      confidence: 0,
      notes: ["Invalid OCR text received"],
    };
  }
  let result = {
    fields: {},
    confidence: 0,
    notes: [],
  };

  // TODO: Phase-2 extraction logic will be added here step-by-step

  let loanAmountMatch = cleanedText.match(
    /\b(?:loan\s*amount|amount\s*of\s*loan)\b[^0-9]*([0-9]+(?:\.[0-9]+)?)/i
  );

  if (loanAmountMatch) {
    let rawAmount = loanAmountMatch[1];
    let numericValue = parseFloat(rawAmount);
    if (!isNaN(numericValue)) {
      result.fields.loan_amount = numericValue;
      result.confidence += 0.35;
      result.notes.push("Loan amount detected using primary regex pattern");
    }
  }

  let currencyMatch = cleanedText.match(
    /\b(?:Rs|INR)\s*([0-9]+(?:\.[0-9]+)?)/i
  );

  if (currencyMatch) {
    let rawAmount = currencyMatch[1];
    let numericValue = parseFloat(rawAmount);
    if (!isNaN(numericValue)) {
      if (!result.fields.loan_amount) {
        result.fields.loan_amount = numericValue;
        result.notes.push("Loan amount detected using currency-linked pattern");
        result.confidence += 0.3;
      } else if (result.fields.loan_amount === numericValue) {
        result.confidence += 0.1;
        result.notes.push(
          "Currency pattern confirms previously detected loan amount"
        );
      }
    }
  }
  if (!result.fields.loan_amount) {
    let sectionScopedMatch = cleanedText.match(
      /__SECTION_START[\s\S]*?(loan|sanction|finance|amount)[\s\S]*?(Rs\s*[0-9]+(?:\.[0-9]+)?)/i
    );
    if (sectionScopedMatch) {
      let numberMatch = sectionScopedMatch[2].match(/([0-9]+(?:\.[0-9]+)?)/);
      if (numberMatch) {
        let numericValue = parseFloat(numberMatch[1]);
        if (isNaN(numericValue)) {
          result.fields.loan_amount = numericValue;
          result.confidence += 0.2;
          result.notes.push(
            "Loan amount detected using section-scoped fallback detection"
          );
        }
      }
    }
  }

  if (result.fields.loan_amount) {
    if (result.confidence > 1) {
      result.confidence = 1;
    }
    if (result.confidence < 0) {
      result.confidence = 0;
    }
    result.notes.push(
      `Final loan amount confidence score: ${result.confidence.toFixed(2)}`
    );
  } else {
    result.confidence = 0;
    result.notes.push("Loan amount not confidently detected");
  }

  let interestMatch = cleanedText.match(
    /\b(?:interest\s*rate|rate\s*of\s*interest|roi)\b[^0-9%]*([0-9]+(?:\.[0-9]+)?)\s*%?/i
  );
  if (interestMatch) {
    let rawRate = interestMatch[1];
    let rateValue = parseFloat(rawRate);
    if (!isNaN(rateValue)) {
      result.fields.interest_rate = rateValue;
      result.confidence += 0.3;
      result.notes.push(
        "Interest rate detected using primary regex phrase pattern"
      );
    }
  }

  let percentMatch = cleanedText.match(/([0-9]+(?:\.[0-9]+)?)\s*%/);
  if (percentMatch) {
    let rawPercent = percentMatch[1];
    let precentValue = parseFloat(rawPercent);
    if (!isNaN(precentValue)) {
      if (!result.fields.interest_rate) {
        result.fields.interest_rate = precentValue;
        result.confidence += 0.25;
        result.notes.push(
          "Interest rate detected using percent-context fallback pattern"
        );
      } else if (result.fields.interest_rate === precentValue) {
        result.confidence += 0.1;
        result.notes.push(
          "Percent-based detection confirms interest rate value"
        );
      }
    }
  }

  if (!result.fields.interest_rate) {
    let interestSectionMatch = cleanedText.match(
      /__SECTION_START__[\s\S]*?(interest|roi|rate)[\s\S]*?([0-9]+(?:\.[0-9]+)?)\s*%/i
    );
    if (interestSectionMatch) {
      let rateValue = parseFloat(interestSectionMatch[2]);
      if (!isNaN(rateValue)) {
        result.fields.interest_rate = rateValue;
        result.confidence += 0.2;
        result.notes.push(
          "Interest rate detected using section-scoped fallback detection"
        );
      }
    }
  }

  if (result.fields.interest_rate !== undefined) {
    if (result.confidence > 1) {
      result.confidence = 1;
    }
    if (result.confidence < 0) {
      result.confidence = 0;
    }
    result.notes.push(
      `Final interest rate confidence score: ${result.confidence.toFixed(2)}`
    );
  } else {
    result.notes.push("Interest rate not confidently detected");
  }

  let emiMatch = cleanedText.match(
    /\b(?:emi|monthly\s*installment|installment\s*amount)\b[^0-9]*([0-9]+(?:\.[0-9]+)?)/i
  );

  if (emiMatch) {
    let rawEmi = emiMatch[1];
    let emiValue = parseFloat(rawEmi);
    if (!isNaN(emiValue)) {
      result.fields.emi = emiValue;
      result.confidence += 0.25;
      result.notes.push("EMI detected using primary EMI phrase pattern");
    }
  }

  let emiCurrencyMatch = cleanedText.match(
    /\b(?:rs|inr|₹)\s*([0-9]+(?:\.[0-9]+)?)/i
  );
  if (emiCurrencyMatch) {
    let rawCurrencyEmi = emiCurrencyMatch[1];
    let currencyEmiValue = parseFloat(rawCurrencyEmi);
    if (!isNaN(currencyEmiValue)) {
      if (!result.fields.emi) {
        result.fields.emi = currencyEmiValue;
        result.confidence += 0.2;
        result.notes.push(
          "EMI detected using currency-linked fallback pattern"
        );
      } else if (result.fields.emi === currencyEmiValue) {
        result.confidence += 0.1;
        result.notes.push(
          "Currency-linked EMI value confirms previous EMI detection"
        );
      }
    }
  }

  if (!result.fields.emi) {
    let emiSectionMatch = cleanedText.match(
      /__SECTION_START__[\s\S]*?(emi|installment|repayment|monthly)[\s\S]*?(?:rs|inr|₹)\s*([0-9]+(?:\.[0-9]+)?)/i
    );

    if (emiSectionMatch) {
      let emiSectionValue = parseFloat(emiSectionMatch[2]);
      if (!isNaN(emiSectionValue)) {
        result.fields.emi = emiSectionValue;
        result.confidence += 0.15;
        result.notes.push(
          "EMI detected using section-scoped fallback inference"
        );
      }
    }
  }

  if (result.fields.emi !== undefined) {
    if (result.confidence > 1) {
      result.confidence = 1;
    }
    if (result.confidence < 0) {
      result.confidence = 0;
    }
    result.notes.push(
      `Final EMI confidence score: ${result.confidence.toFixed(2)}`
    );
  } else {
    result.notes.push("EMI not confidently detected");
  }

  let tenureMatch = cleanedText.match(
    /\b(?:tenure|loan\s*duration|repayment\s*term|lease\s*period)\b[^0-9]*([0-9]+)\s*(years?|months?)/i
  );

  if (tenureMatch) {
    let rawTenureValue = parseInt(tenureMatch[1]);
    let rawTenureUnit = tenureMatch[2].toLowerCase();
    let tenureInMonths = rawTenureUnit.startsWith("year")
      ? rawTenureValue * 12
      : rawTenureValue;
    if (!isNaN(tenureInMonths)) {
      result.fields.tenure_months = tenureInMonths;
      result.confidence += 0.25;
      result.notes.push("Tenure detected using primary tenure phrase pattern");
    }
  }

  let contextTenureMatch = cleanedText.match(
    /\b([0-9]+)\s*(years?|months?)\b/i
  );
  if (contextTenureMatch) {
    let contextValue = parseInt(contextTenureMatch[1]);
    let contextUnit = contextTenureMatch[2].toLowerCase();
    let contextMonths = contextUnit.startsWith("year")
      ? contextValue * 12
      : contextValue;
    if (!isNaN(contextMonths)) {
      if (!result.fields.tenure_months) {
        result.fields.tenure_months = contextMonths;
        result.confidence += 0.2;
        result.notes.push("Tenure detected using contextual duration pattern");
      } else if (result.fields.tenure_months === contextMonths) {
        result.confidence += 0.1;
        result.notes.push("Contextual tenure pattern confirms tenure value");
      }
    }
  }

  let tenureSectionKeywords = [
    "tenure",
    "repayment period",
    "loan duration",
    "emi period",
    "installment period",
  ];

  let tenureLines = cleanedText.split("\n");
  for (let i = 0; i < tenureLines.length; i++) {
    let line = tenureLines[i].toLocaleLowerCase();
    if (tenureSectionKeywords.some((k) => line.includes(k))) {
      let nearbyText = tenureLines.slice(Math.max(0, i - 3), i + 4).join(" ");
      let sectionMatch = nearbyText.match(/([0-9]+)\s*(years?|months?)/i);
      if (sectionMatch) {
        let value = parseInt(sectionMatch[1]);
        let unit = sectionMatch[2].toLowerCase();
        let months = unit.startsWith("year") ? value * 12 : value;
        if (!result.fields.tenure_months) {
          result.fields.tenure_months = months;
          result.confidence += 0.18;
          result.notes.push("Tenure inferred from nearby section context");
        }
      }
    }
  }

  if (result.confidence > 1) {
    result.confidence = 1;
  }
  if (result.confidence < 0) {
    result, (confidence = 0);
  }

  result.confidence = Number(result.confidence.toFixed(2));

  return result;
};

module.exports = extractFields;
