const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const { extractTextFromPDF } = require("../services/ocr.service");
const extractFields = require("../extraction/extractFields");

const OcrResult = require("../models/OcrResult");

router.post("/upload", upload.single("file"), async (req, res) => {

  try {
    const debugMode = req.query.debug === "true";
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "NO file uploaded",
      });
    }
    const filePath = req.file.path;
    const ocrResult = await extractTextFromPDF(filePath);
    const extracted = extractFields(ocrResult.rawText);

    if (debugMode) {
      console.log("\n===== OCR DEBUG MODE ENABLED =====");
      console.log("RAW OCR TEXT:\n", ocrResult.rawText);
      console.log("\nEXTRACTION RESULT:\n", JSON.stringify(extracted, null, 2));
      console.log("=================================\n");
    }

    if (!ocrResult.success) {
      return res.status(500).json({
        success: false,
        message: "OCR Processing failed",
        error: ocrResult.error,
      });
    }
    let savedRecord = null;
    try {
      savedRecord = await OcrResult.create({
        fileName: req.file.originalname || null,
        rawText: ocrResult.rawText,
        fields: extracted.fields || {},
        confidence: extracted.confidence,
        notes: extracted.notes || [],
      });
    } catch (dbError) {
      console.error("Database save failed:", dbError.message);
    }


    return res.json({
      success: true,
      debug: debugMode,
      savedId: savedRecord ? savedRecord._id : null,
      rawText: ocrResult.rawText,
      extracted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unexcepted server error",
      error: error.message,
    });
  }
});

module.exports = router;
