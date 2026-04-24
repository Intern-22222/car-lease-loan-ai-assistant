

const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../services/ai.service");
const OcrResult = require("../models/OcrResult");
const auth = require("../middlewares/auth.middleware"); // Added auth to secure the route


router.post("/", auth, async (req, res) => {
  try {
    const { message, contractId, contextData: incomingContext } = req.body;
    const idToFetch = contractId || (incomingContext && incomingContext.id);

    let contextData = null;

    
    if (idToFetch) {
      try {
        const record = await OcrResult.findById(idToFetch);
        if (record) {
          
          contextData = {
            vehicle: `${record.vehicleDetails?.year || ""} ${record.vehicleDetails?.make || ""} ${record.vehicleDetails?.model || ""}`.trim(),
            price: record.pricingAnalysis?.contractPrice,
            fairPrice: record.pricingAnalysis?.marketFairPrice,
            score: record.pricingAnalysis?.score,
            verdict: record.pricingAnalysis?.verdict,
            interest: record.fields?.interest_rate,
            
            
            fees: (Array.isArray(record.hiddenFees) 
                    ? record.hiddenFees 
                    : record.hiddenFees?.fees || [])
                  .map((f) => `${f.name} (₹${f.amount || 'Variable'})`)
                  .join(", ")
          };
        }
      } catch (dbError) {
        console.error("Chat Context Lookup Failed:", dbError.message);
      }
    }

  
    const aiResponse = await chatWithAI(message, contextData);

    res.json({ success: true, reply: aiResponse });
  } catch (error) {
    console.error("Chat Route Error:", error);
    res.status(500).json({ success: false, message: "AI Chat Failed" });
  }
});

module.exports = router;