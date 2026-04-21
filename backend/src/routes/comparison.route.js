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

/***** STABLE ONEEEEEEEEEEEEEEEEE */

// const express = require("express");
// const router = express.Router();
// const OcrResult = require("../models/OcrResult");
// const { extractHiddenFees } = require("../services/ai.service");

// // POST /api/comparison/compare
// router.post("/compare", async (req, res) => {
//   try {
//     const { ids } = req.body;

//     if (!ids || !Array.isArray(ids) || ids.length < 1) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No IDs provided" });
//     }

//     const records = await OcrResult.find({ _id: { $in: ids } });

//     const processedRecords = await Promise.all(
//       records.map(async (record) => {
//         // Run AI only if not analyzed yet
//         if (!record.hiddenFees || !record.hiddenFees.analyzed) {
//           console.log(`🔍 Analyzing Fees for: ${record.fileName}`);

//           let fees = await extractHiddenFees(record.rawText);

//           // 🛡️ SAFETY CHECK: Ensure it is a valid array before saving
//           if (!Array.isArray(fees)) {
//             console.warn(
//               "⚠️ AI returned invalid fee format. Defaulting to empty.",
//             );
//             fees = [];
//           }

//           record.hiddenFees = { analyzed: true, fees: fees };

//           // Save and catch validation errors without crashing request
//           try {
//             await record.save();
//           } catch (saveError) {
//             console.error("⚠️ Database Save Error:", saveError.message);
//           }
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

// const express = require("express");
// const router = express.Router();
// const OcrResult = require("../models/OcrResult");
// const { extractHiddenFees } = require("../services/ai.service");
// const OpenAI = require("openai"); // Need this for the summary

// // POST /api/comparison/compare
// router.post("/compare", async (req, res) => {
//   try {
//     const { ids } = req.body;
//     if (!ids || !Array.isArray(ids) || ids.length < 1) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No IDs provided" });
//     }

//     const records = await OcrResult.find({ _id: { $in: ids } });

//     // 1. Ensure Fees are Extracted
//     const processedRecords = await Promise.all(
//       records.map(async (record) => {
//         if (!record.hiddenFees || !record.hiddenFees.analyzed) {
//           const fees = await extractHiddenFees(record.rawText);
//           record.hiddenFees = {
//             analyzed: true,
//             fees: Array.isArray(fees) ? fees : [],
//           };
//           await record.save();
//         }
//         return record;
//       }),
//     );

//     // 2. Generate "AI Verdict" (Smart Comparison)
//     // We construct a simple prompt with the key data of each contract
//     let prompt =
//       "Compare these car loan offers and tell me which one is the best financially. Keep it brief (2 sentences).\n\n";

//     processedRecords.forEach((rec, index) => {
//       prompt += `Offer ${index + 1} (${rec.fileName}): Loan ${rec.fields?.loan_amount}, Rate ${rec.fields?.interest_rate}, EMI ${rec.fields?.monthly_payment}, Fees: ${rec.hiddenFees?.fees?.length || 0} hidden fees.\n`;
//     });

//     let aiVerdict = "Comparison could not be generated.";
//     try {
//       // Re-use your existing OpenAI instance logic here directly for speed
//       const openai = new OpenAI({
//         baseURL: "https://openrouter.ai/api/v1",
//         apiKey: process.env.OPENROUTER_API_KEY,
//         defaultHeaders: {
//           "HTTP-Referer": "http://localhost:3000",
//           "X-Title": "Car Lease AI",
//         },
//       });
//       const completion = await openai.chat.completions.create({
//         model: "meta-llama/llama-3.1-8b-instruct",
//         messages: [{ role: "user", content: prompt }],
//       });
//       aiVerdict = completion.choices[0].message.content;
//     } catch (err) {
//       console.error("AI Verdict Failed:", err.message);
//     }

//     res.json({
//       success: true,
//       data: processedRecords,
//       verdict: aiVerdict,
//     });
//   } catch (error) {
//     console.error("Comparison Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;

/*********STABLE  ONEEEEE */

// const express = require("express");
// const router = express.Router();
// const OcrResult = require("../models/OcrResult");
// const { extractHiddenFees } = require("../services/ai.service");
// const OpenAI = require("openai");

// // POST /api/comparison/compare
// router.post("/compare", async (req, res) => {
//   try {
//     const { ids } = req.body;

//     // Basic Validation
//     if (!ids || !Array.isArray(ids) || ids.length < 1) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No IDs provided" });
//     }

//     const records = await OcrResult.find({ _id: { $in: ids } });

