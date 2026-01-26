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


const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const { extractTextFromPDF } = require("../services/ocr.service");
const extractFields = require("../extraction/extractFields");
const { decodeVin } = require("../services/vin_decode.service");
const { estimateMarketFairPrice } = require("../services/market_price.service");
const OcrResult = require("../models/OcrResult");

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const debugMode = req.query.debug === "true";
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;

    // 1. Extract Text
    const ocrResult = await extractTextFromPDF(filePath);

    if (!ocrResult.success) {
      return res.status(500).json({
        success: false,
        message: "OCR Processing failed",
        error: ocrResult.error,
      });
    }

    // 2. Extract Fields (including text-based vehicle details)
    const extracted = extractFields(ocrResult.rawText);

    if (debugMode) {
      console.log("\n===== OCR DEBUG MODE ENABLED =====");
      console.log("\nEXTRACTION RESULT:\n", JSON.stringify(extracted, null, 2));
      console.log("=================================\n");
    }

    // --- 3. DECODE VIN OR USE TEXT FALLBACK ---
    let vehicleDetails = null;

    // A. Try API Decoding first
    if (extracted.fields && extracted.fields.vin) {
      console.log(`Found VIN: ${extracted.fields.vin}, decoding...`);
      vehicleDetails = await decodeVin(extracted.fields.vin);
    }

    // B. Fallback: Use Text Extraction if API failed
    // (This fixes the empty details for synthetic PDFs)
    if (!vehicleDetails || !vehicleDetails.make) {
      console.log("VIN API failed. Checking for text-extracted details...");

      if (extracted.fields.vehicle_make) {
        vehicleDetails = {
          year: extracted.fields.vehicle_year || null,
          make: extracted.fields.vehicle_make || null,
          model: extracted.fields.vehicle_model || null,
          trim: extracted.fields.vehicle_trim || null,
          bodyClass: extracted.fields.vehicle_body_type || null,
        };
        console.log("Using text-extracted vehicle details.");
      }
    }

    // --- 4. MARKET PRICE ANALYSIS ---
    let pricingAnalysis = null;

    // Only run pricing if we successfully got vehicle details
    if (vehicleDetails) {
      const pricingResult = estimateMarketFairPrice(vehicleDetails);

      if (pricingResult) {
        const contractPrice = extracted.fields.loan_amount || null;
        let diff = 0;
        let recommendationText = "";
        let verdict = "Fair";

        if (contractPrice) {
          // Calculate difference
          diff = contractPrice - pricingResult.marketFairPrice;
          verdict = diff > 0 ? "Overpriced" : "Fair";

          // Generate Recommendation text
          if (diff > 50000) {
            recommendationText = `The ${vehicleDetails.make} ${vehicleDetails.model} is priced ₹${diff.toLocaleString()} above market value. It is strongly recommended to negotiate.`;
          } else if (diff > 0) {
            recommendationText = `The vehicle is slightly overpriced. You may proceed but negotiate for better terms.`;
          } else {
            recommendationText = `The contract price is aligned with market value. This appears to be a reasonable deal.`;
          }
        }

        pricingAnalysis = {
          marketFairPrice: pricingResult.marketFairPrice,
          contractPrice: contractPrice,
          difference: diff,
          verdict: verdict,
          confidence: pricingResult.confidence,
          source: pricingResult.source,
          recommendation: recommendationText,
        };
      }
    }

    // --- 5. SAVE TO DATABASE ---
    let savedRecord = null;
    try {
      savedRecord = await OcrResult.create({
        fileName: req.file.originalname || null,
        rawText: ocrResult.rawText,
        fields: extracted.fields || {},
        confidence: extracted.confidence,
        notes: extracted.notes || [],
        vin: extracted.fields?.vin || null,
        vehicleDetails: vehicleDetails,
        pricingAnalysis: pricingAnalysis,
      });
    } catch (dbError) {
      console.error("Database save failed:", dbError.message);
    }

    // --- 6. RETURN RESPONSE ---
    return res.json({
      success: true,
      debug: debugMode,
      savedId: savedRecord ? savedRecord._id : null,
      rawText: ocrResult.rawText,
      extracted: extracted,
      vehicleDetails: vehicleDetails,
      pricingAnalysis: pricingAnalysis,
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unexpected server error",
      error: error.message,
    });
  }
});

module.exports = router;
