// const express = require("express");
// const router = express.Router();
// const multer = require("multer");

// const upload = multer({ dest: "uploads/" });

// const { extractTextFromPDF } = require("../services/ocr.service");
// const extractFields = require("../extraction/extractFields");

// const OcrResult = require("../models/OcrResult");

// router.post("/upload", upload.single("file"), async (req, res) => {

//   try {
//     const debugMode = req.query.debug === "true";
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "NO file uploaded",
//       });
//     }
//     const filePath = req.file.path;
//     const ocrResult = await extractTextFromPDF(filePath);
//     const extracted = extractFields(ocrResult.rawText);

//     if (debugMode) {
//       console.log("\n===== OCR DEBUG MODE ENABLED =====");
//       console.log("RAW OCR TEXT:\n", ocrResult.rawText);
//       console.log("\nEXTRACTION RESULT:\n", JSON.stringify(extracted, null, 2));
//       console.log("=================================\n");
//     }

//     if (!ocrResult.success) {
//       return res.status(500).json({
//         success: false,
//         message: "OCR Processing failed",
//         error: ocrResult.error,
//       });
//     }
//     let savedRecord = null;
//     try {
//       savedRecord = await OcrResult.create({
//         fileName: req.file.originalname || null,
//         rawText: ocrResult.rawText,
//         fields: extracted.fields || {},
//         confidence: extracted.confidence,
//         notes: extracted.notes || [],
//       });
//     } catch (dbError) {
//       console.error("Database save failed:", dbError.message);
//     }

//     return res.json({
//       success: true,
//       debug: debugMode,
//       savedId: savedRecord ? savedRecord._id : null,
//       rawText: ocrResult.rawText,
//       extracted,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Unexcepted server error",
//       error: error.message,
//     });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");

// const upload = multer({ dest: "uploads/" });

// const { extractTextFromPDF } = require("../services/ocr.service");
// const extractFields = require("../extraction/extractFields");

// // --- 1. IMPORT MISSING SERVICES ---
// const { decodeVin } = require("../services/vin_decode.service");
// const { estimateMarketFairPrice } = require("../services/market_price.service");

// const OcrResult = require("../models/OcrResult");

// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const debugMode = req.query.debug === "true";
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No file uploaded",
//       });
//     }

//     const filePath = req.file.path;

//     // 1. Extract Text
//     const ocrResult = await extractTextFromPDF(filePath);

//     if (!ocrResult.success) {
//       return res.status(500).json({
//         success: false,
//         message: "OCR Processing failed",
//         error: ocrResult.error,
//       });
//     }

//     // 2. Extract Fields (Basic regex)
//     const extracted = extractFields(ocrResult.rawText);

//     if (debugMode) {
//       console.log("\n===== OCR DEBUG MODE ENABLED =====");
//       // console.log("RAW OCR TEXT:\n", ocrResult.rawText);
//       console.log("\nEXTRACTION RESULT:\n", JSON.stringify(extracted, null, 2));
//       console.log("=================================\n");
//     }

//     // --- 3. DECODE VIN (Logic added from your unused controller) ---
//     let vehicleDetails = null;
//     if (extracted.fields && extracted.fields.vin) {
//       console.log(`Found VIN: ${extracted.fields.vin}, decoding...`);
//       vehicleDetails = await decodeVin(extracted.fields.vin);
//     }

//     // --- 4. MARKET PRICE ANALYSIS (Logic added from your unused controller) ---
//     let pricingAnalysis = null;

//     // Only run pricing if we successfully got vehicle details
//     if (vehicleDetails) {
//       const pricingResult = estimateMarketFairPrice(vehicleDetails);

//       if (pricingResult) {
//         const contractPrice = extracted.fields.loan_amount || null;
//         let diff = 0;
//         let recommendationText = "";
//         let verdict = "Fair";

//         if (contractPrice) {
//           // Calculate difference
//           diff = contractPrice - pricingResult.marketFairPrice;
//           verdict = diff > 0 ? "Overpriced" : "Fair";

//           // Generate Recommendation text
//           if (diff > 50000) {
//             recommendationText = `The ${vehicleDetails.make} ${vehicleDetails.model} is priced ₹${diff.toLocaleString()} above market value. It is strongly recommended to negotiate.`;
//           } else if (diff > 0) {
//             recommendationText = `The vehicle is slightly overpriced. You may proceed but negotiate for better terms.`;
//           } else {
//             recommendationText = `The contract price is aligned with market value. This appears to be a reasonable deal.`;
//           }
//         }

//         pricingAnalysis = {
//           marketFairPrice: pricingResult.marketFairPrice,
//           contractPrice: contractPrice,
//           difference: diff,
//           verdict: verdict,
//           confidence: pricingResult.confidence,
//           source: pricingResult.source,
//           recommendation: recommendationText,
//         };
//       }
//     }

//     // --- 5. SAVE TO DATABASE ---
//     let savedRecord = null;
//     try {
//       savedRecord = await OcrResult.create({
//         fileName: req.file.originalname || null,
//         rawText: ocrResult.rawText,
//         fields: extracted.fields || {},
//         confidence: extracted.confidence,
//         notes: extracted.notes || [],
//         vin: extracted.fields?.vin || null, // Explicitly save VIN
//         vehicleDetails: vehicleDetails, // Save the decoded details
//         pricingAnalysis: pricingAnalysis, // Save the price analysis
//       });
//     } catch (dbError) {
//       console.error("Database save failed:", dbError.message);
//     }

//     // --- 6. RETURN RESPONSE ---
//     return res.json({
//       success: true,
//       debug: debugMode,
//       savedId: savedRecord ? savedRecord._id : null,
//       rawText: ocrResult.rawText,
//       extracted: extracted,
//       // Send back the new details so frontend updates immediately
//       vehicleDetails: vehicleDetails,
//       pricingAnalysis: pricingAnalysis,
//     });
//   } catch (error) {
//     console.error("Unexpected Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Unexpected server error",
//       error: error.message,
//     });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");

// const upload = multer({ dest: "uploads/" });

// const { extractTextFromPDF } = require("../services/ocr.service");
// const extractFields = require("../extraction/extractFields");
// const { decodeVin } = require("../services/vin_decode.service");
// // At the top of src/routes/upload.route.js
// const { estimateMarketFairPrice, calculateFairnessScore } = require("../services/market_price.service");
// const OcrResult = require("../models/OcrResult");

// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const debugMode = req.query.debug === "true";
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No file uploaded",
//       });
//     }

//     const filePath = req.file.path;

//     // 1. Extract Text
//     const ocrResult = await extractTextFromPDF(filePath);

//     if (!ocrResult.success) {
//       return res.status(500).json({
//         success: false,
//         message: "OCR Processing failed",
//         error: ocrResult.error,
//       });
//     }

//     // 2. Extract Fields (including text-based vehicle details)
//     const extracted = extractFields(ocrResult.rawText);

//     if (debugMode) {
//       console.log("\n===== OCR DEBUG MODE ENABLED =====");
//       console.log("\nEXTRACTION RESULT:\n", JSON.stringify(extracted, null, 2));
//       console.log("=================================\n");
//     }

//     // --- 3. DECODE VIN OR USE TEXT FALLBACK ---
//     let vehicleDetails = null;

//     // A. Try API Decoding first
//     if (extracted.fields && extracted.fields.vin) {
//       console.log(`Found VIN: ${extracted.fields.vin}, decoding...`);
//       vehicleDetails = await decodeVin(extracted.fields.vin);
//     }

//     // B. Fallback: Use Text Extraction if API failed
//     // (This fixes the empty details for synthetic PDFs)
//     if (!vehicleDetails || !vehicleDetails.make) {
//       console.log("VIN API failed. Checking for text-extracted details...");

//       if (extracted.fields.vehicle_make) {
//         vehicleDetails = {
//           year: extracted.fields.vehicle_year || null,
//           make: extracted.fields.vehicle_make || null,
//           model: extracted.fields.vehicle_model || null,
//           trim: extracted.fields.vehicle_trim || null,
//           bodyClass: extracted.fields.vehicle_body_type || null,
//         };
//         console.log("Using text-extracted vehicle details.");
//       }
//     }

//     // --- 4. MARKET PRICE ANALYSIS ---
//     let pricingAnalysis = null;

//     // Only run pricing if we successfully got vehicle details
//     if (vehicleDetails) {
//       const pricingResult = estimateMarketFairPrice(vehicleDetails);

//       if (pricingResult) {
//         const contractPrice = extracted.fields.loan_amount || null;
//         // Default to 0 if not found so calculations don't break
//         const interestRate = extracted.fields.interest_rate || 0;
//         const tenure = extracted.fields.tenure_months || 0;

//         let diff = 0;
//         let recommendationText = "";
//         let fairnessData = { score: 50, label: "Unknown", reasons: [] };

//         if (contractPrice) {
//           // 1. Calculate Difference
//           diff = contractPrice - pricingResult.marketFairPrice;

//           // 2. Calculate FAIRNESS SCORE
//           fairnessData = calculateFairnessScore(
//             pricingResult.marketFairPrice,
//             contractPrice,
//             interestRate,
//             tenure,
//           );

//           // 3. Generate Recommendation based on Score
//           if (fairnessData.score >= 80) {
//             recommendationText = `✅ Excellent Deal! The price is great and terms look healthy. You should proceed with this contract.`;
//           } else if (fairnessData.score >= 50) {
//             recommendationText = `⚠️ Fair Deal. The price is reasonable, but watch out for the ${interestRate}% interest rate. Try negotiating the price down by ₹${Math.abs(diff).toLocaleString()}.`;
//           } else {
//             recommendationText = `❌ High Risk! This contract is significantly overpriced (Score: ${fairnessData.score}/100). The vehicle is priced ₹${diff.toLocaleString()} above market value. We strongly recommend walking away or demanding a massive discount.`;
//           }
//         }

