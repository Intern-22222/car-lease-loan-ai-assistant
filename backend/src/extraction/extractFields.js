// const extractFields = (cleanedText) => {
//   if (!cleanedText || typeof cleanedText !== "string") {
//     return {
//       fields: {},
//       confidence: 0,
//       notes: ["Invalid OCR text received"],
//     };
//   }
//   let result = {
//     fields: {},
//     confidence: 0,
//     notes: [],
//   };

//   // TODO: Phase-2 extraction logic will be added here step-by-step

//   let loanAmountMatch = cleanedText.match(
//     /\b(?:loan\s*amount|amount\s*of\s*loan)\b[^0-9]*([0-9]+(?:\.[0-9]+)?)/i,
//   );

//   if (loanAmountMatch) {
//     let rawAmount = loanAmountMatch[1];
//     let numericValue = parseFloat(rawAmount);
//     if (!isNaN(numericValue)) {
//       result.fields.loan_amount = numericValue;
//       result.confidence += 0.35;
//       result.notes.push("Loan amount detected using primary regex pattern");
//     }
//   }

//   let currencyMatch = cleanedText.match(
//     /\b(?:Rs|INR)\s*([0-9]+(?:\.[0-9]+)?)/i,
//   );

//   if (currencyMatch) {
//     let rawAmount = currencyMatch[1];
//     let numericValue = parseFloat(rawAmount);
//     if (!isNaN(numericValue)) {
//       if (!result.fields.loan_amount) {
//         result.fields.loan_amount = numericValue;
//         result.notes.push("Loan amount detected using currency-linked pattern");
//         result.confidence += 0.3;
//       } else if (result.fields.loan_amount === numericValue) {
//         result.confidence += 0.1;
//         result.notes.push(
//           "Currency pattern confirms previously detected loan amount",
//         );
//       }
//     }
//   }
//   if (!result.fields.loan_amount) {
//     let sectionScopedMatch = cleanedText.match(
//       /__SECTION_START[\s\S]*?(loan|sanction|finance|amount)[\s\S]*?(Rs\s*[0-9]+(?:\.[0-9]+)?)/i,
//     );
//     if (sectionScopedMatch) {
//       let numberMatch = sectionScopedMatch[2].match(/([0-9]+(?:\.[0-9]+)?)/);
//       if (numberMatch) {
//         let numericValue = parseFloat(numberMatch[1]);
//         if (isNaN(numericValue)) {
//           result.fields.loan_amount = numericValue;
//           result.confidence += 0.2;
//           result.notes.push(
//             "Loan amount detected using section-scoped fallback detection",
//           );
//         }
//       }
//     }
//   }

//   if (result.fields.loan_amount) {
//     if (result.confidence > 1) {
//       result.confidence = 1;
//     }
//     if (result.confidence < 0) {
//       result.confidence = 0;
//     }
//     result.notes.push(
//       `Final loan amount confidence score: ${result.confidence.toFixed(2)}`,
//     );
//   } else {
//     result.confidence = 0;
//     result.notes.push("Loan amount not confidently detected");
//   }

//   let interestMatch = cleanedText.match(
//     /\b(?:interest\s*rate|rate\s*of\s*interest|roi)\b[^0-9%]*([0-9]+(?:\.[0-9]+)?)\s*%?/i,
//   );
//   if (interestMatch) {
//     let rawRate = interestMatch[1];
//     let rateValue = parseFloat(rawRate);
//     if (!isNaN(rateValue)) {
//       result.fields.interest_rate = rateValue;
//       result.confidence += 0.3;
//       result.notes.push(
//         "Interest rate detected using primary regex phrase pattern",
//       );
//     }
//   }

//   let percentMatch = cleanedText.match(/([0-9]+(?:\.[0-9]+)?)\s*%/);
//   if (percentMatch) {
//     let rawPercent = percentMatch[1];
//     let precentValue = parseFloat(rawPercent);
//     if (!isNaN(precentValue)) {
//       if (!result.fields.interest_rate) {
//         result.fields.interest_rate = precentValue;
//         result.confidence += 0.25;
//         result.notes.push(
//           "Interest rate detected using percent-context fallback pattern",
//         );
//       } else if (result.fields.interest_rate === precentValue) {
//         result.confidence += 0.1;
//         result.notes.push(
//           "Percent-based detection confirms interest rate value",
//         );
//       }
//     }
//   }

