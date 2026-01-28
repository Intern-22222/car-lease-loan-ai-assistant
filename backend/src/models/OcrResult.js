// const mongoose = require("mongoose");
// const OcrResultSchema = new mongoose.Schema({
//   uploadedAt: {
//     type: Date,
//     default: Date.now,
//   },
//   fileName: {
//     type: String,
//     required: false,
//   },
//   rawText: {
//     type: String,
//     required: true,
//   },
//   fields: {
//     type: Object,
//     required: false,
//   },
//   confidence: {
//     type: Number,
//     required: true,
//   },
//   notes: {
//     type: [String],
//     required: false,
//   },
//   vin: {
//     type: String,
//     default: null,
//   },

//   vehicleDetails: {
//     year: { type: String, default: null },
//     make: { type: String, default: null },
//     model: { type: String, default: null },
//     trim: { type: String, default: null },
//   },

//   pricingAnalysis: {
//     marketFairPrice: { type: Number, default: null },
//     contractPrice: { type: Number, default: null },
//     difference: { type: Number, default: null },
//     verdict: { type: String, default: null }, // Overpriced / Fair / Underpriced
//     confidence: { type: String, default: null }, // high / medium / low
//     source: { type: String, default: null }, // api / fallback

//     // These MUST be inside this object to match your route logic
//     score: { type: Number, default: null },
//     scoreReasons: { type: [String], default: [] },
//     recommendation: { type: String, default: null },
//   },

// });

// module.exports = mongoose.model("OcrResult", OcrResultSchema);

// const mongoose = require("mongoose");

// const OcrResultSchema = new mongoose.Schema({
//   uploadedAt: {
//     type: Date,
//     default: Date.now,
//   },
//   fileName: {
//     type: String,
//     required: false,
//   },
//   rawText: {
//     type: String,
//     required: true,
//   },
//   fields: {
//     type: Object,
//     required: false,
//   },
//   confidence: {
//     type: Number,
//     required: true,
//   },
//   notes: {
//     type: [String],
//     required: false,
//   },
//   vin: {
//     type: String,
//     default: null,
//   },

//   vehicleDetails: {
//     year: { type: String, default: null },
//     make: { type: String, default: null },
//     model: { type: String, default: null },
//     trim: { type: String, default: null },
//   },

//   // 👇 ERROR WAS HERE: fields were outside this object
//   pricingAnalysis: {
//     marketFairPrice: { type: Number, default: null },
//     contractPrice: { type: Number, default: null },
//     difference: { type: Number, default: null },
//     verdict: { type: String, default: null }, // Overpriced / Fair / Underpriced
//     confidence: { type: String, default: null }, // high / medium / low
//     source: { type: String, default: null }, // api / fallback

//     // ✅ MOVED INSIDE (Correct)
//     score: { type: Number, default: null },
//     scoreReasons: { type: [String], default: [] },
//     recommendation: { type: String, default: null },
//   },
// });

// module.exports = mongoose.model("OcrResult", OcrResultSchema);

/**************STABLEEEEEE ONEEEEEEEE */

// const mongoose = require("mongoose");

// const OcrResultSchema = new mongoose.Schema({
//   uploadedAt: { type: Date, default: Date.now },
//   fileName: { type: String },
//   rawText: { type: String },
//   fields: { type: Object },
//   confidence: { type: Number },
//   notes: { type: [String] },
//   vin: { type: String, default: null },

//   vehicleDetails: {
//     year: { type: String, default: null },
//     make: { type: String, default: null },
//     model: { type: String, default: null },
//     trim: { type: String, default: null },
//     bodyClass: { type: String, default: null },
//   },

//   pricingAnalysis: {
//     marketFairPrice: { type: Number, default: null },
//     contractPrice: { type: Number, default: null },
//     difference: { type: Number, default: null },
//     verdict: { type: String, default: null },
//     confidence: { type: String, default: null },
//     source: { type: String, default: null },

//     // ✅ FIXED: These are now properly nested inside pricingAnalysis
//     score: { type: Number, default: null },
//     scoreReasons: { type: [String], default: [] },
//     recommendation: { type: String, default: null },
//   },

//   hiddenFees: {
//     analyzed: { type: Boolean, default: false },
//     fees: [
//       {
//         name: String,
//         amount: Number,
//         description: String,
//         type: String, // "Junk" or "Standard"
//         sourceSnippet: String, // For verification
//         isVerified: Boolean, // Hallucination check passed?
//       },
//     ],
//   },

// });

// module.exports = mongoose.model("OcrResult", OcrResultSchema);

const mongoose = require("mongoose");

const OcrResultSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  rawText: { type: String }, // Stores full PDF text

  // Extracted Fields
  fields: {
    loan_amount: { type: mongoose.Schema.Types.Mixed }, // Mixed allows String ("Rs 1.5L") or Number
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

  // Vehicle Details (from VIN)
  vin: { type: String },
  vehicleDetails: { type: Object },

  // Analysis
  pricingAnalysis: {
    marketFairPrice: { type: Number },
    contractPrice: { type: Number },
    score: { type: Number },
    verdict: { type: String },
    recommendation: { type: String },
  },

  // Hidden Fees (The Crash Fix)
  hiddenFees: {
    analyzed: { type: Boolean, default: false },
    fees: [
      {
        name: { type: String },
        amount: { type: mongoose.Schema.Types.Mixed },
        description: { type: String },
        type: { type: String }, // "Junk" or "Standard"
        sourceSnippet: { type: String },
      },
    ],
  },

  confidence: { type: Number },
});

module.exports = mongoose.model("OcrResult", OcrResultSchema);