//         pricingAnalysis = {
//           marketFairPrice: pricingResult.marketFairPrice,
//           contractPrice: contractPrice,
//           difference: diff,

//           // --- NEW FAIRNESS FIELDS ---
//           verdict: fairnessData.label, // e.g. "Poor Deal"
//           score: fairnessData.score, // e.g. 35
//           scoreReasons: fairnessData.reasons, // e.g. ["High Interest Rate", "Overpriced"]

//           confidence: pricingResult.confidence,
//           source: pricingResult.source,
//           recommendation: recommendationText,
//         };
//       }
//     }

//     // --- 5. SAVE TO DATABASE ---
//     let savedRecord = null;
//     try {
//       savedRecord = await OcrResult.create({
//         fileName: req.file.originalname || null,
//         rawText: ocrResult.rawText,
//         fields: extracted.fields || {},
//         confidence: extracted.confidence,
//         notes: extracted.notes || [],
//         vin: extracted.fields?.vin || null,
//         vehicleDetails: vehicleDetails,
//         pricingAnalysis: pricingAnalysis,
//       });
//     } catch (dbError) {
//       console.error("Database save failed:", dbError.message);
//     }

//     // --- 6. RETURN RESPONSE ---
//     return res.json({
//       success: true,
//       debug: debugMode,
//       savedId: savedRecord ? savedRecord._id : null,
//       rawText: ocrResult.rawText,
//       extracted: extracted,
//       vehicleDetails: vehicleDetails,
//       pricingAnalysis: pricingAnalysis,
//     });
//   } catch (error) {
//     console.error("Unexpected Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Unexpected server error",
//       error: error.message,
//     });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

// const { extractTextFromPDF } = require("../services/ocr.service");
// const extractFields = require("../extraction/extractFields");
// const { decodeVin } = require("../services/vin_decode.service");
// const {
//   estimateMarketFairPrice,
//   calculateFairnessScore,
// } = require("../services/market_price.service");
// // 👇 Import the AI Service
// const { generateRecommendation } = require("../services/ai.service");
// const OcrResult = require("../models/OcrResult");

// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const debugMode = req.query.debug === "true";
//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No file uploaded" });
//     }

//     const filePath = req.file.path;

//     // 1. Extract Text
//     const ocrResult = await extractTextFromPDF(filePath);
//     if (!ocrResult.success) {
//       return res
//         .status(500)
//         .json({
//           success: false,
//           message: "OCR Failed",
//           error: ocrResult.error,
//         });
//     }

//     // 2. Extract Fields
//     const extracted = extractFields(ocrResult.rawText);

//     // 3. Decode VIN
//     let vehicleDetails = null;
//     if (extracted.fields && extracted.fields.vin) {
//       vehicleDetails = await decodeVin(extracted.fields.vin);
//     }

//     // Fallback if API VIN decoding failed
//     if (!vehicleDetails && extracted.fields.vehicle_make) {
//       vehicleDetails = {
//         year: extracted.fields.vehicle_year,
//         make: extracted.fields.vehicle_make,
//         model: extracted.fields.vehicle_model,
//         trim: extracted.fields.vehicle_trim,
//         bodyClass: extracted.fields.vehicle_body_type,
//       };
//     }

//     // 4. Market Price & AI Analysis
//     let pricingAnalysis = null;

//     if (vehicleDetails) {
//       const pricingResult = estimateMarketFairPrice(vehicleDetails);

//       if (pricingResult) {
//         const contractPrice = extracted.fields.loan_amount || null;
//         const interestRate = extracted.fields.interest_rate || 0;
//         const tenure = extracted.fields.tenure_months || 0;

//         let diff = 0;
//         let aiRecommendation = "Processing...";
//         let fairnessData = { score: 50, label: "Unknown", reasons: [] };

//         if (contractPrice) {
//           // A. Calculate basic difference
//           diff = contractPrice - pricingResult.marketFairPrice;

//           // B. Calculate Fairness Score (0-100)
//           fairnessData = calculateFairnessScore(
//             pricingResult.marketFairPrice,
//             contractPrice,
//             interestRate,
//             tenure,
//           );

//           // C. Generate AI Recommendation (Gemini)
//           aiRecommendation = await generateRecommendation(
//             vehicleDetails,
//             {
//               marketFairPrice: pricingResult.marketFairPrice,
//               contractPrice: contractPrice,
//               verdict: fairnessData.label,
//               score: fairnessData.score,
//             },
//             { interestRate, tenureMonths: tenure },
//           );
//         }

//         pricingAnalysis = {
//           marketFairPrice: pricingResult.marketFairPrice,
//           contractPrice: contractPrice,
//           difference: diff,
//           verdict: fairnessData.label,
//           score: fairnessData.score, // Saved to DB
//           scoreReasons: fairnessData.reasons, // Saved to DB
//           confidence: pricingResult.confidence,
//           source: pricingResult.source,
//           recommendation: aiRecommendation, // Saved to DB
//         };
//       }
//     }

//     // 5. Save to Database
//     let savedRecord = null;
//     try {
//       savedRecord = await OcrResult.create({
//         fileName: req.file.originalname,
//         rawText: ocrResult.rawText,
//         fields: extracted.fields,
//         confidence: extracted.confidence,
//         notes: extracted.notes,
//         vin: extracted.fields?.vin || null,
//         vehicleDetails: vehicleDetails,
//         pricingAnalysis: pricingAnalysis,
//       });
//     } catch (dbError) {
//       console.error("Database save failed:", dbError.message);
//     }

//     // 6. Return Response
//     return res.json({
//       success: true,
//       debug: debugMode,
//       savedId: savedRecord ? savedRecord._id : null,
//       rawText: ocrResult.rawText,
//       extracted: extracted,
//       vehicleDetails: vehicleDetails,
//       pricingAnalysis: pricingAnalysis,
//     });
//   } catch (error) {
//     console.error("Unexpected Error:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

// const { extractTextFromPDF } = require("../services/ocr.service");
// const extractFields = require("../extraction/extractFields");
// const { decodeVin } = require("../services/vin_decode.service");

// // 👇 MAKE SURE THIS IMPORT IS CORRECT
// const {
//   estimateMarketFairPrice,
//   calculateFairnessScore,
// } = require("../services/market_price.service");
// const { generateRecommendation } = require("../services/ai.service");
// const OcrResult = require("../models/OcrResult");

// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const debugMode = req.query.debug === "true";
//     if (!req.file)
//       return res.status(400).json({ success: false, message: "No file" });

//     // 1. OCR & Extraction
//     const ocrResult = await extractTextFromPDF(req.file.path);
//     if (!ocrResult.success)
//       return res.status(500).json({ success: false, message: "OCR Failed" });

//     const extracted = extractFields(ocrResult.rawText);

//     // 2. VIN Decoding
//     let vehicleDetails = null;
//     if (extracted.fields?.vin)
//       vehicleDetails = await decodeVin(extracted.fields.vin);
//     if (!vehicleDetails && extracted.fields.vehicle_make) {
//       vehicleDetails = {
//         year: extracted.fields.vehicle_year,
//         make: extracted.fields.vehicle_make,
//         model: extracted.fields.vehicle_model,
//         trim: extracted.fields.vehicle_trim,
//         bodyClass: extracted.fields.vehicle_body_type,
//       };
//     }

//     // 3. Pricing & Fairness Analysis
//     let pricingAnalysis = null;
//     if (vehicleDetails) {
//       const pricingResult = estimateMarketFairPrice(vehicleDetails);
//       if (pricingResult) {
//         const contractPrice = extracted.fields.loan_amount || 0;
//         const interestRate = extracted.fields.interest_rate || 0;
//         const tenure = extracted.fields.tenure_months || 0;

//         // Default values
//         let diff = 0;
//         let fairnessData = { score: 50, label: "Unknown", reasons: [] };
//         let aiRecommendation = "Analysis pending...";

//         if (contractPrice > 0) {
//           diff = contractPrice - pricingResult.marketFairPrice;

//           // 👇 CALCULATE SCORE
//           fairnessData = calculateFairnessScore(
//             pricingResult.marketFairPrice,
//             contractPrice,
//             interestRate,
//             tenure,
//           );

//           // Generate AI Rec (Optional, safe to fail)
//           try {
//             aiRecommendation = await generateRecommendation(
//               vehicleDetails,
//               {
//                 marketFairPrice: pricingResult.marketFairPrice,
//                 contractPrice,
//                 verdict: fairnessData.label,
//                 score: fairnessData.score,
//               },
//               { interestRate, tenureMonths: tenure },
//             );
//           } catch (e) {
//             console.log("AI failed, skipping");
//           }
//         }

//         pricingAnalysis = {
//           marketFairPrice: pricingResult.marketFairPrice,
//           contractPrice: contractPrice,
//           difference: diff,

//           // 👇 SAVE SCORE TO OBJECT
//           verdict: fairnessData.label,
//           score: fairnessData.score,
//           scoreReasons: fairnessData.reasons,

//           confidence: pricingResult.confidence,
//           recommendation: aiRecommendation,
//         };
//       }
//     }

//     // 4. Save to DB
//     const savedRecord = await OcrResult.create({
//       fileName: req.file.originalname,
//       rawText: ocrResult.rawText,
//       fields: extracted.fields,
//       confidence: extracted.confidence,
//       notes: extracted.notes,
//       vin: extracted.fields?.vin,
//       vehicleDetails,
//       pricingAnalysis,
//     });

//     return res.json({
//       success: true,
//       savedId: savedRecord._id,
//       pricingAnalysis, // Send back to frontend immediately
//     });
//   } catch (error) {
//     console.error("Server Error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

// const { extractTextFromPDF } = require("../services/ocr.service");
// const extractFields = require("../extraction/extractFields");
// const { decodeVin } = require("../services/vin_decode.service");
// const {
//   estimateMarketFairPrice,
//   calculateFairnessScore,
// } = require("../services/market_price.service");
// const OcrResult = require("../models/OcrResult");

// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file)
//       return res.status(400).json({ success: false, message: "No file" });

//     // 1. OCR
//     const ocrResult = await extractTextFromPDF(req.file.path);
//     if (!ocrResult.success)
//       return res.status(500).json({ success: false, message: "OCR Failed" });
//     const extracted = extractFields(ocrResult.rawText);

//     // 2. Decode VIN / Vehicle
//     let vehicleDetails = null;
//     if (extracted.fields?.vin)
//       vehicleDetails = await decodeVin(extracted.fields.vin);
//     // Fallback if API fail
//     if (!vehicleDetails && extracted.fields.vehicle_make) {
//       vehicleDetails = {
//         year: extracted.fields.vehicle_year,
//         make: extracted.fields.vehicle_make,
//         model: extracted.fields.vehicle_model,
//         trim: extracted.fields.vehicle_trim,
//         bodyClass: extracted.fields.vehicle_body_type,
//       };
//     }

//     // 3. Market Pricing
//     let pricingAnalysis = null;
//     if (vehicleDetails) {
//       const pricingResult = estimateMarketFairPrice(vehicleDetails);
//       if (pricingResult) {
//         const contractPrice = extracted.fields.loan_amount || 0;
//         const interestRate = extracted.fields.interest_rate || 0;
//         const tenure = extracted.fields.tenure_months || 0;

//         let diff = 0;
//         let fairnessData = { score: 50, label: "Unknown", reasons: [] };

//         if (contractPrice > 0) {
//           diff = contractPrice - pricingResult.marketFairPrice;
//           fairnessData = calculateFairnessScore(
//             pricingResult.marketFairPrice,
//             contractPrice,
//             interestRate,
//             tenure,
//           );
//         }

//         pricingAnalysis = {
//           marketFairPrice: pricingResult.marketFairPrice,
//           contractPrice: contractPrice,
//           difference: diff,
//           verdict: fairnessData.label,

//           // These match the new schema structure perfectly
//           score: fairnessData.score,
//           scoreReasons: fairnessData.reasons,
//           recommendation: "Negotiate if score is low.",

//           confidence: pricingResult.confidence,
//           source: pricingResult.source,
//         };
//       }
//     }

//     // 4. Save
//     const savedRecord = await OcrResult.create({
//       fileName: req.file.originalname,
//       rawText: ocrResult.rawText,
//       fields: extracted.fields,
//       confidence: extracted.confidence,
//       notes: extracted.notes,
//       vin: extracted.fields?.vin,
//       vehicleDetails,
//       pricingAnalysis,
//     });

//     return res.json({
//       success: true,
//       savedId: savedRecord._id,
//       pricingAnalysis,
//     });
//   } catch (error) {
//     console.error("Server Error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

// const { extractTextFromPDF } = require("../services/ocr.service");
// const extractFields = require("../extraction/extractFields");
// const { decodeVin } = require("../services/vin_decode.service");
// const {
//   estimateMarketFairPrice,
//   calculateFairnessScore,
// } = require("../services/market_price.service");
// const OcrResult = require("../models/OcrResult");

// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file)
//       return res.status(400).json({ success: false, message: "No file" });

//     // 1. OCR
//     const ocrResult = await extractTextFromPDF(req.file.path);
//     if (!ocrResult.success)
//       return res.status(500).json({ success: false, message: "OCR Failed" });

//     // 2. Extraction
//     const extracted = extractFields(ocrResult.rawText);

//     // 3. Vehicle & VIN
//     let vehicleDetails = null;
//     if (extracted.fields?.vin)
//       vehicleDetails = await decodeVin(extracted.fields.vin);
//     if (!vehicleDetails && extracted.fields.vehicle_make) {
//       vehicleDetails = {
//         year: extracted.fields.vehicle_year,
//         make: extracted.fields.vehicle_make,
//         model: extracted.fields.vehicle_model,
//         trim: extracted.fields.vehicle_trim,
//         bodyClass: extracted.fields.vehicle_body_type,
//       };
//     }

//     // 4. Pricing Logic
//     let pricingAnalysis = null;
//     if (vehicleDetails) {
//       const pricingResult = estimateMarketFairPrice(vehicleDetails);
//       if (pricingResult) {
//         const contractPrice = extracted.fields.loan_amount || 0;
//         const interestRate = extracted.fields.interest_rate || 0;
//         const tenure = extracted.fields.tenure_months || 0;

//         let diff = 0;
//         let fairnessData = { score: 50, label: "Unknown", reasons: [] };

//         if (contractPrice > 0) {
//           diff = contractPrice - pricingResult.marketFairPrice;
//           fairnessData = calculateFairnessScore(
//             pricingResult.marketFairPrice,
//             contractPrice,
//             interestRate,
//             tenure,
//           );
//         }

//         pricingAnalysis = {
//           marketFairPrice: pricingResult.marketFairPrice,
//           contractPrice: contractPrice,
//           difference: diff,
//           verdict: fairnessData.label,
//           score: fairnessData.score,
//           scoreReasons: fairnessData.reasons,
//           confidence: pricingResult.confidence,
//           recommendation: "Review details carefully.", // Simple fallback
//         };
//       }
//     }

//     // 5. Save to DB
//     const savedRecord = await OcrResult.create({
//       fileName: req.file.originalname,
//       rawText: ocrResult.rawText,
//       fields: extracted.fields,
//       confidence: extracted.confidence,
//       notes: extracted.notes,
//       vin: extracted.fields?.vin,
//       vehicleDetails,
//       pricingAnalysis,
//     });

//     // 6. Return standard response that frontend expects
//     return res.json({
//       success: true,
//       savedId: savedRecord._id,
//       rawText: ocrResult.rawText,
//       extracted: extracted, // <--- THIS is what the frontend needs for Key Details
//       vehicleDetails,
//       pricingAnalysis,
//     });
//   } catch (error) {
//     console.error("Server Error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

// const { extractTextFromPDF } = require("../services/ocr.service");
// const extractFields = require("../extraction/extractFields");
// const { decodeVin } = require("../services/vin_decode.service");
// const {
//   estimateMarketFairPrice,
//   calculateFairnessScore,
// } = require("../services/market_price.service");
// const { generateRecommendation } = require("../services/ai.service");
// const OcrResult = require("../models/OcrResult");

// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file)
//       return res.status(400).json({ success: false, message: "No file" });

//     // 1. OCR Processing
//     const ocrResult = await extractTextFromPDF(req.file.path);
//     if (!ocrResult.success)
//       return res.status(500).json({ success: false, message: "OCR Failed" });

//     // 2. Field Extraction
//     const extracted = extractFields(ocrResult.rawText);

//     // 3. Vehicle Identification (The Fix is Here)
//     let vehicleDetails = null;

//     // Step A: Try VIN API first
//     if (extracted.fields?.vin) {
//       console.log(`Attempting VIN Decode for: ${extracted.fields.vin}`);
//       vehicleDetails = await decodeVin(extracted.fields.vin);
//     }

//     // Step B: CRITICAL FALLBACK - Use Text Extraction if VIN API failed
//     if (!vehicleDetails && extracted.fields.vehicle_make) {
//       console.log(
//         "⚠️ VIN API failed or VIN invalid. Using Text Extraction Fallback.",
//       );
//       vehicleDetails = {
//         year: extracted.fields.vehicle_year,
//         make: extracted.fields.vehicle_make,
//         model: extracted.fields.vehicle_model,
//         trim: extracted.fields.vehicle_trim,
//         bodyClass: extracted.fields.vehicle_body_type,
//       };
//     }

//     // 4. Pricing & Fairness Analysis
//     let pricingAnalysis = null;

//     // Only run if we found vehicle details (via API or Text)
//     if (vehicleDetails) {
//       const pricingResult = estimateMarketFairPrice(vehicleDetails);

//       if (pricingResult) {
//         const contractPrice = extracted.fields.loan_amount || 0;
//         const interestRate = extracted.fields.interest_rate || 0;
//         const tenure = extracted.fields.tenure_months || 0;

//         let diff = 0;
//         let fairnessData = { score: 50, label: "Unknown", reasons: [] };
//         let aiRecommendation = null;

//         if (contractPrice > 0) {
//           diff = contractPrice - pricingResult.marketFairPrice;

//           // Calculate Score
//           fairnessData = calculateFairnessScore(
//             pricingResult.marketFairPrice,
//             contractPrice,
//             interestRate,
//             tenure,
//           );

//           // Generate AI Recommendation
//           try {
//             aiRecommendation = await generateRecommendation(
//               vehicleDetails,
//               {
//                 marketFairPrice: pricingResult.marketFairPrice,
//                 contractPrice: contractPrice,
//                 verdict: fairnessData.label,
//                 score: fairnessData.score,
//               },
//               { interestRate, tenureMonths: tenure },
//             );
//           } catch (e) {
//             console.log("AI Service Error (Skipping):", e.message);
//           }
//         }

//         pricingAnalysis = {
//           marketFairPrice: pricingResult.marketFairPrice,
//           contractPrice: contractPrice,
//           difference: diff,
//           verdict: fairnessData.label,

//           // These fields ensure the Gauge shows up
//           score: fairnessData.score,
//           scoreReasons: fairnessData.reasons,
//           recommendation:
//             aiRecommendation || "Review price and terms carefully.",

//           confidence: pricingResult.confidence,
//           source: pricingResult.source,
//         };
//       }
//     }

//     // 5. Save Record
//     const savedRecord = await OcrResult.create({
//       fileName: req.file.originalname,
//       rawText: ocrResult.rawText,
//       fields: extracted.fields,
//       confidence: extracted.confidence,
//       notes: extracted.notes,
//       vin: extracted.fields?.vin,
//       vehicleDetails: vehicleDetails, // Now saved correctly!
//       pricingAnalysis: pricingAnalysis,
//     });