//   if (!result.fields.interest_rate) {
//     let interestSectionMatch = cleanedText.match(
//       /__SECTION_START__[\s\S]*?(interest|roi|rate)[\s\S]*?([0-9]+(?:\.[0-9]+)?)\s*%/i,
//     );
//     if (interestSectionMatch) {
//       let rateValue = parseFloat(interestSectionMatch[2]);
//       if (!isNaN(rateValue)) {
//         result.fields.interest_rate = rateValue;
//         result.confidence += 0.2;
//         result.notes.push(
//           "Interest rate detected using section-scoped fallback detection",
//         );
//       }
//     }
//   }

//   if (result.fields.interest_rate !== undefined) {
//     if (result.confidence > 1) {
//       result.confidence = 1;
//     }
//     if (result.confidence < 0) {
//       result.confidence = 0;
//     }
//     result.notes.push(
//       `Final interest rate confidence score: ${result.confidence.toFixed(2)}`,
//     );
//   } else {
//     result.notes.push("Interest rate not confidently detected");
//   }

//   let emiMatch = cleanedText.match(
//     /\b(?:emi|monthly\s*installment|installment\s*amount)\b[^0-9]*([0-9]+(?:\.[0-9]+)?)/i,
//   );

//   if (emiMatch) {
//     let rawEmi = emiMatch[1];
//     let emiValue = parseFloat(rawEmi);
//     if (!isNaN(emiValue)) {
//       result.fields.emi = emiValue;
//       result.confidence += 0.25;
//       result.notes.push("EMI detected using primary EMI phrase pattern");
//     }
//   }

//   let emiCurrencyMatch = cleanedText.match(
//     /\b(?:rs|inr|₹)\s*([0-9]+(?:\.[0-9]+)?)/i,
//   );
//   if (emiCurrencyMatch) {
//     let rawCurrencyEmi = emiCurrencyMatch[1];
//     let currencyEmiValue = parseFloat(rawCurrencyEmi);
//     if (!isNaN(currencyEmiValue)) {
//       if (!result.fields.emi) {
//         result.fields.emi = currencyEmiValue;
//         result.confidence += 0.2;
//         result.notes.push(
//           "EMI detected using currency-linked fallback pattern",
//         );
//       } else if (result.fields.emi === currencyEmiValue) {
//         result.confidence += 0.1;
//         result.notes.push(
//           "Currency-linked EMI value confirms previous EMI detection",
//         );
//       }
//     }
//   }

//   if (!result.fields.emi) {
//     let emiSectionMatch = cleanedText.match(
//       /__SECTION_START__[\s\S]*?(emi|installment|repayment|monthly)[\s\S]*?(?:rs|inr|₹)\s*([0-9]+(?:\.[0-9]+)?)/i,
//     );

//     if (emiSectionMatch) {
//       let emiSectionValue = parseFloat(emiSectionMatch[2]);
//       if (!isNaN(emiSectionValue)) {
//         result.fields.emi = emiSectionValue;
//         result.confidence += 0.15;
//         result.notes.push(
//           "EMI detected using section-scoped fallback inference",
//         );
//       }
//     }
//   }

//   if (result.fields.emi !== undefined) {
//     if (result.confidence > 1) {
//       result.confidence = 1;
//     }
//     if (result.confidence < 0) {
//       result.confidence = 0;
//     }
//     result.notes.push(
//       `Final EMI confidence score: ${result.confidence.toFixed(2)}`,
//     );
//   } else {
//     result.notes.push("EMI not confidently detected");
//   }

//   let tenureMatch = cleanedText.match(
//     /\b(?:tenure|loan\s*duration|repayment\s*term|lease\s*period)\b[^0-9]*([0-9]+)\s*(years?|months?)/i,
//   );

//   if (tenureMatch) {
//     let rawTenureValue = parseInt(tenureMatch[1]);
//     let rawTenureUnit = tenureMatch[2].toLowerCase();
//     let tenureInMonths = rawTenureUnit.startsWith("year")
//       ? rawTenureValue * 12
//       : rawTenureValue;
//     if (!isNaN(tenureInMonths)) {
//       result.fields.tenure_months = tenureInMonths;
//       result.confidence += 0.25;
//       result.notes.push("Tenure detected using primary tenure phrase pattern");
//     }
//   }

