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
});

module.exports = mongoose.model("OcrResult", OcrResultSchema);