//     // 1. Ensure Fees are Extracted (With Safety Nets)
//     const processedRecords = await Promise.all(
//       records.map(async (record) => {
//         // Run AI only if not analyzed yet
//         if (!record.hiddenFees || !record.hiddenFees.analyzed) {
//           console.log(`🔍 Analyzing Fees for: ${record.fileName}`);

//           let fees = await extractHiddenFees(record.rawText);

//           // 🛡️ SAFETY CHECK: Ensure it is a valid array before saving
//           if (!Array.isArray(fees)) {
//             console.warn(
//               `⚠️ AI returned invalid fee format for ${record.fileName}. Defaulting to empty.`,
//             );
//             fees = [];
//           }

//           record.hiddenFees = { analyzed: true, fees: fees };

//           // 🛡️ DB SAFETY: Catch validation errors so the whole request doesn't fail
//           try {
//             await record.save();
//           } catch (saveError) {
//             console.error(
//               `⚠️ Could not save fees for ${record.fileName}:`,
//               saveError.message,
//             );
//             // We continue processing other records even if this one fails
//           }
//         }
//         return record;
//       }),
//     );

//     // 2. Generate "AI Verdict" (Smart Comparison)
//     let aiVerdict = "Comparison analysis pending...";
//     try {
//       if (process.env.OPENROUTER_API_KEY) {
//         // Construct a mini-prompt with the contract data
//         let prompt =
//           "Compare these car loan offers. Pick the financial winner and explain why in 2 sentences.\n\n";

//         processedRecords.forEach((rec, index) => {
//           const rate = rec.fields?.interest_rate || "Unknown";
//           const emi = rec.fields?.monthly_payment || "Unknown";
//           const feeCount = rec.hiddenFees?.fees?.length || 0;
//           prompt += `Offer ${index + 1} (${rec.fileName}): Rate ${rate}, EMI ${emi}, ${feeCount} hidden fees.\n`;
//         });

//         // Call AI directly for speed
//         const openai = new OpenAI({
//           baseURL: "https://openrouter.ai/api/v1",
//           apiKey: process.env.OPENROUTER_API_KEY,
//           defaultHeaders: {
//             "HTTP-Referer": "http://localhost:3000",
//             "X-Title": "Car Lease AI",
//           },
//         });

//         const completion = await openai.chat.completions.create({
//           model: "meta-llama/llama-3.1-8b-instruct",
//           messages: [{ role: "user", content: prompt }],
//         });
//         aiVerdict = completion.choices[0].message.content;
//       }
//     } catch (err) {
//       console.error("AI Verdict Failed:", err.message);
//       aiVerdict = "Could not generate AI comparison at this time.";
//     }

//     // Return Success
//     res.json({
//       success: true,
//       data: processedRecords,
//       verdict: aiVerdict,
//     });
//   } catch (error) {
//     console.error("Comparison Critical Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const OcrResult = require("../models/OcrResult");
// const { extractHiddenFees } = require("../services/ai.service");
// const OpenAI = require("openai");

// // POST /api/comparison/compare
// router.post("/compare", async (req, res) => {
//   try {
//     const { ids } = req.body;

//     // Basic Validation
//     if (!ids || !Array.isArray(ids) || ids.length < 1) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No IDs provided" });
//     }

//     const records = await OcrResult.find({ _id: { $in: ids } });

//     // 1. Ensure Fees are Extracted (With Safety Nets)
//     const processedRecords = await Promise.all(
//       records.map(async (record) => {
//         // Run AI only if not analyzed yet
//         if (!record.hiddenFees || !record.hiddenFees.analyzed) {
//           console.log(`🔍 Analyzing Fees for: ${record.fileName}`);

//           let fees = await extractHiddenFees(record.rawText);

//           // 🛡️ SAFETY CHECK: Ensure it is a valid array before saving
//           if (!Array.isArray(fees)) {
//             console.warn(
//               `⚠️ AI returned invalid fee format for ${record.fileName}. Defaulting to empty.`,
//             );
//             fees = [];
//           }

//           record.hiddenFees = { analyzed: true, fees: fees };

//           // 🛡️ DB SAFETY: Catch validation errors so the whole request doesn't fail
//           try {
//             await record.save();
//           } catch (saveError) {
//             console.error(
//               `⚠️ Could not save fees for ${record.fileName}:`,
//               saveError.message,
//             );
//             // We continue processing other records even if this one fails
//           }
//         }
//         return record;
//       }),
//     );