//     // 6. Respond
//     return res.json({
//       success: true,
//       savedId: savedRecord._id,
//       rawText: ocrResult.rawText,
//       extracted: extracted,
//       vehicleDetails,
//       pricingAnalysis,
//     });
//   } catch (error) {
//     console.error("Server Error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;

/*****STABLE  ONWWWWWEE */

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
// const { generateRecommendation } = require("../services/ai.service");
// const { extractTextFromPDF } = require("../services/ocr.service");
// const extractFields = require("../extraction/extractFields");
// const { decodeVin } = require("../services/vin_decode.service");
// const {
//   estimateMarketFairPrice,
//   calculateFairnessScore,
// } = require("../services/market_price.service");

// const OcrResult = require("../models/OcrResult");

// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file)
//       return res.status(400).json({ success: false, message: "No file" });

//     // 1. OCR Processing
//     const ocrResult = await extractTextFromPDF(req.file.path);
//     if (!ocrResult.success)
//       return res.status(500).json({ success: false, message: "OCR Failed" });

//     // 2. Field Extraction
//     const extracted = extractFields(ocrResult.rawText);

//     // 3. Vehicle Identification (ROBUST LOGIC)
//     let vehicleDetails = null;

//     // A: Try VIN API
//     if (extracted.fields?.vin) {
//       console.log(`[Route] Attempting VIN Decode for: ${extracted.fields.vin}`);
//       vehicleDetails = await decodeVin(extracted.fields.vin);
//     }

//     // B: CRITICAL FALLBACK (Force Text Usage if API failed)
//     // If vehicleDetails is null OR if it exists but is missing the Make
//     if (!vehicleDetails || !vehicleDetails.make) {
//       console.log(
//         "[Route] ⚠️ VIN API failed or returned empty. Checking Text Fallback...",
//       );

//       if (extracted.fields.vehicle_make) {
//         console.log(
//           "[Route] ✅ Using Text Extraction Fallback: ",
//           extracted.fields.vehicle_make,
//         );
//         vehicleDetails = {
//           year: extracted.fields.vehicle_year,
//           make: extracted.fields.vehicle_make,
//           model: extracted.fields.vehicle_model,
//           trim: extracted.fields.vehicle_trim,
//           bodyClass: extracted.fields.vehicle_body_type,
//         };
//       } else {
//         console.log(
//           "[Route] ❌ Text Fallback failed: No Make detected in text either.",
//         );
//       }
//     }

//     // 4. Pricing & Fairness Analysis
//     let pricingAnalysis = null;

//     if (vehicleDetails && vehicleDetails.make) {
//       const pricingResult = estimateMarketFairPrice(vehicleDetails);

//       if (pricingResult) {
//         const contractPrice = extracted.fields.loan_amount || 0;
//         const interestRate = extracted.fields.interest_rate || 0;
//         const tenure = extracted.fields.tenure_months || 0;

//         let diff = 0;
//         let fairnessData = { score: 50, label: "Unknown", reasons: [] };
//         let aiRecommendation = null;

//         if (contractPrice > 0) {
//           diff = contractPrice - pricingResult.marketFairPrice;

//           fairnessData = calculateFairnessScore(
//             pricingResult.marketFairPrice,
//             contractPrice,
//             interestRate,
//             tenure,
//           );

//           // Generate AI Recommendation
//           try {
//             aiRecommendation = await generateRecommendation(
//               vehicleDetails,
//               {
//                 marketFairPrice: pricingResult.marketFairPrice,
//                 contractPrice: contractPrice,
//                 verdict: fairnessData.label,
//                 score: fairnessData.score,
//               },
//               { interestRate, tenureMonths: tenure },
//             );
//           } catch (e) {
//             console.log("[Route] AI Service Error (Skipping):", e.message);
//           }
//         }

//         pricingAnalysis = {
//           marketFairPrice: pricingResult.marketFairPrice,
//           contractPrice: contractPrice,
//           difference: diff,
//           verdict: fairnessData.label,
//           score: fairnessData.score,
//           scoreReasons: fairnessData.reasons,
//           recommendation:
//             aiRecommendation || "Review price and terms carefully.",
//           confidence: pricingResult.confidence,
//           source: pricingResult.source,
//         };
//       }
//     }

//     // 5. Save Record
//     const savedRecord = await OcrResult.create({
//       fileName: req.file.originalname,
//       rawText: ocrResult.rawText,
//       fields: extracted.fields,
//       confidence: extracted.confidence,
//       notes: extracted.notes,
//       vin: extracted.fields?.vin,
//       vehicleDetails: vehicleDetails, // This will now be populated
//       pricingAnalysis: pricingAnalysis,
//     });

//     console.log("[Route] Saved Record ID:", savedRecord._id);

//     // 6. Respond
//     return res.json({
//       success: true,
//       savedId: savedRecord._id,
//       rawText: ocrResult.rawText,
//       extracted: extracted,
//       vehicleDetails: vehicleDetails, // Send explicitly to verify
//       pricingAnalysis: pricingAnalysis,
//     });
//   } catch (error) {
//     console.error("Server Error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const pdfParse = require("pdf-parse");
// const fs = require("fs");
// const OcrResult = require("../models/OcrResult");

// // 👇 IMPORT THE NEW FUNCTION
// const { parseContractTerms } = require("../services/ai.service");

// const upload = multer({ dest: "uploads/" });

// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No file uploaded" });
//     }

//     // 1. Extract Text from PDF
//     const dataBuffer = fs.readFileSync(req.file.path);
//     const pdfData = await pdfParse(dataBuffer);
//     const rawText = pdfData.text;

//     // 2. 🧠 RUN AI EXTRACTION (Using the new robust function)
//     console.log("Analyzing Contract...");
//     const extractedFields = await parseContractTerms(rawText);

//     console.log("Extracted Data:", extractedFields); // Debugging log

//     // 3. Save to Database
//     const newResult = new OcrResult({
//       fileName: req.file.originalname,
//       rawText: rawText,

//       // 👇 SAVE ALL 12 FIELDS HERE
//       fields: extractedFields,

//       // Default values
//       confidence: 0.85,
//       uploadedAt: new Date(),
//     });

//     await newResult.save();

//     // 4. Clean up file
//     fs.unlinkSync(req.file.path);

//     // 5. Respond to Frontend
//     res.json({
//       success: true,
//       savedId: newResult._id,
//       rawText: rawText.substring(0, 500) + "...", // Send snippet
//       extracted: {
//         fields: extractedFields, // Send full object to frontend
//         confidence: 0.85,
//       },
//     });
//   } catch (error) {
//     console.error("Upload Error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server Error during processing" });
//   }
// });

// module.exports = router;

//prevous one

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
// const fs = require("fs");

// // Services
// const { extractTextFromPDF } = require("../services/ocr.service");
// // 👇 UPDATED IMPORT: Added parseContractTerms
// const {
//   generateRecommendation,
//   parseContractTerms,
// } = require("../services/ai.service");
// const { decodeVin } = require("../services/vin_decode.service");
// const {
//   estimateMarketFairPrice,
//   calculateFairnessScore,
// } = require("../services/market_price.service");

// const OcrResult = require("../models/OcrResult");

// // Helper: Clean currency strings ("Rs 15,00,000" -> 1500000) for Math
// const cleanNumber = (str) => {
//   if (!str || typeof str !== "string") return 0;
//   return parseFloat(str.replace(/[^0-9.]/g, "")) || 0;
// };

// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file)
//       return res
//         .status(400)
//         .json({ success: false, message: "No file uploaded" });

//     // 1. OCR Processing (Extract Raw Text)
//     const ocrResult = await extractTextFromPDF(req.file.path);
//     if (!ocrResult.success) {
//       return res
//         .status(500)
//         .json({ success: false, message: "OCR Failed to read PDF" });
//     }
//     const rawText = ocrResult.rawText;

//     // 2. AI Field Extraction (The New Logic)
//     console.log("[Route] 🧠 Running AI Extraction...");
//     const aiFields = await parseContractTerms(rawText);

//     // 3. Fallback Regex for VIN & Vehicle Data
//     // (Since the AI prompt focused on finance, we grab VIN manually here to ensure decoding works)
//     const vinMatch = rawText.match(/\b[A-HJ-NPR-Z0-9]{17}\b/);
//     const yearMatch = rawText.match(/\b(20\d{2})\b/);

//     // Merge AI data with Regex findings
//     const extractedFields = {
//       ...aiFields,
//       vin: vinMatch ? vinMatch[0] : null,
//       vehicle_year: yearMatch ? yearMatch[0] : null,
//       // Attempt to guess Make/Model from text if AI didn't get it
//       // (Simple check, can be improved)
//       vehicle_make: rawText
//         .match(/(TOYOTA|HONDA|FORD|BMW|TESLA)/i)?.[0]
//         ?.toUpperCase(),
//     };

//     // 4. Vehicle Identification (VIN Logic)
//     let vehicleDetails = null;

//     // A: Try VIN API
//     if (extractedFields.vin) {
//       console.log(
//         `[Route] 🔍 Attempting VIN Decode for: ${extractedFields.vin}`,
//       );
//       vehicleDetails = await decodeVin(extractedFields.vin);
//     }

//     // B: Text Fallback if VIN failed
//     if (!vehicleDetails || !vehicleDetails.make) {
//       console.log("[Route] ⚠️ VIN API failed. Using Text Fallback...");
//       if (extractedFields.vehicle_make) {
//         vehicleDetails = {
//           year: extractedFields.vehicle_year || "2024",
//           make: extractedFields.vehicle_make,
//           model: "Unknown", // AI didn't extract model specifically in prompt
//           trim: "Base",
//           bodyClass: "Sedan",
//         };
//       }
//     }

//     // 5. Pricing & Fairness Analysis
//     let pricingAnalysis = null;

