const express = require("express");
const router = express.Router();
const OcrResult = require("../models/OcrResult");

// GET /api/history
router.get("/", async (req, res) => {
  try {
    // Fetch all records, sorted by newest first
    const history = await OcrResult.find().sort({ uploadedAt: -1 });

    res.json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error("History Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


// DELETE /api/history/:id
router.delete("/:id", async (req, res) => {
  try {
    await OcrResult.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

module.exports = router;
