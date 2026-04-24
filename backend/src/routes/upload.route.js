

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const pdf = require("pdf-extraction"); 


const { parseContractTerms, generateRecommendation } = require("../services/ai.service");
const { decodeVin } = require("../services/vin_decode.service");
const {
  estimateMarketFairPrice,
  calculateFairnessScore,
} = require("../services/market_price.service");
const OcrResult = require("../models/OcrResult");

const cleanNumber = (val) => {
  if (val == null) return 0;
  return parseFloat(String(val).replace(/[^0-9.]/g, "")) || 0;
};

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });

    console.log("[DEBUG] 📂 Processing File:", req.file.originalname);

    
    const dataBuffer = fs.readFileSync(req.file.path);
    let rawText = "";

    try {
      const pdfData = await pdf(dataBuffer);
      rawText = pdfData.text;

      console.log("[DEBUG] 📄 Text Extracted:", rawText.length, "chars");

      if (!rawText || rawText.trim().length === 0) {
        throw new Error("PDF text is empty");
      }
    } catch (err) {
      console.error("[CRITICAL] PDF Read Failed:", err.message);
      rawText = "Text extraction failed.";
    }

    
    const hasHindi = /[\u0900-\u097F]/.test(rawText);
    if (hasHindi) {
      console.log("[DEBUG] 🇮🇳 Hindi characters successfully detected and processed.");
    }

    
    console.log("[DEBUG] 🧠 Requesting AI Data...");
    let aiFields = {};
    try {
      if (rawText.length > 50) {
        aiFields = await parseContractTerms(rawText);
        console.log("[DEBUG] 🤖 AI Success:", aiFields && Object.keys(aiFields).length > 0 ? "Yes" : "No");
      }
    } catch (aiError) {
      console.error("[WARNING] AI Failed (Using Regex Fallback):", aiError.message);
    }

    
    const loanMatch = rawText.match(/Rs\.?\s?([0-9,]+)/i);
    const interestMatch = rawText.match(/(\d+(\.\d+)?)\s?%/);
    const tenureMatch = rawText.match(/(\d+)\s?months/i);
    const vinMatch = rawText.match(/\b[A-HJ-NPR-Z0-9]{17}\b/);
    const marketValueMatch = rawText.match(/Market Value:\s*(?:Rs\.?)?\s*([0-9,]+)/i);

    const extractedFields = {
      ...aiFields,
      loan_amount: aiFields.loan_amount && aiFields.loan_amount !== "Not Specified"
        ? aiFields.loan_amount
        : loanMatch ? `Rs ${loanMatch[1]}` : "Not Specified",
      interest_rate: aiFields.interest_rate && aiFields.interest_rate !== "Not Specified"
        ? aiFields.interest_rate
        : interestMatch ? `${interestMatch[1]}%` : "Not Specified",
      tenure_months: aiFields.tenure_months && aiFields.tenure_months !== "Not Specified"
        ? aiFields.tenure_months
        : tenureMatch ? tenureMatch[1] : "Not Specified",
      vin: vinMatch ? vinMatch[0] : null,
      vehicle_make: rawText.match(/(TOYOTA|HONDA|FORD|BMW|TESLA|HYUNDAI|PORSCHE)/i)?.[0]?.toUpperCase(),
    };

    
    let vehicleDetails = null;
    let pricingAnalysis = null;

    if (extractedFields.vin) {
      try {
        vehicleDetails = await decodeVin(extractedFields.vin);
      } catch (e) {
        console.log("[DEBUG] VIN Decode skipped or failed");
      }
    }

    
    if (!vehicleDetails && extractedFields.vehicle_make) {
      vehicleDetails = { make: extractedFields.vehicle_make, model: "Unknown", year: new Date().getFullYear() };
    }

    let marketFairPrice = 0;
    
   
    if (vehicleDetails && vehicleDetails.make) {
      try {
        const pricingResult = estimateMarketFairPrice(vehicleDetails);
        if (pricingResult && pricingResult.marketFairPrice) marketFairPrice = pricingResult.marketFairPrice;
      } catch (e) {}
    }

    
    if (marketValueMatch) {
      marketFairPrice = cleanNumber(marketValueMatch[1]);
    }

    const contractPrice = cleanNumber(extractedFields.loan_amount);

   
    if (!marketFairPrice && contractPrice > 0) {
      marketFairPrice = contractPrice * 0.95; 
    }

    if (contractPrice > 0 && marketFairPrice > 0) {
      let score = 0;
      let verdict = "Fair Deal";

      try {
        const fairnessData = calculateFairnessScore(
          marketFairPrice,
          contractPrice,
          cleanNumber(extractedFields.interest_rate),
          cleanNumber(extractedFields.tenure_months)
        );
        score = Number(fairnessData?.score) || 0;
        verdict = fairnessData?.label || "Fair Deal";
      } catch (e) {
        console.error("[DEBUG] calculateFairnessScore failed.");
      }

     
      if (score === 0 || isNaN(score)) {
        const diff = ((contractPrice - marketFairPrice) / marketFairPrice) * 100;
        if (diff <= 0) { score = 95; verdict = "Great Deal"; }
        else if (diff <= 3) { score = 88; verdict = "Fair Deal"; }
        else if (diff <= 8) { score = 75; verdict = "Slightly Overpriced"; }
        else { score = 45; verdict = "Overpriced"; }
      }

      
      let aiRec = "Review terms carefully and ensure no hidden fees exist.";
      try {
        aiRec = await generateRecommendation(
          vehicleDetails || { make: extractedFields.vehicle_make || "Vehicle" },
          { contractPrice, marketFairPrice },
          { interestRate: cleanNumber(extractedFields.interest_rate) }
        );
      } catch(e) {
        console.error("[DEBUG] AI Recommendation failed.");
      }

      pricingAnalysis = {
        marketFairPrice: Number(marketFairPrice) || 0,
        contractPrice: Number(contractPrice) || 0,
        score: Math.round(Number(score)) || 0,
        verdict: String(verdict),
        recommendation: String(aiRec),
      };
    }

    
    const savedRecord = await OcrResult.create({
      fileName: req.file.originalname,
      rawText: rawText,
      fields: extractedFields,
      confidence: 0.9,
      vin: extractedFields.vin,
      vehicleDetails,
      pricingAnalysis,
      hiddenFees: { 
        analyzed: false,
        fees: []
      }
    });

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      savedId: savedRecord._id,
      extracted: { fields: extractedFields },
      vehicleDetails,
      pricingAnalysis,
      hasHindi: hasHindi 
    });
  } catch (error) {
    console.error("[ERROR] Route Failed:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;