const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const OcrResult = require("../models/OcrResult");
router.get("/results/:id", async (req, res) => {
  try {
    const recordId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(recordId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid record ID format",
      });
    }

    const record = await OcrResult.findById(recordId);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    return res.json({
      success: true,
      record,
    });
    // return res.json({
    //   success: true,
    //   message: "Results endpoint working",
    //   idReceived: recordId,
    // });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error",
      error: error.message,
    });
  }
});

router.get("/results", async (req, res) => {
  try {
    const records = await OcrResult.find().sort({ uploadedAt: -1 });

    return res.json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error",
      error: error.message,
    });
  }
});

module.exports = router;
