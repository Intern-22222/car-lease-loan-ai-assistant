const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const OcrResult = require('../models/OcrResult');

router.post('/', auth, async (req, res) => {
  try {
    const { originalId, revisedId } = req.body;
    if (!originalId || !revisedId) {
      return res.status(400).json({ success: false, message: 'Both contract IDs required' });
    }

    const [original, revised] = await Promise.all([
      OcrResult.findById(originalId).lean(),
      OcrResult.findById(revisedId).lean(),
    ]);

    if (!original || !revised) {
      return res.status(404).json({ success: false, message: 'One or both contracts not found' });
    }

    
    const fieldKeys = ['loan_amount', 'interest_rate', 'tenure_months', 'monthly_payment', 'down_payment', 'early_termination_fee', 'late_payment_penalty'];
    const fieldDiffs = fieldKeys.map(key => {
      const before = original.fields?.[key];
      const after = revised.fields?.[key];
      if (!before && !after) return null;
      
      const bNum = parseFloat(String(before || '').replace(/[^0-9.]/g, ''));
      const aNum = parseFloat(String(after || '').replace(/[^0-9.]/g, ''));
      let direction = 'unchanged';
      
      if (!isNaN(bNum) && !isNaN(aNum) && bNum !== aNum) {
       
        const lowerIsBetter = ['interest_rate', 'early_termination_fee', 'late_payment_penalty', 'monthly_payment', 'down_payment'].includes(key);
        direction = aNum < bNum ? (lowerIsBetter ? 'improved' : 'changed') : (lowerIsBetter ? 'worsened' : 'changed');
      }
      return { field: key.replace(/_/g, ' '), before: before || '—', after: after || '—', direction };
    }).filter(Boolean);

   
    const priceChange = {
      originalScore: original.pricingAnalysis?.score,
      revisedScore: revised.pricingAnalysis?.score,
      originalPrice: original.pricingAnalysis?.contractPrice,
      revisedPrice: revised.pricingAnalysis?.contractPrice,
      originalVerdict: original.pricingAnalysis?.verdict,
      revisedVerdict: revised.pricingAnalysis?.verdict,
    };

    
    const origFees = (original.hiddenFees?.fees || []).map(f => f.name);
    const revFees = (revised.hiddenFees?.fees || []).map(f => f.name);
    const feesRemoved = origFees.filter(f => !revFees.includes(f));
    const feesAdded = revFees.filter(f => !origFees.includes(f));

    res.json({
      success: true,
      diff: { fieldDiffs, priceChange, feesRemoved, feesAdded, originalFile: original.fileName, revisedFile: revised.fileName },
    });
  } catch (err) {
    console.error('Diff route error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to compare contracts' });
  }
});

module.exports = router;