//   let contextTenureMatch = cleanedText.match(
//     /\b([0-9]+)\s*(years?|months?)\b/i,
//   );
//   if (contextTenureMatch) {
//     let contextValue = parseInt(contextTenureMatch[1]);
//     let contextUnit = contextTenureMatch[2].toLowerCase();
//     let contextMonths = contextUnit.startsWith("year")
//       ? contextValue * 12
//       : contextValue;
//     if (!isNaN(contextMonths)) {
//       if (!result.fields.tenure_months) {
//         result.fields.tenure_months = contextMonths;
//         result.confidence += 0.2;
//         result.notes.push("Tenure detected using contextual duration pattern");
//       } else if (result.fields.tenure_months === contextMonths) {
//         result.confidence += 0.1;
//         result.notes.push("Contextual tenure pattern confirms tenure value");
//       }
//     }
//   }

//   let tenureSectionKeywords = [
//     "tenure",
//     "repayment period",
//     "loan duration",
//     "emi period",
//     "installment period",
//   ];

//   let tenureLines = cleanedText.split("\n");
//   for (let i = 0; i < tenureLines.length; i++) {
//     let line = tenureLines[i].toLocaleLowerCase();
//     if (tenureSectionKeywords.some((k) => line.includes(k))) {
//       let nearbyText = tenureLines.slice(Math.max(0, i - 3), i + 4).join(" ");
//       let sectionMatch = nearbyText.match(/([0-9]+)\s*(years?|months?)/i);
//       if (sectionMatch) {
//         let value = parseInt(sectionMatch[1]);
//         let unit = sectionMatch[2].toLowerCase();
//         let months = unit.startsWith("year") ? value * 12 : value;
//         if (!result.fields.tenure_months) {
//           result.fields.tenure_months = months;
//           result.confidence += 0.18;
//           result.notes.push("Tenure inferred from nearby section context");
//         }
//       }
//     }
//   }

//   if (result.confidence > 1) {
//     result.confidence = 1;
//   }
//   if (result.confidence < 0) {
//     (result, (confidence = 0));
//   }

//   result.confidence = Number(result.confidence.toFixed(2));

//   // ==========================================
//   // 🚙 VEHICLE DETAILS (TEXT EXTRACTION)
//   // ==========================================
//   // Since the VIN is fake, we MUST read these from the text

//   const makeMatch = cleanedText.match(/Make[\s:.-]*([A-Za-z\s]+)(?:\n|$|\r)/i);
//   if (makeMatch) result.fields.vehicle_make = makeMatch[1].trim();

//   const modelMatch = cleanedText.match(
//     /Model[\s:.-]*([A-Za-z0-9\s]+)(?:\n|$|\r)/i,
//   );
//   if (modelMatch) result.fields.vehicle_model = modelMatch[1].trim();

//   const yearMatch = cleanedText.match(/Year[\s:.-]*([0-9]{4})/i);
//   if (yearMatch) result.fields.vehicle_year = yearMatch[1].trim();

//   const trimMatch = cleanedText.match(
//     /Trim[\s:.-]*([A-Za-z0-9-\s]+)(?:\n|$|\r)/i,
//   );
//   if (trimMatch) result.fields.vehicle_trim = trimMatch[1].trim();

//   const bodyMatch = cleanedText.match(/Body\s*Type[\s:.-]*([A-Za-z]+)/i);
//   if (bodyMatch) result.fields.vehicle_body_type = bodyMatch[1].trim();

//   //VIN extraction

//   // 1. Look for "VIN:" label explicitly (Most accurate)
//   let vinMatch = cleanedText.match(/VIN[\s:.-]*([A-Z0-9]{17})/i);

//   // 2. Fallback: Look for the specific pattern in your file (1HG...)
//   if (!vinMatch) {
//     vinMatch = cleanedText.match(/\b(1HG[A-Z0-9]{14})\b/i);
//   }

//   if (vinMatch) {
//     result.fields.vin = vinMatch[1].toUpperCase();
//     result.confidence += 0.2;
//     result.notes.push("VIN detected");
//   } else {
//     result.fields.vin = null;
//     result.notes.push("VIN not detected");
//   }

//   // Cap confidence
//   result.confidence = Math.min(result.confidence, 1.0);

//   return result;
// };

// module.exports = extractFields;


// const extractFields = (cleanedText) => {
//   if (!cleanedText || typeof cleanedText !== "string") {
//     return {
//       fields: {},
//       confidence: 0,
//       notes: ["Invalid OCR text received"],
//     };
//   }
//   let result = {
//     fields: {},
//     confidence: 0,
//     notes: [],
//   };

