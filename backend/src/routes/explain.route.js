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
    const { pricingAnalysis, hiddenFees, vehicleDetails, fields } = req.body;
    const score = pricingAnalysis?.score || 0;
    const verdict = pricingAnalysis?.verdict || 'Unknown';
    const cp = pricingAnalysis?.contractPrice || 0;
    const mp = pricingAnalysis?.marketFairPrice || 0;
    const junkCount = (hiddenFees?.fees || []).filter(f => f.type === 'Junk').length;
    const rate = fields?.interest_rate || 'unknown';
    const vehicle = vehicleDetails ? `${vehicleDetails.make} ${vehicleDetails.model}` : 'vehicle';

    const prompt = `A car loan deal for a ${vehicle} received a fairness score of ${score}/100 (verdict: ${verdict}).

Key data:
- Contract Price: Rs.${cp.toLocaleString()}
- Market Fair Price: Rs.${mp.toLocaleString()}
- Price difference: ${cp > mp ? 'Overpriced by ' + Math.round(((cp-mp)/mp)*100) + '%' : 'Fair or underpriced'}
- Interest Rate: ${rate}
- Junk fees found: ${junkCount}

Generate EXACTLY 4 scoring factors that explain this score. For each factor, state whether it HELPS or HURTS the score and roughly how much impact it has.

Return ONLY this exact format (no markdown, no asterisks, no extra text):
FACTOR: [factor name]
IMPACT: [POSITIVE or NEGATIVE]
POINTS: [number between 5 and 30]
REASON: [one sentence explanation]
---
FACTOR: [factor name]
IMPACT: [POSITIVE or NEGATIVE]
POINTS: [number between 5 and 30]
REASON: [one sentence explanation]
---
FACTOR: [factor name]
IMPACT: [POSITIVE or NEGATIVE]
POINTS: [number between 5 and 30]
REASON: [one sentence explanation]
---
FACTOR: [factor name]
IMPACT: [POSITIVE or NEGATIVE]
POINTS: [number between 5 and 30]
REASON: [one sentence explanation]`;

    const completion = await openai.chat.completions.create({
      model: 'meta-llama/llama-3.1-8b-instruct',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.4,
    });

    const raw = completion.choices[0]?.message?.content || '';

   
    const factors = raw.split('---').map(block => {
      const lines = block.trim().split('\n').filter(Boolean);
      const get = (key) => lines.find(l => l.startsWith(key + ':'))?.replace(key + ':', '').trim() || '';
      return {
        name:    get('FACTOR'),
        impact:  get('IMPACT').toUpperCase(),
        points:  parseInt(get('POINTS')) || 10,
        reason:  get('REASON'),
      };
    }).filter(f => f.name);

    res.json({ success: true, factors });
  } catch (err) {
    console.error('Explain route error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to generate explanation' });
  }
});

module.exports = router;
