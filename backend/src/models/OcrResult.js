const mongoose = require("mongoose");
const OcrResultSchema = new mongoose.Schema({
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  fileName: {
    type: String,
    required: false,
  },
  rawText: {
    type: String,
    required: true,
  },
  fields: {
    type: Object,
    required: false,
  },
  confidence: {
    type: Number,
    required: true,
  },
  notes: {
    type: [String],
    required: false,
  },
  vin: {
    type: String,
    default: null,
  },

  vehicleDetails: {
    year: { type: String, default: null },
    make: { type: String, default: null },
    model: { type: String, default: null },
    trim: { type: String, default: null },
  },

  pricingAnalysis: {
    marketFairPrice: { type: Number, default: null },
    contractPrice: { type: Number, default: null },
    difference: { type: Number, default: null },
    verdict: { type: String, default: null }, // Overpriced / Fair / Underpriced
    confidence: { type: String, default: null }, // high / medium / low
    source: { type: String, default: null }, // api / fallback
  },
});

module.exports = mongoose.model("OcrResult", OcrResultSchema);
