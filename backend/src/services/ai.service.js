



const OpenAI = require("openai");
require("dotenv").config();

const SITE_URL = process.env.CLIENT_URL || "http://localhost:3000";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": SITE_URL,
    "X-Title": "AutoLease AI",
  },
});

const MODEL_NAME = "meta-llama/llama-3.1-8b-instruct";


const cleanAndParseJSON = (text) => {
  try {
    if (!text) return null;
    
   
    let cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const firstCurly = cleanText.indexOf("{");
    const firstSquare = cleanText.indexOf("[");
    
    
    if (firstSquare !== -1 && (firstCurly === -1 || firstSquare < firstCurly)) {
      const lastSquare = cleanText.lastIndexOf("]");
      if (lastSquare !== -1) cleanText = cleanText.substring(firstSquare, lastSquare + 1);
    } else if (firstCurly !== -1) {
      const lastCurly = cleanText.lastIndexOf("}");
      if (lastCurly !== -1) cleanText = cleanText.substring(firstCurly, lastCurly + 1);
    }

   
    if (cleanText.includes("'")) {
      cleanText = cleanText.replace(/([a-zA-Z0-9_]+?):/g, '"$1":').replace(/'/g, '"');
    }

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("JSON Parse Failed on:", text.substring(0, 80));
    return null; 
  }
};


const parseContractTerms = async (contractText) => {
  try {
    if (!process.env.OPENROUTER_API_KEY) return {};

    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content: "You are a strict data extraction API. You output ONLY valid JSON. No explanations, no markdown formatting, no conversational text.",
        },
        {
          role: "user",
          content: `
            Extract the following contract details into a single JSON object.
            
            REQUIRED KEYS (Use exact spelling): 
            loan_amount, interest_rate, tenure_months, monthly_payment, 
            down_payment, residual_value, mileage_allowance, early_termination_fee, 
            purchase_option_price, maintenance_responsibilities, warranty_coverage, late_payment_penalty, summary.

            RULES:
            - If a value is missing, output "Not Specified".
            - For the "summary" key, write 2 sentences summarizing any non-financial clauses (e.g., insurance requirements).
            
            Text: "${contractText.substring(0, 8000)}"
          `,
        },
      ],
      temperature: 0.1, 
    });

    const result = cleanAndParseJSON(completion.choices[0].message.content);
    return result && !Array.isArray(result) ? result : {};
  } catch (error) {
    console.error("Parse Error:", error.message);
    return {};
  }
};


const generateRecommendation = async (vehicleDetails, pricing, loanTerms) => {
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "user",
          content: `
            Act as a highly critical financial advisor. 
            Analyze this car deal:
            Contract Price: ${pricing.contractPrice} 
            Market Fair Price: ${pricing.marketFairPrice}
            Interest Rate: ${loanTerms.interestRate}%.
            
            Give exactly a 2-sentence recommendation on whether the user should sign this, renegotiate, or walk away. Do not use asterisks or formatting.
          `,
        },
      ],
      temperature: 0.5,
    });
    return completion.choices[0].message.content.trim();
  } catch (error) {
    return "This deal requires closer comparison. Use the Compare Offers tool to benchmark it against other quotes.";
  }
};


const extractHiddenFees = async (contractText) => {
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content: "You are a strict data extraction API. You output ONLY a valid JSON Array. No introductory text.",
        },
        {
          role: "user",
          content: `
            Scan this text for standard fees and hidden "junk" fees. 
            Output a JSON array of objects.
            
            Format required:
            [ 
              { 
                "name": "Fee Name", 
                "amount": "150", 
                "description": "Reason for fee", 
                "type": "Junk", 
                "severity": "warning" 
              } 
            ]
            
            RULES:
            - "type" must be exactly "Junk" or "Standard".
            - "severity" must be exactly "critical" (for high/unfair fees), "warning" (for questionable fees), or "ok" (for standard state taxes/registration).
            - Output ONLY the array.

            Text: "${contractText.substring(0, 8000)}"
          `,
        },
      ],
      temperature: 0.1,
    });

    const result = cleanAndParseJSON(completion.choices[0].message.content);
    return Array.isArray(result) ? result : []; 
  } catch (error) {
    console.error("Fee Extraction Error:", error.message);
    return [];
  }
};


const generateNegotiationEmail = async (contractData, recipientName, userName) => {
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "user",
          content: `Write a professional but firm negotiation email from ${userName} to ${recipientName} regarding a car loan. Demand the removal of all junk fees and request a better interest rate. Keep it under 150 words.`,
        },
      ],
      temperature: 0.6,
    });
    return completion.choices[0].message.content.trim();
  } catch (error) {
    return "Error generating draft. Please try again.";
  }
};


const chatWithAI = async (message, contextData = null) => {
  try {
    let systemPrompt = `
      You are Coach AI, the official expert assistant for AutoLease AI.
      Your goal is to help users negotiate car deals and easily navigate this application.

      APP NAVIGATION & FEATURES:
      1. Analyze Contract: Upload a PDF. We instantly extract terms and uncover hidden 'junk' fees.
      2. Compare Offers: Select up to 3 different contracts and compare them side-by-side.
      3. Compare Versions: Upload a revised contract to prove what the dealer changed.
      4. AI Negotiator: Generate counter-offer emails and negotiation scripts.
      5. Profile & Analytics: Track your spending trends and overall portfolio health.

      NEGOTIATION BASICS:
      - Always advise users to negotiate the interest rate and demand the removal of junk fees (admin fees, doc fees).
      - A "Fairness Score" below 50 means the deal is overpriced.
      
      Your Personality: Be extremely helpful, encouraging, and concise. Do not use markdown asterisks wildly.
    `;

    if (contextData && contextData.vehicle) {
      systemPrompt += `
      --- CURRENT CONTEXT ---
      The user is viewing a contract for a ${contextData.vehicle}.
      Contract Price: ₹${contextData.price || "N/A"}.
      Market Fair Price: ₹${contextData.fairPrice || "N/A"}.
      Deal Score: ${contextData.score || 0}/100 (${contextData.verdict || "Pending"}).
      Interest Rate: ${contextData.interest || "N/A"}%.
      Hidden Fees Detected: ${contextData.fees || "None"}.
      `;
    }

    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.6,
    });
    return completion.choices[0].message.content.trim();
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