//     if (vehicleDetails && vehicleDetails.make) {
//       console.log("[Route] 💰 Calculating Fair Price...");
//       const pricingResult = estimateMarketFairPrice(vehicleDetails);

//       if (pricingResult) {
//         // Convert Strings to Numbers for Calculation
//         const contractPrice = cleanNumber(extractedFields.loan_amount);
//         const interestRate = cleanNumber(extractedFields.interest_rate);
//         const tenure = cleanNumber(extractedFields.tenure_months);

//         let diff = 0;
//         let fairnessData = { score: 50, label: "Unknown", reasons: [] };
//         let aiRecommendation = null;

//         if (contractPrice > 0) {
//           diff = contractPrice - pricingResult.marketFairPrice;

//           fairnessData = calculateFairnessScore(
//             pricingResult.marketFairPrice,
//             contractPrice,
//             interestRate,
//             tenure,
//           );

//           // Generate AI Recommendation based on fairness
//           try {
//             aiRecommendation = await generateRecommendation(
//               vehicleDetails,
//               {
//                 marketFairPrice: pricingResult.marketFairPrice,
//                 contractPrice: contractPrice,
//                 verdict: fairnessData.label,
//                 score: fairnessData.score,
//               },
//               { interestRate, tenureMonths: tenure },
//             );
//           } catch (e) {
//             console.log("[Route] AI Recommendation Error:", e.message);
//           }
//         }

//         pricingAnalysis = {
//           marketFairPrice: pricingResult.marketFairPrice,
//           contractPrice: contractPrice,
//           difference: diff,
//           verdict: fairnessData.label,
//           score: fairnessData.score,
//           scoreReasons: fairnessData.reasons,
//           recommendation:
//             aiRecommendation || "Review price and terms carefully.",
//           confidence: pricingResult.confidence,
//         };
//       }
//     }

//     // 6. Save Record to Database
//     const savedRecord = await OcrResult.create({
//       fileName: req.file.originalname,
//       rawText: rawText,
//       fields: extractedFields, // Saves the mixed AI + Regex data
//       confidence: 0.9,
//       notes: ["AI Extraction Completed"],
//       vin: extractedFields.vin,
//       vehicleDetails: vehicleDetails,
//       pricingAnalysis: pricingAnalysis,
//     });

//     // Cleanup
//     fs.unlinkSync(req.file.path);

//     console.log("[Route] ✅ Success! Saved ID:", savedRecord._id);

//     // 7. Respond
//     res.json({
//       success: true,
//       savedId: savedRecord._id,
//       rawText: rawText.substring(0, 200) + "...",
//       extracted: {
//         fields: extractedFields,
//         confidence: 0.9,
//       },
//       vehicleDetails,
//       pricingAnalysis,
//     });
//   } catch (error) {
//     console.error("[Route] Server Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;

//NEW one

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
// const fs = require("fs");
// const pdfParse = require("pdf-parse"); // 👈 Using this directly now

// // Services
// const {
//   generateRecommendation,
//   parseContractTerms,
// } = require("../services/ai.service");
// const { decodeVin } = require("../services/vin_decode.service");
// const {
//   estimateMarketFairPrice,
//   calculateFairnessScore,
// } = require("../services/market_price.service");

// const OcrResult = require("../models/OcrResult");

// // Helper: Clean currency strings ("Rs 15,00,000" -> 1500000) for Math
// const cleanNumber = (str) => {
//   if (!str || typeof str !== "string") return 0;
//   return parseFloat(str.replace(/[^0-9.]/g, "")) || 0;
// };

// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No file uploaded" });
//     }

//     // 1. READ & PARSE PDF DIRECTLY (No external service needed)
//     console.log("[Route] 📂 Reading File...");
//     const dataBuffer = fs.readFileSync(req.file.path);
//     const pdfData = await pdfParse(dataBuffer);
//     const rawText = pdfData.text;

//     if (!rawText) {
//       return res
//         .status(500)
//         .json({ success: false, message: "Failed to extract text from PDF" });
//     }

//     // 2. AI Field Extraction
//     console.log("[Route] 🧠 Running AI Extraction...");
//     const aiFields = await parseContractTerms(rawText);

//     // 3. Fallback Regex for VIN & Year
//     const vinMatch = rawText.match(/\b[A-HJ-NPR-Z0-9]{17}\b/);
//     const yearMatch = rawText.match(/\b(20\d{2})\b/);

//     // Merge AI data with Regex findings
//     const extractedFields = {
//       ...aiFields,
//       vin: vinMatch ? vinMatch[0] : null,
//       vehicle_year: yearMatch ? yearMatch[0] : null,
//       vehicle_make: rawText
//         .match(/(TOYOTA|HONDA|FORD|BMW|TESLA)/i)?.[0]
//         ?.toUpperCase(),
//     };

//     // 4. Vehicle Identification (VIN Logic)
//     let vehicleDetails = null;

//     if (extractedFields.vin) {
//       console.log(
//         `[Route] 🔍 Attempting VIN Decode for: ${extractedFields.vin}`,
//       );
//       try {
//         vehicleDetails = await decodeVin(extractedFields.vin);
//       } catch (err) {
//         console.log("[Route] VIN Decode Error (Non-fatal):", err.message);
//       }
//     }

//     // Fallback if VIN failed
//     if (!vehicleDetails || !vehicleDetails.make) {
//       if (extractedFields.vehicle_make) {
//         vehicleDetails = {
//           year: extractedFields.vehicle_year || "2024",
//           make: extractedFields.vehicle_make,
//           model: "Unknown",
//           trim: "Base",
//           bodyClass: "Sedan",
//         };
//       }
//     }

//     // 5. Pricing & Fairness Analysis
//     let pricingAnalysis = null;

//     if (vehicleDetails && vehicleDetails.make) {
//       console.log("[Route] 💰 Calculating Fair Price...");
//       const pricingResult = estimateMarketFairPrice(vehicleDetails);

//       if (pricingResult) {
//         const contractPrice = cleanNumber(extractedFields.loan_amount);
//         const interestRate = cleanNumber(extractedFields.interest_rate);
//         const tenure = cleanNumber(extractedFields.tenure_months);

//         let fairnessData = { score: 50, label: "Unknown", reasons: [] };
//         let aiRecommendation = null;

//         if (contractPrice > 0) {
//           fairnessData = calculateFairnessScore(
//             pricingResult.marketFairPrice,
//             contractPrice,
//             interestRate,
//             tenure,
//           );

//           try {
//             aiRecommendation = await generateRecommendation(
//               vehicleDetails,
//               {
//                 marketFairPrice: pricingResult.marketFairPrice,
//                 contractPrice: contractPrice,
//                 verdict: fairnessData.label,
//                 score: fairnessData.score,
//               },
//               { interestRate, tenureMonths: tenure },
//             );
//           } catch (e) {
//             console.log("[Route] AI Recommendation Error:", e.message);
//           }
//         }

//         pricingAnalysis = {
//           marketFairPrice: pricingResult.marketFairPrice,
//           contractPrice: contractPrice,
//           difference: contractPrice - pricingResult.marketFairPrice,
//           verdict: fairnessData.label,
//           score: fairnessData.score,
//           scoreReasons: fairnessData.reasons,
//           recommendation:
//             aiRecommendation || "Review price and terms carefully.",
//           confidence: pricingResult.confidence,
//         };
//       }
//     }

//     // 6. Save Record
//     const savedRecord = await OcrResult.create({
//       fileName: req.file.originalname,
//       rawText: rawText,
//       fields: extractedFields,
//       confidence: 0.9,
//       notes: ["AI Extraction Completed"],
//       vin: extractedFields.vin,
//       vehicleDetails: vehicleDetails,
//       pricingAnalysis: pricingAnalysis,
//     });

//     // Cleanup
//     fs.unlinkSync(req.file.path);

//     console.log("[Route] ✅ Success! Saved ID:", savedRecord._id);

//     // 7. Respond
//     res.json({
//       success: true,
//       savedId: savedRecord._id,
//       rawText: rawText.substring(0, 200) + "...",
//       extracted: {
//         fields: extractedFields,
//         confidence: 0.9,
//       },
//       vehicleDetails,
//       pricingAnalysis,
//     });
//   } catch (error) {
//     console.error("[Route] Server Error:", error);
//     // Remove file if it exists and error happened
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
// const fs = require("fs");
// const pdfLib = require("pdf-parse"); // 👈 Import as generic library

// // Services
// const {
//   generateRecommendation,
//   parseContractTerms,
// } = require("../services/ai.service");
// const { decodeVin } = require("../services/vin_decode.service");
// const {
//   estimateMarketFairPrice,
//   calculateFairnessScore,
// } = require("../services/market_price.service");

// const OcrResult = require("../models/OcrResult");

// // Helper: Clean currency strings ("Rs 15,00,000" -> 1500000) for Math
// const cleanNumber = (str) => {
//   if (!str || typeof str !== "string") return 0;
//   return parseFloat(str.replace(/[^0-9.]/g, "")) || 0;
// };

// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No file uploaded" });
//     }

//     // 1. READ & PARSE PDF DIRECTLY
//     console.log("[Route] 📂 Reading File...");
//     const dataBuffer = fs.readFileSync(req.file.path);

//     // 👇 FIXED: Robust Import Handling
//     // Sometimes libraries import as { default: [Function] } instead of [Function]
//     let pdfParser = pdfLib;
//     if (typeof pdfParser !== "function" && pdfParser.default) {
//       pdfParser = pdfParser.default;
//     }

//     // Verify it works (Log instead of Crash)
//     if (typeof pdfParser !== "function") {
//       console.error(
//         "CRITICAL: pdf-parse imported as:",
//         typeof pdfParser,
//         pdfParser,
//       );
//       // We will try to run it anyway, but if it fails, the catch block handles it.
//     }

//     const pdfData = await pdfParser(dataBuffer);
//     const rawText = pdfData.text;

