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

const mongoose = require("mongoose");

const OcrResultSchema = new mongoose.Schema({
  uploadedAt: { type: Date, default: Date.now },
  fileName: { type: String },
  rawText: { type: String },
  fields: { type: Object },
  confidence: { type: Number },
  notes: { type: [String] },
  vin: { type: String, default: null },

  vehicleDetails: {
    year: { type: String, default: null },
    make: { type: String, default: null },
    model: { type: String, default: null },
    trim: { type: String, default: null },
    bodyClass: { type: String, default: null },
  },

  pricingAnalysis: {
    marketFairPrice: { type: Number, default: null },
    contractPrice: { type: Number, default: null },
    difference: { type: Number, default: null },
    verdict: { type: String, default: null },
    confidence: { type: String, default: null },
    source: { type: String, default: null },

    // ✅ FIXED: These are now properly nested inside pricingAnalysis
    score: { type: Number, default: null },
    scoreReasons: { type: [String], default: [] },
    recommendation: { type: String, default: null },
  },

  hiddenFees: {
    analyzed: { type: Boolean, default: false },
    fees: [
      {
        name: String,
        amount: Number,
        description: String,
        type: String, // "Junk" or "Standard"
        sourceSnippet: String, // For verification
        isVerified: Boolean, // Hallucination check passed?
      },
    ],
  },

  
});

module.exports = mongoose.model("OcrResult", OcrResultSchema);

