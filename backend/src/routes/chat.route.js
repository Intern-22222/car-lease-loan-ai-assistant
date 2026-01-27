const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../services/ai.service");

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { message, contextData } = req.body;

    // Call the AI Service
    const aiResponse = await chatWithAI(message, contextData);

    res.json({ success: true, reply: aiResponse });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ success: false, message: "AI Chat Failed" });
  }
});

module.exports = router;
