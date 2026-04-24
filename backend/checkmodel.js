const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    console.log("Testing gemini-pro...");
    await model.generateContent("Hello");
    console.log("✅ gemini-pro WORKS!");
  } catch (e) {
    console.log("❌ gemini-pro Failed:", e.message);
  }
}

listModels();
