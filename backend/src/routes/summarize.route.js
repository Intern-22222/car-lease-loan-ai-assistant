const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const OpenAI = require('openai');

const SITE_URL = process.env.CLIENT_URL || "http://localhost:3000";
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": SITE_URL,
    "X-Title": "AutoLease AI",
  },
});

router.post('/', auth, async (req, res) => {
  try {
    const { rawText, fields, vehicleDetails } = req.body;
    if (!rawText) return res.status(400).json({ success: false, message: 'No contract text provided' });

    const vehicle = vehicleDetails
      ? `${vehicleDetails.year || ''} ${vehicleDetails.make || ''} ${vehicleDetails.model || ''}`.trim()
      : 'the vehicle';

    const prompt = `You are explaining a car lease/loan contract to a first-time car buyer with no legal knowledge.

Contract text (first 8000 chars):
"${rawText.substring(0, 8000)}"

Key extracted terms:
- Loan Amount: ${fields?.loan_amount || 'unknown'}
- Interest Rate: ${fields?.interest_rate || 'unknown'}
- Tenure: ${fields?.tenure_months || 'unknown'} months
- Monthly Payment: ${fields?.monthly_payment || 'unknown'}
- Vehicle: ${vehicle}

Write exactly 3 bullet points in plain English explaining:
1. What the buyer is actually agreeing to (in simple terms)
2. The most important financial obligation (specific numbers)
3. The biggest risk or catch in this contract

Use "You" to address the buyer directly. Keep each bullet to 2 sentences maximum.
No markdown, no bold text, no asterisks. Just plain numbered bullets starting with "1.", "2.", "3.".`;

    const completion = await openai.chat.completions.create({
      model: 'meta-llama/llama-3.1-8b-instruct',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.5,
    });

    const summary = completion.choices[0]?.message?.content || 'Summary unavailable.';
    res.json({ success: true, summary });
  } catch (err) {
    console.error('Summarize route error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to generate summary' });
  }
});

module.exports = router;