//   // --- HELPER: Fixes the "₹4" bug by removing commas ---
//   const parseNum = (str) => {
//     if (!str) return null;
//     // Remove commas and spaces before parsing
//     const cleanStr = str.replace(/,/g, "").replace(/\s/g, "");
//     return parseFloat(cleanStr);
//   };

//   // --- 1. LOAN AMOUNT (Fixed regex to allow commas) ---
//   let loanAmountMatch = cleanedText.match(
//     /\b(?:loan\s*amount|amount\s*of\s*loan)\b[^0-9]*([0-9,]+(?:\.[0-9]+)?)/i,
//   );

//   if (loanAmountMatch) {
//     let val = parseNum(loanAmountMatch[1]); // Use parseNum helper
//     if (!isNaN(val)) {
//       result.fields.loan_amount = val;
//       result.confidence += 0.35;
//       result.notes.push("Loan amount detected");
//     }
//   }

//   // Currency Fallback (Also fixed for commas)
//   let currencyMatch = cleanedText.match(
//     /\b(?:Rs|INR)\s*([0-9,]+(?:\.[0-9]+)?)/i,
//   );

//   if (currencyMatch) {
//     let val = parseNum(currencyMatch[1]);
//     if (!isNaN(val)) {
//       if (!result.fields.loan_amount) {
//         result.fields.loan_amount = val;
//         result.confidence += 0.3;
//         result.notes.push("Loan amount detected via currency");
//       }
//     }
//   }

//   // Section Scoped Fallback
//   if (!result.fields.loan_amount) {
//     let sectionScopedMatch = cleanedText.match(
//       /__SECTION_START[\s\S]*?(loan|sanction|finance|amount)[\s\S]*?(Rs\s*[0-9,]+(?:\.[0-9]+)?)/i,
//     );
//     if (sectionScopedMatch) {
//       let numberMatch = sectionScopedMatch[2].match(/([0-9,]+(?:\.[0-9]+)?)/);
//       if (numberMatch) {
//         let val = parseNum(numberMatch[1]);
//         if (!isNaN(val)) {
//           result.fields.loan_amount = val;
//           result.confidence += 0.2;
//         }
//       }
//     }
//   }

//   if (result.fields.loan_amount) {
//     result.confidence = Math.min(result.confidence, 1);
//     result.notes.push(`Final loan amount: ${result.fields.loan_amount}`);
//   } else {
//     result.notes.push("Loan amount not detected");
//   }

//   // --- 2. INTEREST RATE ---
//   let interestMatch = cleanedText.match(
//     /\b(?:interest\s*rate|rate\s*of\s*interest|roi)\b[^0-9%]*([0-9]+(?:\.[0-9]+)?)\s*%?/i,
//   );
//   if (interestMatch) {
//     let val = parseFloat(interestMatch[1]);
//     if (!isNaN(val)) {
//       result.fields.interest_rate = val;
//       result.confidence += 0.3;
//       result.notes.push("Interest rate detected");
//     }
//   }

//   // Percent Match Fallback
//   let percentMatch = cleanedText.match(/([0-9]+(?:\.[0-9]+)?)\s*%/);
//   if (percentMatch) {
//     let val = parseFloat(percentMatch[1]);
//     if (!isNaN(val)) {
//       if (!result.fields.interest_rate) {
//         result.fields.interest_rate = val;
//         result.confidence += 0.25;
//       }
//     }
//   }

//   if (result.fields.interest_rate) {
//     result.confidence = Math.min(result.confidence, 1);
//   } else {
//     result.notes.push("Interest rate not detected");
//   }

//   // --- 3. EMI (Fixed regex to allow commas) ---
//   let emiMatch = cleanedText.match(
//     /\b(?:emi|monthly\s*installment|installment\s*amount)\b[^0-9]*([0-9,]+(?:\.[0-9]+)?)/i,
//   );

//   if (emiMatch) {
//     let val = parseNum(emiMatch[1]); // Use parseNum helper
//     if (!isNaN(val)) {
//       result.fields.emi = val;
//       result.confidence += 0.25;
//       result.notes.push("EMI detected");
//     }
//   }

//   // EMI Currency Fallback
//   let emiCurrencyMatch = cleanedText.match(
//     /\b(?:rs|inr|₹)\s*([0-9,]+(?:\.[0-9]+)?)/i,
//   );
//   if (emiCurrencyMatch) {
//     let val = parseNum(emiCurrencyMatch[1]);
//     if (!isNaN(val)) {
//       if (!result.fields.emi) {
//         result.fields.emi = val;
//         result.confidence += 0.2;
//       }
//     }
//   }

