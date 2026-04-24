

const mongoose = require("mongoose");

const OcrResultSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  rawText: { type: String }, 

  fields: {
    loan_amount: { type: mongoose.Schema.Types.Mixed }, 
    interest_rate: { type: mongoose.Schema.Types.Mixed },
    tenure_months: { type: mongoose.Schema.Types.Mixed },
    monthly_payment: { type: mongoose.Schema.Types.Mixed },
    down_payment: { type: mongoose.Schema.Types.Mixed },
    residual_value: { type: mongoose.Schema.Types.Mixed },
    mileage_allowance: { type: mongoose.Schema.Types.Mixed },
    early_termination_fee: { type: mongoose.Schema.Types.Mixed },
    late_payment_penalty: { type: mongoose.Schema.Types.Mixed },
    purchase_option_price: { type: mongoose.Schema.Types.Mixed },
    warranty_coverage: { type: String },
    maintenance_responsibilities: { type: String },

    summary: { type: String },
    
  },

  
  vin: { type: String },
  vehicleDetails: { type: Object },

  
  pricingAnalysis: {
    marketFairPrice: { type: Number },
    contractPrice: { type: Number },
    score: { type: Number },
    verdict: { type: String },
    recommendation: { type: String },
  },

 
  hiddenFees: {
    analyzed: { type: Boolean, default: false },
    fees: [
      {
        name: { type: String },
        amount: { type: mongoose.Schema.Types.Mixed },
        description: { type: String },
        type: { type: String }, 
        sourceSnippet: { type: String },
      },
    ],
  },

  confidence: { type: Number },
});

module.exports = mongoose.model("OcrResult", OcrResultSchema);