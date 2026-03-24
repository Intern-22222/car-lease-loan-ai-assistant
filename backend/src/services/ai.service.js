// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();

// // Initialize Gemini with your API Key
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const generateRecommendation = async (vehicleDetails, pricing, loanTerms) => {
//   try {
//     if (!process.env.GEMINI_API_KEY) {
//       console.warn("⚠️ AI Service: GEMINI_API_KEY is missing in .env");
//       return "AI Recommendation unavailable (Missing API Key).";
//     }

//     // 👇 UPDATED: Using the model explicitly found in your list
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//     const prompt = `
//       Act as a financial advisor. Analyze this vehicle loan deal:

//       Vehicle: ${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}
//       Market Fair Price: ₹${pricing.marketFairPrice}
//       Contract Price: ₹${pricing.contractPrice}
//       Interest Rate: ${loanTerms.interestRate}%
//       Tenure: ${loanTerms.tenureMonths} months

//       The deal is flagged as: ${pricing.verdict} (Score: ${pricing.score}/100).

//       Write a short, punchy recommendation (max 3 sentences) addressing the user directly.
//       1. Is this a bad deal? Why?
//       2. Suggest a specific counter-offer price.
//       3. Be urgent if the score is low.
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     return text;
//   } catch (error) {
//     console.error("❌ AI Generation Failed:", error.message);
//     return "Standard recommendation: Compare with other lenders to ensure the best rate.";
//   }
// };

// const extractHiddenFees = async (contractText) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Use your best model

//     // 1. Strict Prompting (The First Guard)
//     const prompt = `
//       Analyze the following vehicle loan contract text and extract ALL fees, charges, penalties, or add-ons.
//       Focus on finding "Junk Fees" (e.g., Doc Fee, Admin Fee, Origination Fee, Prepayment Penalty, Gap Insurance).

//       Return ONLY a JSON array. Do not write any other text.
//       Format:
//       [
//         {
//           "name": "Fee Name",
//           "amount": 0.00 (numeric, 0 if unknown),
//           "description": "Short reasoning",
//           "type": "Junk" or "Standard",
//           "sourceSnippet": "Exact 3-5 word phrase from text proving this fee exists"
//         }
//       ]

//       Contract Text:
//       "${contractText.substring(0, 15000)}" // Limit text length for safety
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response
//       .text()
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     let fees = JSON.parse(text);

//     // 2. 🛡️ HALLUCINATION GUARD (The Verification Step)
//     // We strictly check if the "sourceSnippet" actually exists in the original text.
//     // If the LLM quoted text that isn't there, it's hallucinating.

//     const verifiedFees = fees.map((fee) => {
//       // Normalize strings to ignore capitalization/spacing issues
//       const cleanSnippet = fee.sourceSnippet
//         .toLowerCase()
//         .replace(/\s+/g, " ")
//         .trim();
//       const cleanBody = contractText.toLowerCase().replace(/\s+/g, " ").trim();

//       const exists = cleanBody.includes(cleanSnippet);

//       return {
//         ...fee,
//         isVerified: exists, // ✅ TRUE = Real, ❌ FALSE = Hallucination
//       };
//     });

//     return verifiedFees;
//   } catch (error) {
//     console.error("❌ Fee Extraction Failed:", error.message);
//     return [];
//   }
// };

// const generateNegotiationEmail = async (
//   contractData,
//   recipientName,
//   userName,
// ) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `
//       Write a professional, firm, but polite counter-offer email for a vehicle loan negotiation.

//       Sender Name: ${userName}
//       Recipient Name: ${recipientName}

//       Contract Details:
//       - Vehicle: ${contractData.vehicleDetails?.make} ${contractData.vehicleDetails?.model}
//       - Offered Price: ₹${contractData.fields?.loan_amount}
//       - Market Fair Price: ₹${contractData.pricingAnalysis?.marketFairPrice}
//       - Interest Rate: ${contractData.fields?.interest_rate}%

//       Key Arguments:
//       1. The price is above market value by approx ₹${contractData.pricingAnalysis?.difference}.
//       2. Mention any hidden fees if they exist (Junk fees).
//       3. Ask to match the market price or lower the interest rate.

//       Format:
//       Subject: [Write a compelling subject line]

//       [Body of the email]
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     return response.text();
//   } catch (error) {
//     console.error("Email Gen Error:", error);
//     return "Error generating email. Please write manually.";
//   }
// };

// module.exports = { generateRecommendation,extractHiddenFees,generateNegotiationEmail};

/****************STABLE   ONENEENENE */

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();

// // Initialize Gemini with your API Key
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // ✅ 1. General Recommendation (Dashboard)
// const generateRecommendation = async (vehicleDetails, pricing, loanTerms) => {
//   try {
//     if (!process.env.GEMINI_API_KEY) {
//       console.warn("⚠️ AI Service: GEMINI_API_KEY is missing in .env");
//       return "AI Recommendation unavailable (Missing API Key).";
//     }

//     // 👇 FIXED: Using the stable alias from your list
//     const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

//     const prompt = `
//       Act as a financial advisor. Analyze this vehicle loan deal:

//       Vehicle: ${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}
//       Market Fair Price: ₹${pricing.marketFairPrice}
//       Contract Price: ₹${pricing.contractPrice}
//       Interest Rate: ${loanTerms.interestRate}%
//       Tenure: ${loanTerms.tenureMonths} months

//       The deal is flagged as: ${pricing.verdict} (Score: ${pricing.score}/100).

//       Write a short, punchy recommendation (max 3 sentences) addressing the user directly.
//       1. Is this a bad deal? Why?
//       2. Suggest a specific counter-offer price.
//       3. Be urgent if the score is low.
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     return response.text();
//   } catch (error) {
//     console.error("❌ AI Generation Failed:", error.message);
//     return "Standard recommendation: Compare with other lenders to ensure the best rate.";
//   }
// };

// // ✅ 2. Hidden Fee Extraction (Comparison Page)
// const extractHiddenFees = async (contractText) => {
//   try {
//     // 👇 FIXED: Using the stable alias
//     const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

//     // 1. Strict Prompting (The First Guard)
//     const prompt = `
//       Analyze the following vehicle loan contract text and extract ALL fees, charges, penalties, or add-ons.
//       Focus on finding "Junk Fees" (e.g., Doc Fee, Admin Fee, Origination Fee, Prepayment Penalty, Gap Insurance).

//       Return ONLY a JSON array. Do not write any other text.
//       Format:
//       [
//         {
//           "name": "Fee Name",
//           "amount": 0.00 (numeric, 0 if unknown),
//           "description": "Short reasoning",
//           "type": "Junk" or "Standard",
//           "sourceSnippet": "Exact 3-5 word phrase from text proving this fee exists"
//         }
//       ]

//       Contract Text:
//       "${contractText.substring(0, 15000)}" // Limit text length for safety
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response
//       .text()
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     let fees = JSON.parse(text);

//     // 2. 🛡️ HALLUCINATION GUARD (Verification)
//     const verifiedFees = fees.map((fee) => {
//       const cleanSnippet = fee.sourceSnippet
//         .toLowerCase()
//         .replace(/\s+/g, " ")
//         .trim();
//       const cleanBody = contractText.toLowerCase().replace(/\s+/g, " ").trim();
//       const exists = cleanBody.includes(cleanSnippet);

//       return {
//         ...fee,
//         isVerified: exists, // ✅ TRUE = Real, ❌ FALSE = Hallucination
//       };
//     });

//     return verifiedFees;
//   } catch (error) {
//     console.error("❌ Fee Extraction Failed:", error.message);
//     return [];
//   }
// };

// // ✅ 3. Email Generator (Negotiation Page)
// const generateNegotiationEmail = async (
//   contractData,
//   recipientName,
//   userName,
// ) => {
//   try {
//     // 👇 FIXED: Using the stable alias
//     const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

//     const prompt = `
//       Write a professional, firm, but polite counter-offer email for a vehicle loan negotiation.

//       Sender Name: ${userName}
//       Recipient Name: ${recipientName}

//       Contract Details:
//       - Vehicle: ${contractData.vehicleDetails?.make} ${contractData.vehicleDetails?.model}
//       - Offered Price: ₹${contractData.fields?.loan_amount}
//       - Market Fair Price: ₹${contractData.pricingAnalysis?.marketFairPrice}
//       - Interest Rate: ${contractData.fields?.interest_rate}%

//       Key Arguments:
//       1. The price is above market value by approx ₹${contractData.pricingAnalysis?.difference}.
//       2. Mention any hidden fees if they exist (Junk fees).
//       3. Ask to match the market price or lower the interest rate.

//       Format:
//       Subject: [Write a compelling subject line]

//       [Body of the email]
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     return response.text();
//   } catch (error) {
//     console.error("Email Gen Error:", error.message);
//     return "Subject: Counter Offer\n\nError generating AI draft. Please write manually.";
//   }
// };

// const chatWithAI = async (message, contextData = null) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

//     // Construct Context String if data exists
//     let contextPrompt = "";
//     if (contextData) {
//       contextPrompt = `
//         CURRENT CONTRACT CONTEXT:
//         - Vehicle: ${contextData.vehicleDetails?.make || "Unknown"} ${contextData.vehicleDetails?.model || ""}
//         - Price: ₹${contextData.fields?.loan_amount || 0}
//         - Interest: ${contextData.fields?.interest_rate || 0}%
//         - Hidden Fees Found: ${contextData.hiddenFees?.fees?.map((f) => f.name).join(", ") || "None"}

//         INSTRUCTION: The user is looking at this contract right now. Use these details to answer specific questions.
//       `;
//     }

//     const prompt = `
//       System: You are "AutoLoan Bot", a tough negotiation coach and financial advisor.

//       ${contextPrompt}

//       User Message: "${message}"

//       Task:
//       1. If the user asks about the contract, use the context provided.
//       2. If the user wants to "Roleplay" or "Practice", pretend you are the Car Dealer. Be tough, use sales tactics, and let the user try to negotiate the price down.
//       3. Otherwise, answer general car loan questions briefly.
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     return response.text();
//   } catch (error) {
//     console.error("Chat Error:", error.message);
//     return "I'm having trouble connecting to the negotiation server. Please try again.";
//   }
// };

// // const parseContractTerms = async (contractText) => {
// //   try {
// //     const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// //     const prompt = `
// //       Analyze the following car lease/loan agreement text.
// //       Extract the following specific details into a valid JSON object.
// //       If a field is not found, return null or "Not Specified".

// //       REQUIRED FIELDS:
// //       1. loan_amount (Number)
// //       2. interest_rate (Number, e.g., 9.5)
// //       3. tenure_months (Number)
// //       4. monthly_payment (Number, EMI)
// //       5. down_payment (Number)
// //       6. residual_value (Number - mainly for leases)
// //       7. mileage_allowance (String, e.g., "12,000 km/year")
// //       8. early_termination_fee (String, summary of cost)
// //       9. purchase_option_price (Number or String)
// //       10. maintenance_responsibilities (String summary)
// //       11. warranty_coverage (String summary)
// //       12. late_payment_penalty (String summary)

// //       Return ONLY raw JSON. No markdown formatting.

// //       Contract Text:
// //       "${contractText.substring(0, 20000)}"
// //     `;

// //     const result = await model.generateContent(prompt);
// //     const response = await result.response;
// //     const text = response
// //       .text()
// //       .replace(/```json/g, "")
// //       .replace(/```/g, "")
// //       .trim();

// //     return JSON.parse(text);
// //   } catch (error) {
// //     console.error("AI Parse Error:", error);
// //     return {};
// //   }
// // };

// // ✅ UPDATED: More Robust Extraction (Allowing Strings)
// const parseContractTerms = async (contractText) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

//     const prompt = `
//       Analyze the vehicle lease/loan agreement text below.
//       Extract values EXACTLY as they appear in the text (keep 'Rs', '%', commas).

//       Return a JSON object with these keys:
//       1. loan_amount (e.g., "Rs 15,00,000")
//       2. interest_rate (e.g., "10.5%")
//       3. tenure_months (e.g., "60 Months")
//       4. monthly_payment (e.g., "Rs 32,250")
//       5. down_payment (e.g., "Rs 2,00,000")
//       6. residual_value
//       7. mileage_allowance
//       8. early_termination_fee
//       9. purchase_option_price
//       10. maintenance_responsibilities
//       11. warranty_coverage
//       12. late_payment_penalty

//       If a field is not found, return string "Not Specified".

//       Contract Text:
//       "${contractText.substring(0, 20000)}"
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();

//     return JSON.parse(text);

//   } catch (error) {
//     console.error("AI Parse Error:", error);
//     return {};
//   }
// };

// module.exports = {
//   parseContractTerms, // 👈 Must be here
//   generateRecommendation, // 👈 Must be here
//   extractHiddenFees,
//   generateNegotiationEmail,
//   chatWithAI,
// };

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();

// // Initialize Gemini
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // 🛠️ HELPER: Cleans AI Output to ensure valid JSON
// const cleanAndParseJSON = (text) => {
//   try {
//     // 1. Remove Markdown code blocks
//     let cleanText = text
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     // 2. Find the first '{' and last '}' to ignore conversational text
//     const firstOpen = cleanText.indexOf("{");
//     const lastClose = cleanText.lastIndexOf("}");

//     if (firstOpen !== -1 && lastClose !== -1) {
//       cleanText = cleanText.substring(firstOpen, lastClose + 1);
//     }

//     return JSON.parse(cleanText);
//   } catch (error) {
//     console.error("JSON Parse Error on text:", text);
//     return {}; // Return empty object instead of crashing
//   }
// };

// // ✅ 1. General Recommendation
// const generateRecommendation = async (vehicleDetails, pricing, loanTerms) => {
//   try {
//     if (!process.env.GEMINI_API_KEY) {
//       return "AI Recommendation unavailable (Missing API Key).";
//     }

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `
//       Act as a financial advisor. Analyze this vehicle loan deal:
//       Vehicle: ${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}
//       Market Fair Price: ₹${pricing.marketFairPrice}
//       Contract Price: ₹${pricing.contractPrice}
//       Interest Rate: ${loanTerms.interestRate}%
//       Tenure: ${loanTerms.tenureMonths} months
//       Score: ${pricing.score}/100.

//       Write a short, punchy recommendation (max 3 sentences).
//       1. Is this a bad deal?
//       2. Suggest a counter-offer.
//       3. Be urgent if score is low.
//     `;

//     const result = await model.generateContent(prompt);
//     return result.response.text();
//   } catch (error) {
//     console.error("AI Recommendation Failed:", error.message);
//     return "Compare with other lenders to ensure the best rate.";
//   }
// };

// // ✅ 2. Hidden Fee Extraction
// const extractHiddenFees = async (contractText) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `
//       Analyze this contract text. Extract ALL fees, charges, penalties.
//       Return ONLY a JSON array. Format:
//       [ { "name": "Fee Name", "amount": 0, "description": "Reason", "type": "Junk" or "Standard", "sourceSnippet": "Proof" } ]

//       Contract Text:
//       "${contractText.substring(0, 15000)}"
//     `;

//     const result = await model.generateContent(prompt);
//     const fees = cleanAndParseJSON(result.response.text());

//     // Validation (Hallucination Check)
//     if (!Array.isArray(fees)) return [];

//     return fees.map((fee) => {
//       const exists = contractText
//         .toLowerCase()
//         .includes(fee.sourceSnippet?.toLowerCase().trim());
//       return { ...fee, isVerified: exists };
//     });
//   } catch (error) {
//     console.error("Fee Extraction Failed:", error.message);
//     return [];
//   }
// };

// // ✅ 3. Email Generator
// const generateNegotiationEmail = async (
//   contractData,
//   recipientName,
//   userName,
// ) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `
//       Write a counter-offer email.
//       Sender: ${userName}, Recipient: ${recipientName}
//       Vehicle: ${contractData.vehicleDetails?.make}
//       Offer: ${contractData.fields?.loan_amount}, Fair: ${contractData.pricingAnalysis?.marketFairPrice}
//       Context: Price is too high.
//     `;

//     const result = await model.generateContent(prompt);
//     return result.response.text();
//   } catch (error) {
//     console.error("Email Gen Error:", error.message);
//     return "Error generating email.";
//   }
// };

// // ✅ 4. Chatbot
// const chatWithAI = async (message, contextData = null) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     let contextPrompt = "";
//     if (contextData) {
//       contextPrompt = `Context: Vehicle ${contextData.vehicleDetails?.make}, Price ${contextData.fields?.loan_amount}.`;
//     }

//     const prompt = `
//       System: You are a tough negotiation coach.
//       ${contextPrompt}
//       User: "${message}"
//     `;

//     const result = await model.generateContent(prompt);
//     return result.response.text();
//   } catch (error) {
//     console.error("Chat Error:", error.message);
//     return "Service unavailable.";
//   }
// };

// // ✅ 5. Contract Parsing (ROBUST)
// const parseContractTerms = async (contractText) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `
//       Analyze the vehicle lease/loan agreement text below.
//       Extract values EXACTLY as they appear in the text (keep 'Rs', '%', commas).

//       Return a JSON object with these keys:
//       1. loan_amount (e.g., "Rs 15,00,000")
//       2. interest_rate (e.g., "10.5%")
//       3. tenure_months (e.g., "60 Months")
//       4. monthly_payment (e.g., "Rs 32,250")
//       5. down_payment (e.g., "Rs 2,00,000")
//       6. residual_value
//       7. mileage_allowance
//       8. early_termination_fee
//       9. purchase_option_price
//       10. maintenance_responsibilities
//       11. warranty_coverage
//       12. late_payment_penalty

//       If a field is not found, return string "Not Specified".

//       Contract Text:
//       "${contractText.substring(0, 20000)}"
//     `;

//     const result = await model.generateContent(prompt);

//     // 👇 SAFE PARSING: Handles cases where AI adds text before/after JSON
//     return cleanAndParseJSON(result.response.text());
//   } catch (error) {
//     console.error("AI Parse Error:", error);
//     return {};
//   }
// };

// module.exports = {
//   parseContractTerms,
//   generateRecommendation,
//   extractHiddenFees,
//   generateNegotiationEmail,
//   chatWithAI,
// };

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();

// // Initialize Gemini
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // 👇 CONFIG: Use the specific version ID to avoid 404s
// const MODEL_NAME = "gemini-1.5-flash-001";

// // 🛠️ HELPER: Cleans AI Output to ensure valid JSON
// const cleanAndParseJSON = (text) => {
//   try {
//     // 1. Remove Markdown code blocks
//     let cleanText = text
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     // 2. Find the first '{' and last '}' to ignore conversational text
//     const firstOpen = cleanText.indexOf("{");
//     const lastClose = cleanText.lastIndexOf("}");

//     if (firstOpen !== -1 && lastClose !== -1) {
//       cleanText = cleanText.substring(firstOpen, lastClose + 1);
//     }

//     return JSON.parse(cleanText);
//   } catch (error) {
//     console.error("JSON Parse Error on text:", text);
//     return {};
//   }
// };

// // ✅ 1. General Recommendation
// const generateRecommendation = async (vehicleDetails, pricing, loanTerms) => {
//   try {
//     if (!process.env.GEMINI_API_KEY) return "AI Key Missing.";

//     const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//     const prompt = `
//       Act as a financial advisor. Analyze this vehicle loan deal:
//       Vehicle: ${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}
//       Market Fair Price: ₹${pricing.marketFairPrice}
//       Contract Price: ₹${pricing.contractPrice}
//       Interest Rate: ${loanTerms.interestRate}%
//       Tenure: ${loanTerms.tenureMonths} months
//       Score: ${pricing.score}/100.

//       Write a short, punchy recommendation (max 3 sentences).
//     `;

//     const result = await model.generateContent(prompt);
//     return result.response.text();
//   } catch (error) {
//     console.error("AI Rec Error:", error.message);
//     return "Standard recommendation: Compare with other lenders.";
//   }
// };

// // ✅ 2. Hidden Fee Extraction
// const extractHiddenFees = async (contractText) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//     const prompt = `
//       Analyze this contract text. Extract ALL fees, charges, penalties.
//       Return ONLY a JSON array. Format:
//       [ { "name": "Fee Name", "amount": 0, "description": "Reason", "type": "Junk" or "Standard", "sourceSnippet": "Proof" } ]

//       Contract Text:
//       "${contractText.substring(0, 15000)}"
//     `;

//     const result = await model.generateContent(prompt);
//     const fees = cleanAndParseJSON(result.response.text());

//     if (!Array.isArray(fees)) return [];

//     return fees.map((fee) => {
//       const exists = contractText
//         .toLowerCase()
//         .includes(fee.sourceSnippet?.toLowerCase().trim());
//       return { ...fee, isVerified: exists };
//     });
//   } catch (error) {
//     console.error("Fee Extraction Error:", error.message);
//     return [];
//   }
// };

// // ✅ 3. Email Generator
// const generateNegotiationEmail = async (
//   contractData,
//   recipientName,
//   userName,
// ) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//     const prompt = `
//       Write a counter-offer email.
//       Sender: ${userName}, Recipient: ${recipientName}
//       Vehicle: ${contractData.vehicleDetails?.make}
//       Offer: ${contractData.fields?.loan_amount}, Fair: ${contractData.pricingAnalysis?.marketFairPrice}
//       Context: Price is too high.
//     `;

//     const result = await model.generateContent(prompt);
//     return result.response.text();
//   } catch (error) {
//     console.error("Email Gen Error:", error.message);
//     return "Error generating email.";
//   }
// };

// // ✅ 4. Chatbot
// const chatWithAI = async (message, contextData = null) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//     let contextPrompt = "";
//     if (contextData) {
//       contextPrompt = `Context: Vehicle ${contextData.vehicleDetails?.make}, Price ${contextData.fields?.loan_amount}.`;
//     }

//     const prompt = `
//       System: You are a tough negotiation coach.
//       ${contextPrompt}
//       User: "${message}"
//     `;

//     const result = await model.generateContent(prompt);
//     return result.response.text();
//   } catch (error) {
//     console.error("Chat Error:", error.message);
//     return "Service unavailable.";
//   }
// };

// // ✅ 5. Contract Parsing (ROBUST)
// const parseContractTerms = async (contractText) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//     const prompt = `
//       Analyze the vehicle lease/loan agreement text below.
//       Extract values EXACTLY as they appear in the text (keep 'Rs', '%', commas).

//       Return a JSON object with these keys:
//       1. loan_amount (e.g., "Rs 15,00,000")
//       2. interest_rate (e.g., "10.5%")
//       3. tenure_months (e.g., "60 Months")
//       4. monthly_payment (e.g., "Rs 32,250")
//       5. down_payment (e.g., "Rs 2,00,000")
//       6. residual_value
//       7. mileage_allowance
//       8. early_termination_fee
//       9. purchase_option_price
//       10. maintenance_responsibilities
//       11. warranty_coverage
//       12. late_payment_penalty

//       If a field is not found, return string "Not Specified".

//       Contract Text:
//       "${contractText.substring(0, 20000)}"
//     `;

//     const result = await model.generateContent(prompt);
//     return cleanAndParseJSON(result.response.text());
//   } catch (error) {
//     console.error("AI Parse Error:", error.message);
//     return {};
//   }
// };

// module.exports = {
//   parseContractTerms,
//   generateRecommendation,
//   extractHiddenFees,
//   generateNegotiationEmail,
//   chatWithAI,
// };

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();

// // Initialize Gemini
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // Use standard model
// const MODEL_NAME = "gemini-1.5-flash-001";

// const cleanAndParseJSON = (text) => {
//   try {
//     let cleanText = text
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();
//     const firstOpen = cleanText.indexOf("{");
//     const lastClose = cleanText.lastIndexOf("}");
//     if (firstOpen !== -1 && lastClose !== -1) {
//       cleanText = cleanText.substring(firstOpen, lastClose + 1);
//     }
//     return JSON.parse(cleanText);
//   } catch (error) {
//     return {};
//   }
// };

// // ✅ ROBUST PARSE CONTRACT
// const parseContractTerms = async (contractText) => {
//   try {
//     if (!process.env.GEMINI_API_KEY) return {}; // Skip if no key

//     const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//     const prompt = `
//       Analyze the vehicle lease/loan agreement text below.
//       Extract values EXACTLY as they appear in the text (keep 'Rs', '%', commas).
//       Return JSON: loan_amount, interest_rate, tenure_months, monthly_payment, down_payment, residual_value, mileage_allowance, early_termination_fee, purchase_option_price, maintenance_responsibilities, warranty_coverage, late_payment_penalty.

//       Contract Text:
//       "${contractText.substring(0, 20000)}"
//     `;

//     const result = await model.generateContent(prompt);
//     return cleanAndParseJSON(result.response.text());
//   } catch (error) {
//     // ⚠️ SILENT FAIL: Return empty so the Regex Fallback in route can work
//     console.error(
//       "AI Service Error (Using Regex Fallback):",
//       error.message.split("[")[0],
//     );
//     return {};
//   }
// };

// const generateRecommendation = async (vehicleDetails, pricing, loanTerms) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: MODEL_NAME });
//     const prompt = `Analyze car loan: ${pricing.contractPrice} vs fair ${pricing.marketFairPrice}. Rate ${loanTerms.interestRate}%. Give short advice.`;
//     const result = await model.generateContent(prompt);
//     return result.response.text();
//   } catch (error) {
//     return "Market analysis unavailable.";
//   }
// };

// // Dummy exports for others to prevent crashes
// const extractHiddenFees = async () => [];
// const generateNegotiationEmail = async () => "AI Unavailable";
// const chatWithAI = async () => "AI Unavailable";

// module.exports = {
//   parseContractTerms,
//   generateRecommendation,
//   extractHiddenFees,
//   generateNegotiationEmail,
//   chatWithAI,
// };

// const OpenAI = require("openai");
// require("dotenv").config();

// // Initialize OpenRouter
// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENROUTER_API_KEY,
//   defaultHeaders: {
//     "HTTP-Referer": "http://localhost:3000",
//     "X-Title": "Car Lease AI",
//   },
// });

// // Using Meta Llama 3.1 (Fast & Free)
// const MODEL_NAME = "meta-llama/llama-3.1-8b-instruct";

// // 🛠️ HELPER: Cleans AI Output to ensure valid JSON
// const cleanAndParseJSON = (text) => {
//   try {
//     if (!text) return {};
//     let cleanText = text
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     // Find JSON bounds
//     const firstOpen = cleanText.indexOf("{");
//     const lastOpen = cleanText.indexOf("[");
//     const lastCloseCurly = cleanText.lastIndexOf("}");
//     const lastCloseSquare = cleanText.lastIndexOf("]");

//     // Detect if Object or Array
//     if (firstOpen !== -1 && lastCloseCurly !== -1 && firstOpen < lastOpen) {
//       cleanText = cleanText.substring(firstOpen, lastCloseCurly + 1);
//     } else if (lastOpen !== -1 && lastCloseSquare !== -1) {
//       cleanText = cleanText.substring(lastOpen, lastCloseSquare + 1);
//     }

//     return JSON.parse(cleanText);
//   } catch (error) {
//     console.error("JSON Parse Error:", error.message);
//     return {};
//   }
// };

// // ✅ 1. Contract Parsing (OCR)
// const parseContractTerms = async (contractText) => {
//   try {
//     if (!process.env.OPENROUTER_API_KEY) return {};

//     const completion = await openai.chat.completions.create({
//       model: MODEL_NAME,
//       messages: [
//         {
//           role: "system",
//           content: "You are an OCR assistant. Output only valid JSON.",
//         },
//         {
//           role: "user",
//           content: `
//             Extract contract details into JSON:
//             loan_amount, interest_rate, tenure_months, monthly_payment,
//             down_payment, residual_value, mileage_allowance, early_termination_fee,
//             purchase_option_price, maintenance_responsibilities, warranty_coverage, late_payment_penalty.

//             Keep original units (e.g. "Rs 15,00,000", "10.5%").
//             If not found, use "Not Specified".

//             Text: "${contractText.substring(0, 10000)}"
//           `,
//         },
//       ],
//     });

//     return cleanAndParseJSON(completion.choices[0].message.content);
//   } catch (error) {
//     console.error("AI Parse Error:", error.message);
//     return {};
//   }
// };

// // ✅ 2. Recommendation Generator
// const generateRecommendation = async (vehicleDetails, pricing, loanTerms) => {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: MODEL_NAME,
//       messages: [
//         {
//           role: "user",
//           content: `
//             Act as a financial advisor. Analyze this vehicle loan:
//             Vehicle: ${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}
//             Price: ${pricing.contractPrice} (Market Fair Price: ${pricing.marketFairPrice})
//             Interest: ${loanTerms.interestRate}%

//             Write a short, punchy recommendation (max 3 sentences).
//             Advise if they should buy, negotiate, or walk away.
//           `,
//         },
//       ],
//     });
//     return completion.choices[0].message.content;
//   } catch (error) {
//     return "Standard recommendation: Compare with other lenders to ensure the best rate.";
//   }
// };

// // ✅ 3. Hidden Fee Extraction
// const extractHiddenFees = async (contractText) => {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: MODEL_NAME,
//       messages: [
//         {
//           role: "user",
//           content: `
//             Extract ALL fees, charges, and penalties from this text.
//             Return ONLY a JSON array. Format:
//             [ { "name": "Fee Name", "amount": 0, "description": "Reason", "type": "Junk" or "Standard", "sourceSnippet": "Proof" } ]

//             Contract Text:
//             "${contractText.substring(0, 10000)}"
//           `,
//         },
//       ],
//     });

//     const fees = cleanAndParseJSON(completion.choices[0].message.content);
//     return Array.isArray(fees) ? fees : [];
//   } catch (error) {
//     console.error("Fee Extract Error:", error.message);
//     return [];
//   }
// };

// // ✅ 4. Negotiation Email Generator
// const generateNegotiationEmail = async (
//   contractData,
//   recipientName,
//   userName,
// ) => {
//   try {
//     // Safely access nested properties
//     const make = contractData.vehicleDetails?.make || "Vehicle";
//     const price = contractData.fields?.loan_amount || "the quoted price";
//     const fairPrice =
//       contractData.pricingAnalysis?.marketFairPrice || "market value";

//     const completion = await openai.chat.completions.create({
//       model: MODEL_NAME,
//       messages: [
//         {
//           role: "user",
//           content: `
//             Write a professional, firm negotiation email.
//             Sender: ${userName}
//             Recipient: ${recipientName}
//             Topic: Car Loan for ${make}
//             Context: The quoted price is ${price}, but market fair price is ${fairPrice}.
//             Goal: Ask to match the market price or lower the interest rate.
//           `,
//         },
//       ],
//     });
//     return completion.choices[0].message.content;
//   } catch (error) {
//     console.error("Email Gen Error:", error.message);
//     return "Subject: Counter Offer\n\nError generating email. Please draft manually.";
//   }
// };

// // ✅ 5. Chatbot
// const chatWithAI = async (message, contextData = null) => {
//   try {
//     let contextPrompt = "";
//     if (contextData) {
//       contextPrompt = `
//         CONTEXT:
//         Vehicle: ${contextData.vehicleDetails?.make || "Unknown"}
//         Price: ${contextData.fields?.loan_amount || "Unknown"}
//         Hidden Fees: ${(contextData.hiddenFees?.fees || []).map((f) => f.name).join(", ")}
//         `;
//     }

//     const completion = await openai.chat.completions.create({
//       model: MODEL_NAME,
//       messages: [
//         {
//           role: "system",
//           content: `You are a tough negotiation coach. ${contextPrompt}`,
//         },
//         { role: "user", content: message },
//       ],
//     });

//     return completion.choices[0].message.content;
//   } catch (error) {
//     return "I'm having trouble connecting right now. Please try again.";
//   }
// };

// module.exports = {
//   parseContractTerms,
//   generateRecommendation,
//   extractHiddenFees,
//   generateNegotiationEmail,
//   chatWithAI,
// };

// const OpenAI = require("openai");
// require("dotenv").config();

// // Initialize OpenRouter
// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENROUTER_API_KEY,
//   defaultHeaders: {
//     "HTTP-Referer": "http://localhost:3000",
//     "X-Title": "Car Lease AI",
//   },
// });

// const MODEL_NAME = "meta-llama/llama-3.1-8b-instruct";

// // 🛠️ HELPER: Robust JSON Parser (Fixes Single Quotes Issue)
// const cleanAndParseJSON = (text) => {
//   try {
//     if (!text) return [];

//     // 1. Strip Markdown Code Blocks
//     let cleanText = text
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     // 2. Extract JSON Array/Object only
//     const firstOpen = cleanText.indexOf("{");
//     const lastOpen = cleanText.indexOf("[");
//     const lastCloseCurly = cleanText.lastIndexOf("}");
//     const lastCloseSquare = cleanText.lastIndexOf("]");

//     // Prioritize Array extraction if square brackets exist
//     if (lastOpen !== -1 && lastCloseSquare !== -1) {
//       cleanText = cleanText.substring(lastOpen, lastCloseSquare + 1);
//     } else if (firstOpen !== -1 && lastCloseCurly !== -1) {
//       cleanText = cleanText.substring(firstOpen, lastCloseCurly + 1);
//     }

//     // 3. FIX SINGLE QUOTES (The main source of your crash)
//     // This replaces 'key': 'value' with "key": "value"
//     // Note: It's a simple heuristic, usually sufficient for AI output
//     if (cleanText.includes("'")) {
//       cleanText = cleanText
//         .replace(/([a-zA-Z0-9_]+?):/g, '"$1":') // Fix keys
//         .replace(/'/g, '"'); // Fix values
//     }

//     return JSON.parse(cleanText);
//   } catch (error) {
//     console.error("JSON Parse Failed on:", text.substring(0, 50));
//     return []; // Return empty array on failure to prevent DB crash
//   }
// };

// ✅ 1. Contract Parsing
// const parseContractTerms = async (contractText) => {
//   try {
//     if (!process.env.OPENROUTER_API_KEY) return {};

//     const completion = await openai.chat.completions.create({
//       model: MODEL_NAME,
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an OCR assistant. Output STRICT VALID JSON with DOUBLE QUOTES.",
//         },
//         {
//           role: "user",
//           content: `
//             Extract contract details into JSON.
//             Keys: loan_amount, interest_rate, tenure_months, monthly_payment, 
//             down_payment, residual_value, mileage_allowance, early_termination_fee, 
//             purchase_option_price, maintenance_responsibilities, warranty_coverage, late_payment_penalty.
            
//             Use "Not Specified" if missing.
            
//             Text: "${contractText.substring(0, 8000)}"
//           `,
//         },
//       ],
//     });

//     const result = cleanAndParseJSON(completion.choices[0].message.content);
//     return Array.isArray(result) ? {} : result; // Ensure Object
//   } catch (error) {
//     return {};
//   }
// };



// // ✅ 1. Contract Parsing (UPDATED to include Summary)
// const parseContractTerms = async (contractText) => {
//   try {
//     if (!process.env.OPENROUTER_API_KEY) return {};

//     const completion = await openai.chat.completions.create({
//       model: MODEL_NAME,
//       messages: [
//         {
//           role: "system",
//           content: "You are an OCR assistant. Output STRICT VALID JSON with DOUBLE QUOTES.",
//         },
//         {
//           role: "user",
//           content: `
//             Extract contract details into JSON.
            
//             REQUIRED KEYS: 
//             loan_amount, interest_rate, tenure_months, monthly_payment, 
//             down_payment, residual_value, mileage_allowance, early_termination_fee, 
//             purchase_option_price, maintenance_responsibilities, warranty_coverage, late_payment_penalty.

//             NEW KEY:
//             "summary": "Provide a 2-sentence summary of any non-financial clauses found (e.g., SLAs, Escalation Matrix, Support hours, or Insurance requirements)."
            
//             Use "Not Specified" if a field is missing.
            
//             Text: "${contractText.substring(0, 8000)}"
//           `,
//         },
//       ],
//     });

//     const result = cleanAndParseJSON(completion.choices[0].message.content);
//     return Array.isArray(result) ? {} : result; // Ensure Object
//   } catch (error) {
//     return {};
//   }
// };


// // ✅ 2. Recommendation
// const generateRecommendation = async (vehicleDetails, pricing, loanTerms) => {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: MODEL_NAME,
//       messages: [
//         {
//           role: "user",
//           content: `
//             Act as a financial advisor. Analyze this deal:
//             Price: ${pricing.contractPrice} (Fair: ${pricing.marketFairPrice}).
//             Interest: ${loanTerms.interestRate}%.
            
//             Give a 2-sentence recommendation.
//           `,
//         },
//       ],
//     });
//     return completion.choices[0].message.content;
//   } catch (error) {
//     return "Compare quotes.";
//   }
// };

// // ✅ 3. Hidden Fees (The Crash Fix)
// const extractHiddenFees = async (contractText) => {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: MODEL_NAME,
//       messages: [
//         {
//           role: "system",
//           content: "Output STRICT JSON Array. Use DOUBLE QUOTES only.",
//         },
//         {
//           role: "user",
//           content: `
//             Extract fees as a JSON Array:
//             [ { "name": "Fee Name", "amount": 0, "description": "Reason", "type": "Junk" or "Standard" } ]
            
//             Text: "${contractText.substring(0, 8000)}"
//           `,
//         },
//       ],
//     });

//     const result = cleanAndParseJSON(completion.choices[0].message.content);
//     return Array.isArray(result) ? result : []; // Ensure Array
//   } catch (error) {
//     return [];
//   }
// };

// // ✅ 4. Email
// const generateNegotiationEmail = async (
//   contractData,
//   recipientName,
//   userName,
// ) => {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: MODEL_NAME,
//       messages: [
//         {
//           role: "user",
//           content: `Write a negotiation email from ${userName} to ${recipientName} regarding a car loan.`,
//         },
//       ],
//     });
//     return completion.choices[0].message.content;
//   } catch (error) {
//     return "Error generating draft.";
//   }
// };

// // ✅ 5. Chat
// // const chatWithAI = async (message, contextData = null) => {
// //   try {
// //     const completion = await openai.chat.completions.create({
// //       model: MODEL_NAME,
// //       messages: [
// //         { role: "system", content: "You are a helpful car buying coach." },
// //         { role: "user", content: message },
// //       ],
// //     });
// //     return completion.choices[0].message.content;
// //   } catch (error) {
// //     return "Service unavailable.";
// //   }
// // };


// // ✅ 5. Chat (Context-Aware + Navigation Knowledge)
// const chatWithAI = async (message, contextData = null) => {
//   try {
//     // 👇 BASE KNOWLEDGE: Teach the AI about the App's features
//     let systemPrompt = `
//       You are the AI Assistant for 'AutoLoan AI'.
//       Your goal is to help users negotiate car loans and navigate this application.

//       APP NAVIGATION GUIDE:
//       1. **To Compare Contracts**: Go to the 'History' page, select 2 or 3 contracts by clicking them, and click the 'Compare Selected' button.
//       2. **To Analyze a New Contract**: Go to the 'Home' (Upload) page and drop your PDF.
//       3. **To Draft Emails**: Go to the 'Email Generator' page.
//       4. **To View Past Analysis**: Click on 'History' in the navigation bar.

//       NEGOTIATION BASICS:
//       - Always advise users to negotiate the interest rate and remove junk fees.
//       - A "Fairness Score" below 50 means the deal is bad.
//     `;

//     // 👇 SPECIFIC CONTEXT (If user is looking at a specific file)
//     if (contextData) {
//       systemPrompt += `
      
//       CURRENT CONTEXT (The user is viewing a specific contract):
//       - Vehicle: ${contextData.vehicle || "Unknown Car"}
//       - Contract Price: ${contextData.price || "N/A"}
//       - Market Fair Price: ${contextData.fairPrice || "N/A"}
//       - Deal Fairness Score: ${contextData.score}/100 (${contextData.verdict})
//       - Interest Rate: ${contextData.interest || "N/A"}
//       - Hidden Fees Detected: ${contextData.fees || "None"}
      
//       INSTRUCTION: Focus answers on this specific deal.
//       `;
//     } else {
//       // 👇 GENERAL MODE (Dashboard/History)
//       systemPrompt += `
      
//       CURRENT CONTEXT: General Dashboard Mode.
//       The user is navigating the app. If they ask "Where can I compare?", use the Navigation Guide above to answer.
//       `;
//     }

//     const completion = await openai.chat.completions.create({
//       model: MODEL_NAME,
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: message },
//       ],
//     });
//     return completion.choices[0].message.content;
//   } catch (error) {
//     console.error("Chat Error:", error);
//     return "I'm having trouble connecting right now. Please try again.";
//   }
// };