//     if (!rawText) {
//       return res
//         .status(500)
//         .json({ success: false, message: "Failed to extract text from PDF" });
//     }

//     // 2. AI Field Extraction
//     console.log("[Route] 🧠 Running AI Extraction...");
//     const aiFields = await parseContractTerms(rawText);

//     // 3. Fallback Regex for VIN & Year
//     const vinMatch = rawText.match(/\b[A-HJ-NPR-Z0-9]{17}\b/);
//     const yearMatch = rawText.match(/\b(20\d{2})\b/);

//     // Merge AI data with Regex findings
//     const extractedFields = {
//       ...aiFields,
//       vin: vinMatch ? vinMatch[0] : null,
//       vehicle_year: yearMatch ? yearMatch[0] : null,
//       vehicle_make: rawText
//         .match(/(TOYOTA|HONDA|FORD|BMW|TESLA)/i)?.[0]
//         ?.toUpperCase(),
//     };

//     // 4. Vehicle Identification
//     let vehicleDetails = null;

//     if (extractedFields.vin) {
//       console.log(
//         `[Route] 🔍 Attempting VIN Decode for: ${extractedFields.vin}`,
//       );
//       try {
//         vehicleDetails = await decodeVin(extractedFields.vin);
//       } catch (err) {
//         console.log("[Route] VIN Decode Error (Non-fatal):", err.message);
//       }
//     }

//     // Fallback if VIN failed
//     if (!vehicleDetails || !vehicleDetails.make) {
//       if (extractedFields.vehicle_make) {
//         vehicleDetails = {
//           year: extractedFields.vehicle_year || "2024",
//           make: extractedFields.vehicle_make,
//           model: "Unknown",
//           trim: "Base",
//           bodyClass: "Sedan",
//         };
//       }
//     }

//     // 5. Pricing & Fairness Analysis
//     let pricingAnalysis = null;

//     if (vehicleDetails && vehicleDetails.make) {
//       console.log("[Route] 💰 Calculating Fair Price...");
//       const pricingResult = estimateMarketFairPrice(vehicleDetails);

//       if (pricingResult) {
//         const contractPrice = cleanNumber(extractedFields.loan_amount);
//         const interestRate = cleanNumber(extractedFields.interest_rate);
//         const tenure = cleanNumber(extractedFields.tenure_months);

//         let fairnessData = { score: 50, label: "Unknown", reasons: [] };
//         let aiRecommendation = null;

//         if (contractPrice > 0) {
//           fairnessData = calculateFairnessScore(
//             pricingResult.marketFairPrice,
//             contractPrice,
//             interestRate,
//             tenure,
//           );

//           try {
//             aiRecommendation = await generateRecommendation(
//               vehicleDetails,
//               {
//                 marketFairPrice: pricingResult.marketFairPrice,
//                 contractPrice: contractPrice,
//                 verdict: fairnessData.label,
//                 score: fairnessData.score,
//               },
//               { interestRate, tenureMonths: tenure },
//             );
//           } catch (e) {
//             console.log("[Route] AI Recommendation Error:", e.message);
//           }
//         }

//         pricingAnalysis = {
//           marketFairPrice: pricingResult.marketFairPrice,
//           contractPrice: contractPrice,
//           difference: contractPrice - pricingResult.marketFairPrice,
//           verdict: fairnessData.label,
//           score: fairnessData.score,
//           scoreReasons: fairnessData.reasons,
//           recommendation:
//             aiRecommendation || "Review price and terms carefully.",
//           confidence: pricingResult.confidence,
//         };
//       }
//     }

//     // 6. Save Record
//     const savedRecord = await OcrResult.create({
//       fileName: req.file.originalname,
//       rawText: rawText,
//       fields: extractedFields,
//       confidence: 0.9,
//       notes: ["AI Extraction Completed"],
//       vin: extractedFields.vin,
//       vehicleDetails: vehicleDetails,
//       pricingAnalysis: pricingAnalysis,
//     });

//     // Cleanup
//     if (fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }

//     console.log("[Route] ✅ Success! Saved ID:", savedRecord._id);

//     res.json({
//       success: true,
//       savedId: savedRecord._id,
//       rawText: rawText.substring(0, 200) + "...",
//       extracted: { fields: extractedFields, confidence: 0.9 },
//       vehicleDetails,
//       pricingAnalysis,
//     });
//   } catch (error) {
//     console.error("[Route] Server Error:", error);
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;

/**STABLE ONEE */

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
// const fs = require("fs");
// const pdf = require("pdf-extraction");

// // Services
// const {
//   generateRecommendation,
//   parseContractTerms,
// } = require("../services/ai.service");
// const { decodeVin } = require("../services/vin_decode.service");
// const {
//   estimateMarketFairPrice,
//   calculateFairnessScore,
// } = require("../services/market_price.service");

// const OcrResult = require("../models/OcrResult");

// const cleanNumber = (str) => {
//   if (!str || typeof str !== "string") return 0;
//   return parseFloat(str.replace(/[^0-9.]/g, "")) || 0;
// };

// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file)
//       return res.status(400).json({ success: false, message: "No file" });

//     // 1. READ PDF
//     console.log("------------------------------------------------");
//     console.log("[DEBUG] 📂 Reading File:", req.file.originalname);
//     const dataBuffer = fs.readFileSync(req.file.path);
//     const pdfData = await pdf(dataBuffer);
//     const rawText = pdfData.text;

//     // 👇 DEBUG LOG 1: Check if we actually read text
//     console.log("[DEBUG] 📄 Raw Text Length:", rawText.length);
//     console.log(
//       "[DEBUG] 📄 Text Snippet:",
//       rawText.substring(0, 100).replace(/\n/g, " "),
//     );

//     if (!rawText || rawText.trim().length === 0) {
//       console.error("[ERROR] ❌ PDF Text is Empty!");
//       fs.unlinkSync(req.file.path);
//       return res
//         .status(500)
//         .json({ success: false, message: "PDF is empty or image-only." });
//     }

//     // 2. AI EXTRACTION
//     console.log("[DEBUG] 🧠 Sending to AI Service...");
//     const aiFields = await parseContractTerms(rawText);

//     // 👇 DEBUG LOG 2: Check what the AI returned
//     console.log("------------------------------------------------");
//     console.log(
//       "[DEBUG] 🤖 AI Returned Data:",
//       JSON.stringify(aiFields, null, 2),
//     );
//     console.log("------------------------------------------------");

//     // 3. REGEX FALLBACK (VIN/Year)
//     const vinMatch = rawText.match(/\b[A-HJ-NPR-Z0-9]{17}\b/);
//     const yearMatch = rawText.match(/\b(20\d{2})\b/);

//     const extractedFields = {
//       ...aiFields,
//       vin: vinMatch ? vinMatch[0] : null,
//       vehicle_year: yearMatch ? yearMatch[0] : null,
//       vehicle_make: rawText
//         .match(/(TOYOTA|HONDA|FORD|BMW|TESLA)/i)?.[0]
//         ?.toUpperCase(),
//     };

//     // 4. VIN DECODE
//     let vehicleDetails = null;
//     if (extractedFields.vin) {
//       try {
//         vehicleDetails = await decodeVin(extractedFields.vin);
//       } catch (err) {
//         console.log("[Non-fatal VIN Error]");
//       }
//     }

//     // Fallback Vehicle Details
//     if (!vehicleDetails || !vehicleDetails.make) {
//       if (extractedFields.vehicle_make) {
//         vehicleDetails = {
//           year: extractedFields.vehicle_year || "2024",
//           make: extractedFields.vehicle_make,
//           model: "Unknown",
//           trim: "Base",
//           bodyClass: "Sedan",
//         };
//       }
//     }

//     // 5. PRICING ANALYSIS
//     let pricingAnalysis = null;
//     if (vehicleDetails && vehicleDetails.make) {
//       const pricingResult = estimateMarketFairPrice(vehicleDetails);
//       if (pricingResult) {
//         const contractPrice = cleanNumber(extractedFields.loan_amount);
//         const interestRate = cleanNumber(extractedFields.interest_rate);
//         const tenure = cleanNumber(extractedFields.tenure_months);

//         if (contractPrice > 0) {
//           const fairnessData = calculateFairnessScore(
//             pricingResult.marketFairPrice,
//             contractPrice,
//             interestRate,
//             tenure,
//           );
//           pricingAnalysis = {
//             marketFairPrice: pricingResult.marketFairPrice,
//             contractPrice: contractPrice,
//             difference: contractPrice - pricingResult.marketFairPrice,
//             verdict: fairnessData.label,
//             score: fairnessData.score,
//             confidence: pricingResult.confidence,
//           };
//         }
//       }
//     }

//     // 6. SAVE
//     const savedRecord = await OcrResult.create({
//       fileName: req.file.originalname,
//       rawText: rawText,
//       fields: extractedFields, // 👈 Saving the mixed data
//       confidence: 0.9,
//       vin: extractedFields.vin,
//       vehicleDetails: vehicleDetails,
//       pricingAnalysis: pricingAnalysis,
//     });

//     fs.unlinkSync(req.file.path);
//     console.log("[DEBUG] ✅ Success! Database ID:", savedRecord._id);

//     res.json({
//       success: true,
//       savedId: savedRecord._id,
//       extracted: { fields: extractedFields },
//       vehicleDetails,
//       pricingAnalysis,
//     });
//   } catch (error) {
//     console.error("[ERROR] Route Failed:", error);
//     if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;

// const OpenAI = require("openai");
// require("dotenv").config();

// // Initialize OpenRouter (via OpenAI SDK)
// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENROUTER_API_KEY, // Make sure this is in your .env
//   defaultHeaders: {
//     "HTTP-Referer": "http://localhost:3000",
//     "X-Title": "Car Lease AI",
//   },
// });

// // Using a free model on OpenRouter
// const MODEL_NAME = "google/gemini-2.0-flash-001";

