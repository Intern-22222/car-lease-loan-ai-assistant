
const extractFields = (cleanedText) => {
  if (!cleanedText || typeof cleanedText !== "string") {
    return { fields: {}, confidence: 0, notes: ["Invalid OCR text"] };
  }

  let result = {
    fields: {},
    confidence: 0,
    notes: [],
  };

  
  const parseNum = (str) => {
    if (!str) return null;
    let cleanStr = str.replace(/[, ]/g, "");
    if (/^\d+\.\d{3}$/.test(cleanStr)) cleanStr = cleanStr.replace(".", ""); // Fix 11.300 -> 11300
    return parseFloat(cleanStr);
  };

  console.log("--- DEBUG EXTRACTION START ---");

  const loanMatch = cleanedText.match(
    /(?:Loan Amount|Amount)[:\s]+(?:Rs\.?|INR|₹)?\s*([\d,.]+)/i,
  );
  if (loanMatch) {
    result.fields.loan_amount = parseNum(loanMatch[1]);
    result.confidence += 0.3;
  }

  const interestMatch = cleanedText.match(
    /(?:Interest Rate|Rate)[:\s]+([\d.]+)/i,
  );
  if (interestMatch) {
    result.fields.interest_rate = parseFloat(interestMatch[1]);
    result.confidence += 0.3;
  }

  const tenureMatch = cleanedText.match(
    /(?:Tenure|Duration)[:\s]+(\d+)\s*(months|years)/i,
  );
  if (tenureMatch) {
    let val = parseInt(tenureMatch[1]);
    if (tenureMatch[2].toLowerCase().startsWith("year")) val *= 12;
    result.fields.tenure_months = val;
    result.confidence += 0.2;
  }

  const emiMatch = cleanedText.match(
    /(?:EMI|Installment)[:\s]+(?:Rs\.?|INR|₹)?\s*([\d,.]+)/i,
  );
  if (emiMatch) {
    result.fields.emi = parseNum(emiMatch[1]);
    result.confidence += 0.2;
  }



  const makeMatch = cleanedText.match(/Make[:\s]+([^\n\r]+)/i);
  if (makeMatch) {
    result.fields.vehicle_make = makeMatch[1].trim();
    console.log("✅ Extracted Make:", result.fields.vehicle_make);
  }

  const modelMatch = cleanedText.match(/Model[:\s]+([^\n\r]+)/i);
  if (modelMatch) {
    result.fields.vehicle_model = modelMatch[1].trim();
    console.log("✅ Extracted Model:", result.fields.vehicle_model);
  }

  const yearMatch = cleanedText.match(/Year[:\s]+(\d{4})/i);
  if (yearMatch) {
    result.fields.vehicle_year = yearMatch[1].trim();
    console.log("✅ Extracted Year:", result.fields.vehicle_year);
  }

  const trimMatch = cleanedText.match(/Trim[:\s]+([^\n\r]+)/i);
  if (trimMatch) result.fields.vehicle_trim = trimMatch[1].trim();

  const bodyMatch = cleanedText.match(/Body(?: Type)?[:\s]+([^\n\r]+)/i);
  if (bodyMatch) result.fields.vehicle_body_type = bodyMatch[1].trim();

  
  let vinMatch = cleanedText.match(/VIN[:\s]+([A-Z0-9]{17})/i);

  
  if (!vinMatch) {
    const correctionMatch = cleanedText.match(/VIN[:\s]+(THG[A-Z0-9]{14})/i);
    if (correctionMatch) {
      result.fields.vin = "1" + correctionMatch[1].substring(1);
      result.notes.push("VIN Auto-Corrected (THG->1HG)");
      console.log("✅ Extracted VIN (Corrected):", result.fields.vin);
    }
  } else {
    result.fields.vin = vinMatch[1];
    console.log("✅ Extracted VIN:", result.fields.vin);
  }

  console.log("--- DEBUG EXTRACTION END ---");


  if (result.hiddenFees && Array.isArray(result.hiddenFees.fees)) {
    result.hiddenFees.fees = result.hiddenFees.fees.map(fee => {
      let sev = 'ok';
      if (fee.type === 'Junk' && Number(fee.amount) > 5000) sev = 'critical';
      else if (fee.type === 'Junk') sev = 'warning';
      return Object.assign({}, fee, { severity: sev });
    });
  }
  result.confidence = Math.min(result.confidence, 1.0);
  
  return result;
};

module.exports = extractFields;
