const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const { extractTextFromPDF } = require("../services/ocr.service");

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "NO file uploaded",
      });
    }
    const filePath = req.file.path;
    const ocrResult = await extractTextFromPDF(filePath);
    if (!ocrResult.success) {
      return res.status(500).json({
        success: false,
        message: "OCR Processing failed",
        error: ocrResult.error,
      });
    }
    return res.json({
      success: true,
      rawText: ocrResult.rawText,
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
