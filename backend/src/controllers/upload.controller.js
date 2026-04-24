const { extractTextFromPDF } = require("../services/ocr.service");
const extractFields = require("../extraction/extractFields");
const { decodeVin } = require("../services/vin_decode.service");
const OcrResult = require("../models/OcrResult");
const { estimateMarketFairPrice } = require("../services/market_price.service");

const uploadContract = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const cleanedText = await extractTextFromPDF(req.file.path);

    console.log("========== RAW OCR TEXT ==========");
    console.log(cleanedText);
    console.log("=================================");

    const extractedResult = extractFields(cleanedText);

    console.log("========== EXTRACTED FIELDS ==========");
    console.log(extractedResult.fields);
    console.log("=====================================");

    const ocrResult = await OcrResult.create({
      rawText: cleanedText,
      extractedFields: extractedResult.fields,
      confidence: extractedResult.confidence,
      notes: extractedResult.notes,
      vin: extractedResult.fields?.vin || null,
    });

    if (extractedResult.fields?.vin) {
      const vehicleDetails = await decodeVin(extractedResult.fields.vin);

      if (vehicleDetails) {
        ocrResult.vehicleDetails = vehicleDetails;
        await ocrResult.save();
      }
    }

    

    if (ocrResult.vehicleDetails) {
      const pricingResult = estimateMarketFairPrice(ocrResult.vehicleDetails);

      if (pricingResult) {
        const contractPrice = extractedResult.fields?.loan_amount || null;

        if (contractPrice) {
          
          let recommendationText = "";

          const diff = contractPrice - pricingResult.marketFairPrice;

          if (diff > 50000) {
            recommendationText = `The ${ocrResult.vehicleDetails.make} ${ocrResult.vehicleDetails.model} is priced ₹${diff.toLocaleString()} above market value. 
     It is strongly recommended to negotiate the price or explore similar alternatives in this segment.`;
          } else if (diff > 0) {
            recommendationText = `The vehicle is slightly overpriced compared to market estimates. 
     You may proceed but should negotiate for better terms or added benefits.`;
          } else {
            recommendationText = `The contract price is aligned with market value. 
     This appears to be a reasonable deal for the vehicle.`;
          }

          ocrResult.pricingAnalysis = {
            marketFairPrice: pricingResult.marketFairPrice,
            contractPrice,
            difference: diff,
            verdict: diff > 0 ? "Overpriced" : "Fair",
            confidence: pricingResult.confidence,
            source: pricingResult.source,
            recommendation: recommendationText,
          };

          //};

          await ocrResult.save();
        }
      }
    }

    const finalResult = await OcrResult.findById(ocrResult._id);

    return res.status(200).json(finalResult);
  } catch (error) {
    console.error("Upload failed:", error);
    return res.status(500).json({ error: "Upload processing failed" });
  }
};

module.exports = {
  uploadContract,
};