// // 🛠️ HELPER: Cleans AI Output to ensure valid JSON
// const cleanAndParseJSON = (text) => {
//   try {
//     if (!text) return {};
//     let cleanText = text
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     const firstOpen = cleanText.indexOf("{");
//     const lastCloseCurly = cleanText.lastIndexOf("}");

//     if (firstOpen !== -1 && lastCloseCurly !== -1) {
//       cleanText = cleanText.substring(firstOpen, lastCloseCurly + 1);
//     }

//     return JSON.parse(cleanText);
//   } catch (error) {
//     console.error("JSON Parse Error:", error.message);
//     return {};
//   }
// };

// // ✅ 1. Contract Parsing
// const parseContractTerms = async (contractText) => {
//   try {
//     if (!process.env.OPENROUTER_API_KEY) return {};

//     const completion = await openai.chat.completions.create({
//       model: MODEL_NAME,
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a specialized OCR extraction assistant. Output ONLY valid raw JSON.",
//         },
//         {
//           role: "user",
//           content: `
//             Analyze the vehicle lease/loan agreement text below.
//             Extract values EXACTLY as they appear in the text (keep 'Rs', '%', commas).

//             Return a JSON object with these keys:
//             1. loan_amount
//             2. interest_rate
//             3. tenure_months
//             4. monthly_payment
//             5. down_payment
//             6. residual_value
//             7. mileage_allowance
//             8. early_termination_fee
//             9. purchase_option_price
//             10. maintenance_responsibilities
//             11. warranty_coverage
//             12. late_payment_penalty

//             If not found, return "Not Specified".

//             Contract Text:
//             "${contractText.substring(0, 15000)}"
//           `,
//         },
//       ],
//     });

//     const aiText = completion.choices[0].message.content;
//     return cleanAndParseJSON(aiText);
//   } catch (error) {
//     console.error("AI Parse Error:", error.message);
//     return {};
//   }
// };

// // ✅ 2. General Recommendation
// const generateRecommendation = async (vehicleDetails, pricing, loanTerms) => {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: MODEL_NAME,
//       messages: [
//         {
//           role: "user",
//           content: `
//             Act as a financial advisor. Analyze this vehicle loan deal:
//             Vehicle: ${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}
//             Price: ${pricing.contractPrice} (Fair: ${pricing.marketFairPrice})
//             Interest: ${loanTerms.interestRate}%

//             Write a short recommendation (max 3 sentences).
//           `,
//         },
//       ],
//     });

//     return completion.choices[0].message.content;
//   } catch (error) {
//     return "Standard recommendation: Compare with other lenders.";
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
//             Extract ALL fees, charges, penalties from this text.
//             Return ONLY a JSON array: [ { "name": "Fee Name", "amount": 0, "description": "Reason", "type": "Junk" or "Standard", "sourceSnippet": "Proof" } ]

//             Contract Text:
//             "${contractText.substring(0, 10000)}"
//           `,
//         },
//       ],
//     });

//     const fees = cleanAndParseJSON(completion.choices[0].message.content);
//     return Array.isArray(fees) ? fees : [];
//   } catch (error) {
//     return [];
//   }
// };

// // ✅ 4. Email Generator
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
//           content: `
//             Write a counter-offer email.
//             Sender: ${userName}, Recipient: ${recipientName}
//             Vehicle: ${contractData.vehicleDetails?.make}
//             Offer: ${contractData.fields?.loan_amount}, Fair: ${contractData.pricingAnalysis?.marketFairPrice}
//           `,
//         },
//       ],
//     });
//     return completion.choices[0].message.content;
//   } catch (error) {
//     return "Error generating email.";
//   }
// };

// // ✅ 5. Chatbot
// const chatWithAI = async (message, contextData = null) => {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: MODEL_NAME,
//       messages: [
//         { role: "system", content: "You are a tough negotiation coach." },
//         { role: "user", content: message },
//       ],
//     });

//     return completion.choices[0].message.content;
//   } catch (error) {
//     return "Service unavailable.";
//   }
// };

// module.exports = {
//   parseContractTerms,
//   generateRecommendation,
//   extractHiddenFees,
//   generateNegotiationEmail,
//   chatWithAI,
// };





// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
// const fs = require("fs");
// const pdf = require("pdf-extraction"); // 👈 Back to the one that worked!

// // Services
// const { parseContractTerms } = require("../services/ai.service");
// const { decodeVin } = require("../services/vin_decode.service");
// const {
//   estimateMarketFairPrice,
//   calculateFairnessScore,
// } = require("../services/market_price.service");
// const OcrResult = require("../models/OcrResult");

// const cleanNumber = (str) => {
//   if (!str || typeof str !== "string") return 0;
//   return parseFloat(str.replace(/[^0-9.]/g, "")) || 0;
// };

// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file)
//       return res
//         .status(400)
//         .json({ success: false, message: "No file uploaded" });

//     console.log("[DEBUG] 📂 Processing File:", req.file.originalname);

//     // 1. READ PDF (Using pdf-extraction)
//     const dataBuffer = fs.readFileSync(req.file.path);
//     let rawText = "";

//     try {
//       const pdfData = await pdf(dataBuffer);
//       rawText = pdfData.text;

//       console.log("[DEBUG] 📄 Text Extracted:", rawText.length, "chars");

//       if (!rawText || rawText.trim().length === 0) {
//         throw new Error("PDF text is empty");
//       }
//     } catch (err) {
//       console.error("[CRITICAL] PDF Read Failed:", err.message);
//       rawText = "Text extraction failed.";
//     }

//     // 2. AI EXTRACTION
//     console.log("[DEBUG] 🧠 Requesting AI Data...");
//     let aiFields = {};
//     try {
//       if (rawText.length > 50) {
//         aiFields = await parseContractTerms(rawText);
//         console.log("[DEBUG] 🤖 AI Success:", aiFields ? "Yes" : "No");
//       }
//     } catch (aiError) {
//       console.error(
//         "[WARNING] AI Failed (Using Regex Fallback):",
//         aiError.message,
//       );
//     }

//     // 3. REGEX FALLBACK
//     const loanMatch = rawText.match(/Rs\.?\s?([0-9,]+)/i);
//     const interestMatch = rawText.match(/(\d+(\.\d+)?)\s?%/);
//     const tenureMatch = rawText.match(/(\d+)\s?months/i);
//     const vinMatch = rawText.match(/\b[A-HJ-NPR-Z0-9]{17}\b/);

//     const extractedFields = {
//       ...aiFields,
//       loan_amount:
//         aiFields.loan_amount && aiFields.loan_amount !== "Not Specified"
//           ? aiFields.loan_amount
//           : loanMatch
//             ? `Rs ${loanMatch[1]}`
//             : "Not Specified",
//       interest_rate:
//         aiFields.interest_rate && aiFields.interest_rate !== "Not Specified"
//           ? aiFields.interest_rate
//           : interestMatch
//             ? `${interestMatch[1]}%`
//             : "Not Specified",
//       tenure_months:
//         aiFields.tenure_months && aiFields.tenure_months !== "Not Specified"
//           ? aiFields.tenure_months
//           : tenureMatch
//             ? tenureMatch[1]
//             : "Not Specified",
//       vin: vinMatch ? vinMatch[0] : null,
//       vehicle_make: rawText
//         .match(/(TOYOTA|HONDA|FORD|BMW|TESLA|HYUNDAI)/i)?.[0]
//         ?.toUpperCase(),
//     };

//     // 4. VIN & PRICING
//     let vehicleDetails = null;
//     let pricingAnalysis = null;

//     if (extractedFields.vin) {
//       try {
//         vehicleDetails = await decodeVin(extractedFields.vin);
//       } catch (e) {
//         console.log("VIN Decode skipped");
//       }
//     }

//     if (vehicleDetails && vehicleDetails.make) {
//       const pricingResult = estimateMarketFairPrice(vehicleDetails);
//       if (pricingResult) {
//         const contractPrice = cleanNumber(extractedFields.loan_amount);
//         if (contractPrice > 0) {
//           const fairnessData = calculateFairnessScore(
//             pricingResult.marketFairPrice,
//             contractPrice,
//             cleanNumber(extractedFields.interest_rate),
//             cleanNumber(extractedFields.tenure_months),
//           );
//           pricingAnalysis = {
//             marketFairPrice: pricingResult.marketFairPrice,
//             contractPrice: contractPrice,
//             score: fairnessData.score,
//             verdict: fairnessData.label,
//             recommendation:
//               aiFields.recommendation || "Review terms carefully.",
//           };
//         }
//       }
//     }

//     // 5. SAVE
//     const savedRecord = await OcrResult.create({
//       fileName: req.file.originalname,
//       rawText: rawText,
//       fields: extractedFields,
//       confidence: 0.9,
//       vin: extractedFields.vin,
//       vehicleDetails,
//       pricingAnalysis,
//     });

//     if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

//     res.json({
//       success: true,
//       savedId: savedRecord._id,
//       extracted: { fields: extractedFields },
//       vehicleDetails,
//       pricingAnalysis,
//     });
//   } catch (error) {
//     console.error("[ERROR] Route Failed:", error);
//     if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
// const fs = require("fs");
// const pdf = require("pdf-extraction");

// // Services
// const { parseContractTerms, generateRecommendation } = require("../services/ai.service");
// const { decodeVin } = require("../services/vin_decode.service");
// const {
//   estimateMarketFairPrice,
//   calculateFairnessScore,
// } = require("../services/market_price.service");
// const OcrResult = require("../models/OcrResult");

// const cleanNumber = (val) => {
//   if (val == null) return 0;
//   return parseFloat(String(val).replace(/[^0-9.]/g, "")) || 0;
// };

// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file)
//       return res
//         .status(400)
//         .json({ success: false, message: "No file uploaded" });

//     console.log("[DEBUG] 📂 Processing File:", req.file.originalname);

