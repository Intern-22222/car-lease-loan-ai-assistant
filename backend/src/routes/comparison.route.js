


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