//   if (result.fields.emi) {
//     result.confidence = Math.min(result.confidence, 1);
//   } else {
//     result.notes.push("EMI not detected");
//   }

//   // --- 4. TENURE ---
//   let tenureMatch = cleanedText.match(
//     /\b(?:tenure|loan\s*duration|repayment\s*term|lease\s*period)\b[^0-9]*([0-9]+)\s*(years?|months?)/i,
//   );

//   if (tenureMatch) {
//     let rawTenureValue = parseInt(tenureMatch[1]);
//     let rawTenureUnit = tenureMatch[2].toLowerCase();
//     let tenureInMonths = rawTenureUnit.startsWith("year")
//       ? rawTenureValue * 12
//       : rawTenureValue;
//     if (!isNaN(tenureInMonths)) {
//       result.fields.tenure_months = tenureInMonths;
//       result.confidence += 0.25;
//       result.notes.push("Tenure detected");
//     }
//   }

//   // ==========================================
//   // 🚙 VEHICLE DETAILS (TEXT EXTRACTION)
//   // ==========================================

//   const makeMatch = cleanedText.match(/Make[\s:.-]*([A-Za-z\s]+)(?:\n|$|\r)/i);
//   if (makeMatch) result.fields.vehicle_make = makeMatch[1].trim();

//   const modelMatch = cleanedText.match(
//     /Model[\s:.-]*([A-Za-z0-9\s]+)(?:\n|$|\r)/i,
//   );
//   if (modelMatch) result.fields.vehicle_model = modelMatch[1].trim();

//   const yearMatch = cleanedText.match(/Year[\s:.-]*([0-9]{4})/i);
//   if (yearMatch) result.fields.vehicle_year = yearMatch[1].trim();

//   const trimMatch = cleanedText.match(
//     /Trim[\s:.-]*([A-Za-z0-9-\s]+)(?:\n|$|\r)/i,
//   );
//   if (trimMatch) result.fields.vehicle_trim = trimMatch[1].trim();

//   const bodyMatch = cleanedText.match(/Body(?:\s*Type)?[\s:.-]*([A-Za-z]+)/i);
//   if (bodyMatch) result.fields.vehicle_body_type = bodyMatch[1].trim();

//   // ==========================================
//   // 🆔 VIN EXTRACTION (With Auto-Correct)
//   // ==========================================

//   // 1. Look for "VIN:" label explicitly
//   let vinMatch = cleanedText.match(/VIN[\s:.-]*([A-Z0-9]{17})/i);

//   // 2. Fallback: Specific Honda pattern (1HG...)
//   if (!vinMatch) {
//     vinMatch = cleanedText.match(/\b(1HG[A-Z0-9]{14})\b/i);
//   }

//   // 3. Fallback: AUTO-CORRECT "THG" to "1HG" (Fixes your OCR error!)
//   if (!vinMatch) {
//     const correctionMatch = cleanedText.match(/\b(THG[A-Z0-9]{14})\b/i);
//     if (correctionMatch) {
//       result.fields.vin = "1" + correctionMatch[1].substring(1);
//       result.confidence += 0.1;
//       result.notes.push("VIN detected (Auto-corrected 'T' to '1')");
//       // Return here since we found it
//       result.confidence = Math.min(result.confidence, 1.0);
//       return result;
//     }
//   }

//   // 4. Generic Fallback
//   if (!vinMatch) {
//     vinMatch = cleanedText.match(/\b(?![IOQ])[A-Z0-9]{17}\b/);
//   }

//   if (vinMatch) {
//     result.fields.vin = vinMatch[1].toUpperCase();
//     result.confidence += 0.2;
//     result.notes.push("VIN detected");
//   } else {
//     result.fields.vin = null;
//     result.notes.push("VIN not detected");
//   }

//   // Cap confidence
//   result.confidence = Math.min(result.confidence, 1.0);
//   result.confidence = Number(result.confidence.toFixed(2));

//   return result;
// };

// module.exports = extractFields;



// const extractFields = (cleanedText) => {
//   if (!cleanedText || typeof cleanedText !== "string") {
//     return {
//       fields: {},
//       confidence: 0,
//       notes: ["Invalid OCR text received"],
//     };
//   }
//   let result = {
//     fields: {},
//     confidence: 0,
//     notes: [],
//   };

//   // --- HELPER: Robust Number Parsing ---
//   const parseNum = (str) => {
//     if (!str) return null;
//     // 1. Remove spaces and commas
//     let cleanStr = str.replace(/[, ]/g, "");

