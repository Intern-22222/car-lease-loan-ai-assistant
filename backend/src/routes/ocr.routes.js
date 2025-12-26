const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { extractTextFromPDF } = require("../services/ocr.service");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/test", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // const filePath = path.join(__dirname, "..", req.file.path);
    const filePath = req.file.path;
    const ocrResult = await extractTextFromPDF(filePath);

    fs.unlinkSync(filePath);

    res.json(ocrResult);
  } catch (error) {
    console.error("OCR API Error:", error.stack || error);
    res.status(500).json({
      success: false,
      message: "Server error during OCR",
    });
  }
});

module.exports = router;
