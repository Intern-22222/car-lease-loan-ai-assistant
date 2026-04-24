



const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const OcrResult = require("../models/OcrResult");
const authMiddleware = require("../middlewares/auth.middleware");


router.get("/results/:id", authMiddleware, async (req, res) => {
  try {
    const recordId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(recordId)) {
      return res.status(400).json({ success: false, message: "Invalid record ID" });
    }

    const record = await OcrResult.findById(recordId);

    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

   
    if (record.userId && record.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get("/results", authMiddleware, async (req, res) => {
  try {
    const records = await OcrResult.find({ userId: req.user.id }).sort({ uploadedAt: -1 });
    res.json({ success: true, count: records.length, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