//     // 2. OCR Fix: If it looks like "11.300" (exactly 3 decimals), treat dot as thousand separator
//     // This fixes the specific issue in your "converted_text.pdf"
//     if (/^\d+\.\d{3}$/.test(cleanStr)) {
//       cleanStr = cleanStr.replace(".", "");
//     }

//     return parseFloat(cleanStr);
//   };

//   // --- 1. LOAN AMOUNT ---
//   let loanAmountMatch = cleanedText.match(
//     /\b(?:loan\s*amount|amount\s*of\s*loan)\b[^0-9]*([0-9,]+(?:\.[0-9]+)?)/i,
//   );
//   // Fallback
//   if (!loanAmountMatch) {
//     loanAmountMatch = cleanedText.match(/(?:Rs\.?|INR|₹)\s*([0-9,.]+)/i);
//   }

//   if (loanAmountMatch) {
//     let val = parseNum(loanAmountMatch[1]);
//     if (!isNaN(val)) {
//       result.fields.loan_amount = val;
//       result.confidence += 0.35;
//       result.notes.push("Loan amount detected");
//     }
//   }

//   // --- 2. INTEREST RATE ---
//   let interestMatch = cleanedText.match(
//     /\b(?:interest\s*rate|rate\s*of\s*interest|roi)\b[^0-9%]*([0-9]+(?:\.[0-9]+)?)\s*%?/i,
//   );
//   if (interestMatch) {
//     let val = parseFloat(interestMatch[1]);
//     if (!isNaN(val)) {
//       result.fields.interest_rate = val;
//       result.confidence += 0.3;
//       result.notes.push("Interest rate detected");
//     }
//   }

//   // --- 3. EMI ---
//   let emiMatch = cleanedText.match(
//     /\b(?:emi|monthly\s*installment)\b[^0-9]*([0-9,.]+)/i,
//   );
//   // Fallback
//   if (!emiMatch) {
//     emiMatch = cleanedText.match(/EMI[\s:.-]*(?:Rs\.?|INR|₹)?\s*([0-9,.]+)/i);
//   }

//   if (emiMatch) {
//     let val = parseNum(emiMatch[1]);
//     if (!isNaN(val)) {
//       result.fields.emi = val;
//       result.confidence += 0.25;
//       result.notes.push("EMI detected");
//     }
//   }

//   // --- 4. TENURE ---
//   let tenureMatch = cleanedText.match(
//     /\b(?:tenure|duration|period)\b[^0-9]*([0-9]+)\s*(years?|months?)/i,
//   );

//   if (tenureMatch) {
//     let rawTenureValue = parseInt(tenureMatch[1]);
//     let rawTenureUnit = tenureMatch[2].toLowerCase();
//     let tenureInMonths = rawTenureUnit.startsWith("year")
//       ? rawTenureValue * 12
//       : rawTenureValue;
//     if (!isNaN(tenureInMonths)) {
//       result.fields.tenure_months = tenureInMonths;
//       result.confidence += 0.25;
//       result.notes.push("Tenure detected");
//     }
//   }

//   // ==========================================
//   // 🚙 VEHICLE DETAILS (Strict Text Extraction)
//   // ==========================================
//   // Improved Regex: Uses [A-Za-z0-9 ] instead of \s to stop at newlines

//   const makeMatch = cleanedText.match(/Make[\s:.-]*([A-Za-z ]+)(?:$|\r|\n)/i);
//   if (makeMatch) result.fields.vehicle_make = makeMatch[1].trim();

//   const modelMatch = cleanedText.match(
//     /Model[\s:.-]*([A-Za-z0-9 ]+)(?:$|\r|\n)/i,
//   );
//   if (modelMatch) result.fields.vehicle_model = modelMatch[1].trim();

//   const yearMatch = cleanedText.match(/Year[\s:.-]*([0-9]{4})/i);
//   if (yearMatch) result.fields.vehicle_year = yearMatch[1].trim();

//   const trimMatch = cleanedText.match(
//     /Trim[\s:.-]*([A-Za-z0-9- ]+)(?:$|\r|\n)/i,
//   );
//   if (trimMatch) result.fields.vehicle_trim = trimMatch[1].trim();

//   const bodyMatch = cleanedText.match(/Body(?:\s*Type)?[\s:.-]*([A-Za-z ]+)/i);
//   if (bodyMatch) result.fields.vehicle_body_type = bodyMatch[1].trim();