// module.exports = {
//   parseContractTerms,
//   generateRecommendation,
//   extractHiddenFees,
//   generateNegotiationEmail,
//   chatWithAI,
// };


const OpenAI = require("openai");
require("dotenv").config();

// Use environment variable for the URL, fallback to localhost for local dev
const SITE_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Initialize OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": SITE_URL,
    "X-Title": "AutoLease AI",
  },
});

const MODEL_NAME = "meta-llama/llama-3.1-8b-instruct";

// 🛠️ HELPER: Robust JSON Parser (Fixes Single Quotes Issue)
const cleanAndParseJSON = (text) => {
  try {
    if (!text) return [];

    // 1. Strip Markdown Code Blocks
    let cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 2. Extract JSON Array/Object only
    const firstOpen = cleanText.indexOf("{");
    const lastOpen = cleanText.indexOf("[");
    const lastCloseCurly = cleanText.lastIndexOf("}");
    const lastCloseSquare = cleanText.lastIndexOf("]");

    // Prioritize Array extraction if square brackets exist
    if (lastOpen !== -1 && lastCloseSquare !== -1) {
      cleanText = cleanText.substring(lastOpen, lastCloseSquare + 1);
    } else if (firstOpen !== -1 && lastCloseCurly !== -1) {
      cleanText = cleanText.substring(firstOpen, lastCloseCurly + 1);
    }

    // 3. FIX SINGLE QUOTES (The main source of your crash)
    if (cleanText.includes("'")) {
      cleanText = cleanText
        .replace(/([a-zA-Z0-9_]+?):/g, '"$1":') // Fix keys
        .replace(/'/g, '"'); // Fix values
    }

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("JSON Parse Failed on:", text.substring(0, 50));
    return []; // Return empty array on failure to prevent DB crash
  }
};

// ✅ 1. Contract Parsing (UPDATED to include Summary)
const parseContractTerms = async (contractText) => {
  try {
    if (!process.env.OPENROUTER_API_KEY) return {};

    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content: "You are an OCR assistant. Output STRICT VALID JSON with DOUBLE QUOTES.",
        },
        {
          role: "user",
          content: `
            Extract contract details into JSON.
            
            REQUIRED KEYS: 
            loan_amount, interest_rate, tenure_months, monthly_payment, 
            down_payment, residual_value, mileage_allowance, early_termination_fee, 
            purchase_option_price, maintenance_responsibilities, warranty_coverage, late_payment_penalty.

            NEW KEY:
            "summary": "Provide a 2-sentence summary of any non-financial clauses found (e.g., SLAs, Escalation Matrix, Support hours, or Insurance requirements)."
            
            Use "Not Specified" if a field is missing.
            
            Text: "${contractText.substring(0, 8000)}"
          `,
        },
      ],
    });

    const result = cleanAndParseJSON(completion.choices[0].message.content);
    return Array.isArray(result) ? {} : result; // Ensure Object
  } catch (error) {
    return {};
  }
};