//     // 2. Generate "AI Verdict" (Smart Comparison)
//     // We use a specific prompt designed to avoid "Financial Advice" refusals
//     let aiVerdict = "Comparison analysis pending...";
//     try {
//       if (process.env.OPENROUTER_API_KEY) {
//         // 👇 UPDATED PROMPT: Frames it as "Data Analysis" instead of "Advice"
//         // This prevents the "I can't help you with that" error
//         // 👇 UPDATED: Tells AI that "Fewer Fees" = "Better/Cleaner"
//         let prompt =
//           "Act as a neutral data analyst. Compare these offers based on cost (Rate, EMI) and safety (Hidden Fees). If an offer has 0 hidden fees, label it as the 'Safest' and 'Cleaner' option. Identify the winner in 2 sentences.\n\nData:\n";

//         processedRecords.forEach((rec, index) => {
//           const rate = rec.fields?.interest_rate || "Unknown";
//           const emi = rec.fields?.monthly_payment || "Unknown";
//           const feeCount = rec.hiddenFees?.fees?.length || 0;
//           prompt += `Option ${index + 1} (${rec.fileName}): Rate ${rate}, EMI ${emi}, ${feeCount} hidden fees found.\n`;
//         });

//         // Call AI directly for speed
//         const openai = new OpenAI({
//           baseURL: "https://openrouter.ai/api/v1",
//           apiKey: process.env.OPENROUTER_API_KEY,
//           defaultHeaders: {
//             "HTTP-Referer": "http://localhost:3000",
//             "X-Title": "Car Lease AI",
//           },
//         });

//         const completion = await openai.chat.completions.create({
//           model: "meta-llama/llama-3.1-8b-instruct",
//           messages: [{ role: "user", content: prompt }],
//         });
//         aiVerdict = completion.choices[0].message.content;
//       }
//     } catch (err) {
//       console.error("AI Verdict Failed:", err.message);
//       aiVerdict = "Could not generate AI comparison at this time.";
//     }

//     // Return Success
//     res.json({
//       success: true,
//       data: processedRecords,
//       verdict: aiVerdict,
//     });
//   } catch (error) {
//     console.error("Comparison Critical Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const OcrResult = require("../models/OcrResult");
const { extractHiddenFees } = require("../services/ai.service");
const OpenAI = require("openai");

router.post("/compare", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.status(400).json({ success: false, message: "No IDs provided" });
    }

    const records = await OcrResult.find({ _id: { $in: ids } });

    const processedRecords = await Promise.all(
      records.map(async (record) => {
        if (!record.hiddenFees || !record.hiddenFees.analyzed) {
          console.log(`🔍 Analyzing Fees for: ${record.fileName}`);
          let fees = await extractHiddenFees(record.rawText);
          if (!Array.isArray(fees)) {
            console.warn(`⚠️ AI returned invalid fee format for ${record.fileName}. Defaulting to empty.`);
            fees = [];
          }
          record.hiddenFees = { analyzed: true, fees: fees };
          try {
            await record.save();
          } catch (saveError) {
            console.error(`⚠️ Could not save fees for ${record.fileName}:`, saveError.message);
          }
        }
        return record;
      }),
    );

    let aiVerdict = "Comparison analysis pending...";
    try {
      if (process.env.OPENROUTER_API_KEY) {
        // 👇 NEW PROMPT: Forces a definitive "🏆 WINNER" output for the new UI
        let prompt = "Act as a neutral financial analyst comparing car loan offers. Evaluate based on lowest EMI, lowest Interest Rate, and fewest hidden fees.\n\nData:\n";

        processedRecords.forEach((rec, index) => {
          const rate = rec.fields?.interest_rate || "Unknown";
          const emi = rec.fields?.monthly_payment || rec.fields?.emi || "Unknown";
          const feeCount = rec.hiddenFees?.fees?.length || 0;
          prompt += `Option ${index + 1} (${rec.fileName}): Rate ${rate}, EMI ${emi}, ${feeCount} hidden fees.\n`;
        });

        prompt += "\nOutput EXACTLY 2-3 sentences. Start your response explicitly with '🏆 WINNER: [Name of the winning option]'. Then explain exactly why it wins (e.g. lowest rate, zero hidden fees). Keep it punchy and direct.";

        const openai = new OpenAI({
          baseURL: "https://openrouter.ai/api/v1",
          apiKey: process.env.OPENROUTER_API_KEY,
          defaultHeaders: {
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "AutoLease AI",
          },
        });

        const completion = await openai.chat.completions.create({
          model: "meta-llama/llama-3.1-8b-instruct",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 150
        });
        aiVerdict = completion.choices[0].message.content;
      }
    } catch (err) {
      console.error("AI Verdict Failed:", err.message);
      aiVerdict = "Could not generate AI comparison at this time.";
    }

    res.json({
      success: true,
      data: processedRecords,
      verdict: aiVerdict,
    });
  } catch (error) {
    console.error("Comparison Critical Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