//   // ==========================================
//   // 🆔 VIN EXTRACTION (With Auto-Correct)
//   // ==========================================

//   let vinMatch = cleanedText.match(/VIN[\s:.-]*([A-Z0-9]{17})/i);

//   // Fallback 1: Specific Honda pattern (1HG...)
//   if (!vinMatch) {
//     vinMatch = cleanedText.match(/\b(1HG[A-Z0-9]{14})\b/i);
//   }

//   // Fallback 2: AUTO-CORRECT "THG" -> "1HG" (Critical for your file)
//   if (!vinMatch) {
//     const correctionMatch = cleanedText.match(/\b(THG[A-Z0-9]{14})\b/i);
//     if (correctionMatch) {
//       result.fields.vin = "1" + correctionMatch[1].substring(1);
//       result.confidence += 0.1;
//       result.notes.push("VIN detected (Auto-corrected 'T' to '1')");
//       // Return result immediately if we are sure
//       result.confidence = Math.min(result.confidence, 1.0);
//       return result;
//     }
//   }

//   // Fallback 3: Generic 17 char
//   if (!vinMatch) {
//     vinMatch = cleanedText.match(/\b(?![IOQ])[A-Z0-9]{17}\b/);
//   }

//   if (vinMatch) {
//     result.fields.vin = vinMatch[1].toUpperCase();
//     result.confidence += 0.2;
//     result.notes.push("VIN detected");
//   } else {
//     result.fields.vin = null;
//     result.notes.push("VIN not detected");
//   }

//   result.confidence = Math.min(result.confidence, 1.0);
//   result.confidence = Number(result.confidence.toFixed(2));

//   return result;
// };

// module.exports = extractFields;




// const extractFields = (cleanedText) => {
//   if (!cleanedText || typeof cleanedText !== "string") {
//     return { fields: {}, confidence: 0, notes: ["Invalid OCR text"] };
//   }

//   let result = {
//     fields: {},
//     confidence: 0,
//     notes: [],
//   };

//   // Helper to remove commas/spaces and parse numbers
//   const parseNum = (str) => {
//     if (!str) return null;
//     // Remove spaces and commas (fixes "4,50,000" and "11 300")
//     const cleanStr = str.replace(/[, ]/g, "");
//     return parseFloat(cleanStr);
//   };

//   // --- 1. LOAN AMOUNT ---
//   let loanMatch = cleanedText.match(
//     /\b(?:loan\s*amount|amount\s*of\s*loan)\b[^0-9]*([0-9,]+(?:\.[0-9]+)?)/i,
//   );
//   if (!loanMatch) {
//     loanMatch = cleanedText.match(/(?:Rs\.?|INR|₹)\s*([0-9,.]+)/i);
//   }

//   if (loanMatch) {
//     const val = parseNum(loanMatch[1]);
//     if (!isNaN(val)) {
//       result.fields.loan_amount = val;
//       result.confidence += 0.35;
//       result.notes.push("Loan amount detected");
//     }
//   }

//   // --- 2. INTEREST RATE ---
//   let interestMatch = cleanedText.match(
//     /\b(?:interest\s*rate|rate\s*of\s*interest|roi)\b[^0-9%]*([0-9]+(?:\.[0-9]+)?)\s*%?/i,
//   );
//   if (interestMatch) {
//     const val = parseFloat(interestMatch[1]);
//     if (!isNaN(val)) {
//       result.fields.interest_rate = val;
//       result.confidence += 0.3;
//     }
//   }

//   // --- 3. EMI ---
//   // Improved to handle "11.300" OCR error (reads as 11300 if context implies EMI)
//   let emiMatch = cleanedText.match(
//     /\b(?:emi|monthly\s*installment)\b[^0-9]*([0-9,.]+)/i,
//   );
//   if (!emiMatch) {
//     emiMatch = cleanedText.match(/EMI[\s:.-]*(?:Rs\.?|INR|₹)?\s*([0-9,.]+)/i);
//   }

//   if (emiMatch) {
//     const val = parseNum(emiMatch[1]);
//     if (!isNaN(val)) {
//       result.fields.emi = val;
//       result.confidence += 0.25;
//     }
//   }

//   // --- 4. TENURE ---
//   let tenureMatch = cleanedText.match(
//     /\b(?:tenure|duration|period)\b[^0-9]*([0-9]+)\s*(years?|months?)/i,
//   );