// ✅ 2. Recommendation
const generateRecommendation = async (vehicleDetails, pricing, loanTerms) => {
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "user",
          content: `
            Act as a financial advisor. Analyze this deal:
            Price: ${pricing.contractPrice} (Fair: ${pricing.marketFairPrice}).
            Interest: ${loanTerms.interestRate}%.
            
            Give a 2-sentence recommendation.
          `,
        },
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    return "Compare quotes.";
  }
};

// ✅ 3. Hidden Fees (The Crash Fix)
const extractHiddenFees = async (contractText) => {
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content: "Output STRICT JSON Array. Use DOUBLE QUOTES only.",
        },
        {
          role: "user",
          content: `
            Extract fees as a JSON Array:
            [ { "name": "Fee Name", "amount": 0, "description": "Reason", "type": "Junk" or "Standard" } ]
            
            Text: "${contractText.substring(0, 8000)}"
          `,
        },
      ],
    });

    const result = cleanAndParseJSON(completion.choices[0].message.content);
    return Array.isArray(result) ? result : []; // Ensure Array
  } catch (error) {
    return [];
  }
};

// ✅ 4. Email
const generateNegotiationEmail = async (
  contractData,
  recipientName,
  userName,
) => {
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "user",
          content: `Write a negotiation email from ${userName} to ${recipientName} regarding a car loan.`,
        },
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    return "Error generating draft.";
  }
};

