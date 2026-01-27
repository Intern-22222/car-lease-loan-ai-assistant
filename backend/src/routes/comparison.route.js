// const express = require("express");
// const router = express.Router();
// const OcrResult = require("../models/OcrResult");
// const { extractHiddenFees } = require("../services/ai.service");

// router.post("/compare", async (req, res) => {
//   try {
//     const { ids } = req.body; // Array of IDs, e.g., ["id1", "id2"]
//     if (!ids || ids.length < 1)
//       return res
//         .status(400)
//         .json({ success: false, message: "No IDs provided" });

//     const records = await OcrResult.find({ _id: { $in: ids } });

//     // Process each record to ensure Hidden Fees are analyzed
//     const processedRecords = await Promise.all(
//       records.map(async (record) => {
//         // If we haven't analyzed fees for this file yet, DO IT NOW.
//         if (!record.hiddenFees || !record.hiddenFees.analyzed) {
//           console.log(`🔍 Running Fee Extraction for ${record.fileName}...`);

//           const fees = await extractHiddenFees(record.rawText);

//           record.hiddenFees = {
//             analyzed: true,
//             fees: fees,
//           };
//           await record.save(); // Save to DB so we don't run AI again
//         }
//         return record;
//       }),
//     );

//     res.json({ success: true, data: processedRecords });
//   } catch (error) {
//     console.error("Comparison Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const OcrResult = require("../models/OcrResult");
const { extractHiddenFees } = require("../services/ai.service");

// POST /api/comparison/compare
router.post("/compare", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res
        .status(400)
        .json({ success: false, message: "No IDs provided" });
    }

    const records = await OcrResult.find({ _id: { $in: ids } });

    const processedRecords = await Promise.all(
      records.map(async (record) => {
        // Run AI only if not analyzed yet
        if (!record.hiddenFees || !record.hiddenFees.analyzed) {
          console.log(`🔍 Analyzing Fees for: ${record.fileName}`);

          let fees = await extractHiddenFees(record.rawText);

          // 🛡️ SAFETY CHECK: Ensure it is a valid array before saving
          if (!Array.isArray(fees)) {
            console.warn(
              "⚠️ AI returned invalid fee format. Defaulting to empty.",
            );
            fees = [];
          }

          record.hiddenFees = { analyzed: true, fees: fees };

          // Save and catch validation errors without crashing request
          try {
            await record.save();
          } catch (saveError) {
            console.error("⚠️ Database Save Error:", saveError.message);
          }
        }
        return record;
      }),
    );

    res.json({ success: true, data: processedRecords });
  } catch (error) {
    console.error("Comparison Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;