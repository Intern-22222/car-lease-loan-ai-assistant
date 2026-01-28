// const express = require("express");
// const router = express.Router();
// const { chatWithAI } = require("../services/ai.service");

// // POST /api/chat
// router.post("/", async (req, res) => {
//   try {
//     const { message, contextData } = req.body;

//     // Call the AI Service
//     const aiResponse = await chatWithAI(message, contextData);

//     res.json({ success: true, reply: aiResponse });
//   } catch (error) {
//     console.error("Chat Error:", error);
//     res.status(500).json({ success: false, message: "AI Chat Failed" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../services/ai.service");
const OcrResult = require("../models/OcrResult"); // Import your DB Model

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    // Frontend sends 'contractId' (or 'contextData' with an id)
    const { message, contractId, contextData: incomingContext } = req.body;

    // Determine the ID to look up
    const idToFetch = contractId || (incomingContext && incomingContext.id);

    let contextData = null;

    // 👇 IF ID PROVIDED, FETCH DATA FROM DB
    if (idToFetch) {
      try {
        const record = await OcrResult.findById(idToFetch);
        if (record) {
          // Prepare simplified data for the AI
          contextData = {
            vehicle:
              `${record.vehicleDetails?.year || ""} ${record.vehicleDetails?.make || ""} ${record.vehicleDetails?.model || ""}`.trim(),
            price: record.pricingAnalysis?.contractPrice,
            fairPrice: record.pricingAnalysis?.marketFairPrice,
            score: record.pricingAnalysis?.score,
            verdict: record.pricingAnalysis?.verdict,
            interest: record.fields?.interest_rate,
            fees: record.hiddenFees?.fees
              ?.map((f) => `${f.name} (${f.amount})`)
              .join(", "),
          };
        }
      } catch (dbError) {
        console.error("Chat Context Lookup Failed:", dbError.message);
        // We continue without context rather than failing completely
      }
    }

    // Call AI with the prepared context
    const aiResponse = await chatWithAI(message, contextData);

    res.json({ success: true, reply: aiResponse });
  } catch (error) {
    console.error("Chat Route Error:", error);
    res.status(500).json({ success: false, message: "AI Chat Failed" });
  }
});

module.exports = router;