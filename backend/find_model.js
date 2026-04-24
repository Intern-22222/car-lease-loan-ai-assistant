const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function findWorkingModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const candidates = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-1.5-pro-001",
    "gemini-1.5-pro-002",
    "gemini-1.0-pro",
    "gemini-pro",
  ];

  console.log("🔍 Testing Model Availability for your API Key...\n");

  for (const modelName of candidates) {
    process.stdout.write(`Testing: ${modelName.padEnd(25)} `);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      await model.generateContent("Hello");

      console.log("✅ WORKS! (Use this one)");
      console.log(
        `\n🎉 SOLUTION: Open 'src/services/ai.service.js' and change 'MODEL_NAME' to: "${modelName}"\n`,
      );
      return; 
    } catch (e) {
      if (e.message.includes("404")) {
        console.log("❌ Not Found (404)");
      } else {
        console.log(`❌ Error: ${e.message.split("[")[0]}`); 
      }
    }
  }

  console.log(
    "\n❌ CRITICAL: No models worked. Please check if 'Google Generative AI API' is enabled in your Google Cloud Console.",
  );
}

findWorkingModel();
