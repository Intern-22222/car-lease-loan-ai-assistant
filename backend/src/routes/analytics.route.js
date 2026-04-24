const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const OcrResult = require('../models/OcrResult');

router.get('/', auth, async (req, res) => {
  try {
    
    const results = await OcrResult.find({}).lean();

    
    const now = new Date();
    const monthly = Array(6).fill(0).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        label: d.toLocaleString('default', { month: 'short' }),
        count: results.filter(r => {
          const u = new Date(r.uploadedAt);
          return u.getMonth() === d.getMonth() && u.getFullYear() === d.getFullYear();
        }).length
      };
    });

    
    const scores = results.map(r => r.pricingAnalysis?.score).filter(Boolean);
    const scoreDist = {
      poor: scores.filter(s => s <= 40).length,
      fair: scores.filter(s => s > 40 && s <= 70).length,
      good: scores.filter(s => s > 70).length,
    };

    
    const allFees = results.flatMap(r => {
      if (Array.isArray(r.hiddenFees)) return r.hiddenFees.filter(f => f.type === 'Junk');
      if (r.hiddenFees && Array.isArray(r.hiddenFees.fees)) return r.hiddenFees.fees.filter(f => f.type === 'Junk');
      return [];
    });
    const feeMap = {};
    allFees.forEach(f => { feeMap[f.name] = (feeMap[f.name] || 0) + 1; });
    const topFees = Object.entries(feeMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    
    const pricedResults = results.filter(r => r.pricingAnalysis?.contractPrice);
    const avgPrice = pricedResults.length
      ? pricedResults.reduce((sum, r) => sum + r.pricingAnalysis.contractPrice, 0) / pricedResults.length
      : 0;

    res.json({ 
      success: true, 
      analytics: { monthly, scoreDist, topFees, avgPrice: Math.round(avgPrice), total: results.length } 
    });
  } catch (err) {
    console.error('Analytics route error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load analytics' });
  }
});

module.exports = router;