// ✅ 5. Chat (Supercharged Context-Aware + App Navigator)
const chatWithAI = async (message, contextData = null) => {
  try {
    // 👇 BASE KNOWLEDGE: Teach the AI about the App's features
    let systemPrompt = `
      You are Coach AI, the official expert assistant for AutoLease AI.
      Your goal is to help users negotiate car deals and easily navigate this application.

      APP NAVIGATION & FEATURES (Explain these to users if they ask what to do):
      1. Analyze Contract (Upload): Go to the Dashboard and click 'Analyze Contract' to upload a PDF. We instantly extract financial terms and uncover hidden 'junk' fees.
      2. Compare Offers: Go to 'Compare Offers' (or History) to select up to 3 contracts and compare them side-by-side to find the best deal.
      3. AI Negotiator: Go to 'Negotiator' to generate AI-powered counter-offer emails and negotiation scripts.
      4. Profile & Stats: Click the avatar in the top right to see your analyzed contracts, average deal score, and most common junk fees.

      NEGOTIATION BASICS:
      - Always advise users to negotiate the interest rate and demand the removal of junk fees (like admin fees, doc fees, prep fees).
      - A "Fairness Score" below 50 means the deal is highly overpriced.
      
      Your Personality: Be extremely helpful, encouraging, and concise. Format your responses nicely. Do not use markdown asterisks wildly.
    `;

    // 👇 SPECIFIC CONTEXT (If user is looking at a specific file)
    if (contextData && contextData.vehicle) {
      systemPrompt += `
      
      --- CURRENT CONTEXT ---
      The user is currently viewing a specific contract for a ${contextData.vehicle}.
      Contract Price: ₹${contextData.price || "N/A"}.
      Market Fair Price: ₹${contextData.fairPrice || "N/A"}.
      Deal Fairness Score: ${contextData.score || 0}/100 (${contextData.verdict || "Pending"}).
      Interest Rate: ${contextData.interest || "N/A"}%.
      Hidden Fees Detected: ${contextData.fees || "None"}.
      
      INSTRUCTION: Focus answers on this specific deal. If the user asks "is this a good deal?" or "what fees did you find?", use the numbers provided above to answer them specifically.
      `;
    } else {
      // 👇 GENERAL MODE (Dashboard/History)
      systemPrompt += `
      
      --- CURRENT CONTEXT ---
      General Dashboard Mode. The user is browsing the app. Use the APP NAVIGATION guide above to help them find what they need.
      `;
    }

    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting right now. Please try again.";
  }
};

module.exports = {
  parseContractTerms,
  generateRecommendation,
  extractHiddenFees,
  generateNegotiationEmail,
  chatWithAI,
};