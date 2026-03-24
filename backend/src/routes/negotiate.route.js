const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const OpenAI = require('openai');

// Configure the OpenAI SDK to use OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

router.post('/', auth, async (req, res) => {
  try {
    const { pricingAnalysis, hiddenFees, vehicleDetails } = req.body;
    
    const vehicle = vehicleDetails
      ? `${vehicleDetails.year || ''} ${vehicleDetails.make || ''} ${vehicleDetails.model || ''}`.trim()
      : 'the vehicle';
      
    // Safely extract fees whether it's an array or an object containing a fees array
    let feesArray = [];
    if (Array.isArray(hiddenFees)) {
      feesArray = hiddenFees;
    } else if (hiddenFees && Array.isArray(hiddenFees.fees)) {
      feesArray = hiddenFees.fees;
    }

    const junkFees = feesArray.filter(f => f.type === 'Junk');
    const feeList = junkFees.map(f => `${f.name} (₹${f.amount})`).join(', ') || 'none detected';

    const prompt = `
You are a professional car deal negotiation coach. Generate a 5-step word-for-word negotiation script for a customer talking to a car dealer.

Vehicle: ${vehicle}
Contract Price: ₹${pricingAnalysis?.contractPrice || 'unknown'}
Market Fair Price: ₹${pricingAnalysis?.marketFairPrice || 'unknown'}
Deal Verdict: ${pricingAnalysis?.verdict || 'Overpriced'}
Junk Fees Found: ${feeList}

Write exactly 5 numbered steps. Each step is 2-3 sentences the customer should say out loud.
Be confident, polite, and specific. Reference the actual numbers above.
Return plain text only, no markdown, no asterisks.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo', // OpenRouter prefix formatting
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
      temperature: 0.7,
    });

    const script = completion.choices[0]?.message?.content || 'Unable to generate script.';
    res.json({ success: true, script });
  } catch (err) {
    console.error('Negotiate route error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to generate script' });
  }
});

module.exports = router;