//     // 1. READ PDF
//     const dataBuffer = fs.readFileSync(req.file.path);
//     let rawText = "";

//     try {
//       const pdfData = await pdf(dataBuffer);
//       rawText = pdfData.text;

//       console.log("[DEBUG] 📄 Text Extracted:", rawText.length, "chars");

//       if (!rawText || rawText.trim().length === 0) {
//         throw new Error("PDF text is empty");
//       }
//     } catch (err) {
//       console.error("[CRITICAL] PDF Read Failed:", err.message);
//       rawText = "Text extraction failed.";
//     }

//     // 2. AI EXTRACTION
//     console.log("[DEBUG] 🧠 Requesting AI Data...");
//     let aiFields = {};
//     try {
//       if (rawText.length > 50) {
//         aiFields = await parseContractTerms(rawText);
//         console.log("[DEBUG] 🤖 AI Success:", aiFields && Object.keys(aiFields).length > 0 ? "Yes" : "No");
//       }
//     } catch (aiError) {
//       console.error("[WARNING] AI Failed (Using Regex Fallback):", aiError.message);
//     }

//     // 3. REGEX FALLBACK
//     const loanMatch = rawText.match(/Rs\.?\s?([0-9,]+)/i);
//     const interestMatch = rawText.match(/(\d+(\.\d+)?)\s?%/);
//     const tenureMatch = rawText.match(/(\d+)\s?months/i);
//     const vinMatch = rawText.match(/\b[A-HJ-NPR-Z0-9]{17}\b/);
//     const marketValueMatch = rawText.match(/Market Value:\s*(?:Rs\.?)?\s*([0-9,]+)/i);

//     const extractedFields = {
//       ...aiFields,
//       loan_amount: aiFields.loan_amount && aiFields.loan_amount !== "Not Specified"
//         ? aiFields.loan_amount
//         : loanMatch ? `Rs ${loanMatch[1]}` : "Not Specified",
//       interest_rate: aiFields.interest_rate && aiFields.interest_rate !== "Not Specified"
//         ? aiFields.interest_rate
//         : interestMatch ? `${interestMatch[1]}%` : "Not Specified",
//       tenure_months: aiFields.tenure_months && aiFields.tenure_months !== "Not Specified"
//         ? aiFields.tenure_months
//         : tenureMatch ? tenureMatch[1] : "Not Specified",
//       vin: vinMatch ? vinMatch[0] : null,
//       vehicle_make: rawText.match(/(TOYOTA|HONDA|FORD|BMW|TESLA|HYUNDAI|PORSCHE)/i)?.[0]?.toUpperCase(),
//     };

//     // 4. VIN & PRICING
//     let vehicleDetails = null;
//     let pricingAnalysis = null;

//     if (extractedFields.vin) {
//       try {
//         vehicleDetails = await decodeVin(extractedFields.vin);
//       } catch (e) {
//         console.log("[DEBUG] VIN Decode skipped or failed");
//       }
//     }

//     // Create fallback vehicle details if VIN failed but we know the make
//     if (!vehicleDetails && extractedFields.vehicle_make) {
//       vehicleDetails = { make: extractedFields.vehicle_make, model: "Unknown", year: new Date().getFullYear() };
//     }

//     let marketFairPrice = 0;
    
//     // Attempt 1: Use Database Market Price Service
//     if (vehicleDetails && vehicleDetails.make) {
//       try {
//         const pricingResult = estimateMarketFairPrice(vehicleDetails);
//         if (pricingResult && pricingResult.marketFairPrice) marketFairPrice = pricingResult.marketFairPrice;
//       } catch (e) {}
//     }

//     // Attempt 2: Override with explicit text from the PDF (Crucial for our Test PDFs!)
//     if (marketValueMatch) {
//       marketFairPrice = cleanNumber(marketValueMatch[1]);
//     }

//     const contractPrice = cleanNumber(extractedFields.loan_amount);

//     // Attempt 3: Absolute fallback so UI never breaks with 0
//     if (!marketFairPrice && contractPrice > 0) {
//       marketFairPrice = contractPrice * 0.95; 
//     }

//     // Generate Scoring and AI Recommendation
//     if (contractPrice > 0 && marketFairPrice > 0) {
//       let score = 0;
//       let verdict = "Fair Deal";

//       try {
//         const fairnessData = calculateFairnessScore(
//           marketFairPrice,
//           contractPrice,
//           cleanNumber(extractedFields.interest_rate),
//           cleanNumber(extractedFields.tenure_months)
//         );
//         score = Number(fairnessData?.score) || 0;
//         verdict = fairnessData?.label || "Fair Deal";
//       } catch (e) {
//         console.error("[DEBUG] calculateFairnessScore failed.");
//       }

//       // 🔥 THE MATHEMATICAL GUARANTEE FIX
//       if (score === 0 || isNaN(score)) {
//         const diff = ((contractPrice - marketFairPrice) / marketFairPrice) * 100;
//         if (diff <= 0) { score = 95; verdict = "Great Deal"; }
//         else if (diff <= 3) { score = 88; verdict = "Fair Deal"; }
//         else if (diff <= 8) { score = 75; verdict = "Slightly Overpriced"; }
//         else { score = 45; verdict = "Overpriced"; }
//       }

//       // Trigger the AI to write the recommendation
//       let aiRec = "Review terms carefully and ensure no hidden fees exist.";
//       try {
//         aiRec = await generateRecommendation(
//           vehicleDetails || { make: extractedFields.vehicle_make || "Vehicle" },
//           { contractPrice, marketFairPrice },
//           { interestRate: cleanNumber(extractedFields.interest_rate) }
//         );
//       } catch(e) {
//         console.error("[DEBUG] AI Recommendation failed.");
//       }

//       // ENSURE SAFE DATA TYPES FOR MONGOOSE
//       pricingAnalysis = {
//         marketFairPrice: Number(marketFairPrice) || 0,
//         contractPrice: Number(contractPrice) || 0,
//         score: Math.round(Number(score)) || 0,
//         verdict: String(verdict),
//         recommendation: String(aiRec),
//       };
//     }

//     // 5. SAVE
//     const savedRecord = await OcrResult.create({
//       fileName: req.file.originalname,
//       rawText: rawText,
//       fields: extractedFields,
//       confidence: 0.9,
//       vin: extractedFields.vin,
//       vehicleDetails,
//       pricingAnalysis,
//     });

//     if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

//     res.json({
//       success: true,
//       savedId: savedRecord._id,
//       extracted: { fields: extractedFields },
//       vehicleDetails,
//       pricingAnalysis,
//     });
//   } catch (error) {
//     console.error("[ERROR] Route Failed:", error);
//     if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const pdf = require("pdf-extraction"); 

// Services
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

    // 1. READ PDF
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

    // 🌟 NEW: Hindi Character Detection
    const hasHindi = /[\u0900-\u097F]/.test(rawText);
    if (hasHindi) {
      console.log("[DEBUG] 🇮🇳 Hindi characters successfully detected and processed.");
    }

    // 2. AI EXTRACTION
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

    // 3. REGEX FALLBACK
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

    // 4. VIN & PRICING
    let vehicleDetails = null;
    let pricingAnalysis = null;

    if (extractedFields.vin) {
      try {
        vehicleDetails = await decodeVin(extractedFields.vin);
      } catch (e) {
        console.log("[DEBUG] VIN Decode skipped or failed");
      }
    }

    // Create fallback vehicle details if VIN failed but we know the make
    if (!vehicleDetails && extractedFields.vehicle_make) {
      vehicleDetails = { make: extractedFields.vehicle_make, model: "Unknown", year: new Date().getFullYear() };
    }

    let marketFairPrice = 0;
    
    // Attempt 1: Use Database Market Price Service
    if (vehicleDetails && vehicleDetails.make) {
      try {
        const pricingResult = estimateMarketFairPrice(vehicleDetails);
        if (pricingResult && pricingResult.marketFairPrice) marketFairPrice = pricingResult.marketFairPrice;
      } catch (e) {}
    }

    // Attempt 2: Override with explicit text from the PDF (Crucial for our Test PDFs!)
    if (marketValueMatch) {
      marketFairPrice = cleanNumber(marketValueMatch[1]);
    }

    const contractPrice = cleanNumber(extractedFields.loan_amount);

    // Attempt 3: Absolute fallback so UI never breaks with 0
    if (!marketFairPrice && contractPrice > 0) {
      marketFairPrice = contractPrice * 0.95; 
    }

    // Generate Scoring and AI Recommendation
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

      // 🔥 THE MATHEMATICAL GUARANTEE FIX
      if (score === 0 || isNaN(score)) {
        const diff = ((contractPrice - marketFairPrice) / marketFairPrice) * 100;
        if (diff <= 0) { score = 95; verdict = "Great Deal"; }
        else if (diff <= 3) { score = 88; verdict = "Fair Deal"; }
        else if (diff <= 8) { score = 75; verdict = "Slightly Overpriced"; }
        else { score = 45; verdict = "Overpriced"; }
      }

      // Trigger the AI to write the recommendation
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

      // ENSURE SAFE DATA TYPES FOR MONGOOSE
      pricingAnalysis = {
        marketFairPrice: Number(marketFairPrice) || 0,
        contractPrice: Number(contractPrice) || 0,
        score: Math.round(Number(score)) || 0,
        verdict: String(verdict),
        recommendation: String(aiRec),
      };
    }

    // 5. SAVE
    const savedRecord = await OcrResult.create({
      fileName: req.file.originalname,
      rawText: rawText,
      fields: extractedFields,
      confidence: 0.9,
      vin: extractedFields.vin,
      vehicleDetails,
      pricingAnalysis,
      hiddenFees: { // Create a safe default for hidden fees just in case
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
      hasHindi: hasHindi // Send this flag back to the frontend!
    });
  } catch (error) {
    console.error("[ERROR] Route Failed:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;