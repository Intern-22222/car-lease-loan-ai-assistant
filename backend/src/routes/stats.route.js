const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const OcrResult = require('../models/OcrResult');

router.get('/', auth, async (req, res) => {
  try {
    
    const results = await OcrResult.find({}).lean();
    const total = results.length;
    
    const scores = results.map(r => r.pricingAnalysis?.score).filter(Boolean);
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    
    const allFees = results.flatMap(r => {
      if (Array.isArray(r.hiddenFees)) return r.hiddenFees.filter(f => f.type === 'Junk');
      if (r.hiddenFees && Array.isArray(r.hiddenFees.fees)) return r.hiddenFees.fees.filter(f => f.type === 'Junk');
      return [];
    });
    
    const feeFreq = {};
    allFees.forEach(f => { feeFreq[f.name] = (feeFreq[f.name] || 0) + 1; });
    const topFee = Object.entries(feeFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None yet';
    
    res.json({ success: true, stats: { total, avgScore, topFee } });
  } catch (err) {
    console.error('Stats route error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load stats' });
  }
});

module.exports = router;