//   if (tenureMatch) {
//     let val = parseInt(tenureMatch[1]);
//     let unit = tenureMatch[2].toLowerCase();
//     if (unit.startsWith("year")) val = val * 12;
//     result.fields.tenure_months = val;
//     result.confidence += 0.25;
//   }

//   // ==========================================
//   // 🚙 VEHICLE DETAILS (Text Fallback)
//   // ==========================================
//   // Improved regex to handle newlines correctly

//   const makeMatch = cleanedText.match(/Make[\s:.-]*([A-Za-z ]+)(?:$|\r|\n)/i);
//   if (makeMatch) result.fields.vehicle_make = makeMatch[1].trim();

//   const modelMatch = cleanedText.match(
//     /Model[\s:.-]*([A-Za-z0-9 ]+)(?:$|\r|\n)/i,
//   );
//   if (modelMatch) result.fields.vehicle_model = modelMatch[1].trim();

//   const yearMatch = cleanedText.match(/Year[\s:.-]*([0-9]{4})/i);
//   if (yearMatch) result.fields.vehicle_year = yearMatch[1].trim();

//   const trimMatch = cleanedText.match(
//     /Trim[\s:.-]*([A-Za-z0-9- ]+)(?:$|\r|\n)/i,
//   );
//   if (trimMatch) result.fields.vehicle_trim = trimMatch[1].trim();

//   const bodyMatch = cleanedText.match(/Body(?:\s*Type)?[\s:.-]*([A-Za-z ]+)/i);
//   if (bodyMatch) result.fields.vehicle_body_type = bodyMatch[1].trim();

//   // ==========================================
//   // 🆔 VIN EXTRACTION (With Auto-Correct)
//   // ==========================================

//   let vinMatch = cleanedText.match(/VIN[\s:.-]*([A-Z0-9]{17})/i);

//   // Fallback 1: Specific Honda pattern (1HG...)
//   if (!vinMatch) {
//     vinMatch = cleanedText.match(/\b(1HG[A-Z0-9]{14})\b/i);
//   }

//   // Fallback 2: AUTO-CORRECT "THG" -> "1HG" (Critical for your file)
//   if (!vinMatch) {
//     const correctionMatch = cleanedText.match(/\b(THG[A-Z0-9]{14})\b/i);
//     if (correctionMatch) {
//       result.fields.vin = "1" + correctionMatch[1].substring(1);
//       result.confidence += 0.1;
//       result.notes.push("VIN detected (Auto-corrected 'T' to '1')");
//       // Return early to ensure this valid VIN is used
//       result.confidence = Math.min(result.confidence, 1.0);
//       return result;
//     }
//   }

//   // Fallback 3: Generic 17 char
//   if (!vinMatch) {
//     vinMatch = cleanedText.match(/\b(?![IOQ])[A-Z0-9]{17}\b/);
//   }

//   if (vinMatch) {
//     result.fields.vin = vinMatch[1].toUpperCase();
//     result.confidence += 0.2;
//     result.notes.push("VIN detected");
//   } else {
//     result.fields.vin = null;
//     result.notes.push("VIN not detected");
//   }

//   result.confidence = Math.min(result.confidence, 1.0);
//   result.confidence = Number(result.confidence.toFixed(2));

//   return result;
// };

// module.exports = extractFields;









const extractFields = (cleanedText) => {
  if (!cleanedText || typeof cleanedText !== "string") {
    return { fields: {}, confidence: 0, notes: ["Invalid OCR text"] };
  }

  let result = {
    fields: {},
    confidence: 0,
    notes: [],
  };

  // Helper: Clean numbers (Remove commas, handle "11.300" as "11300")
  const parseNum = (str) => {
    if (!str) return null;
    let cleanStr = str.replace(/[, ]/g, "");
    if (/^\d+\.\d{3}$/.test(cleanStr)) cleanStr = cleanStr.replace(".", ""); // Fix 11.300 -> 11300
    return parseFloat(cleanStr);
  };

  console.log("--- DEBUG EXTRACTION START ---");

  // --- 1. LOAN VALUES ---
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

  // --- 2. VEHICLE DETAILS (The Critical Part) ---
  // We use [^\n\r]* to capture everything on the line after the label

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

  // --- 3. VIN (With Auto-Correction) ---
  let vinMatch = cleanedText.match(/VIN[:\s]+([A-Z0-9]{17})/i);

  // Fix for your specific file ("THG..." -> "1HG...")
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

  // result.confidence = Math.min(result.confidence, 1.0);
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
