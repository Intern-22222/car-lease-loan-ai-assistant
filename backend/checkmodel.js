// require("dotenv").config(); // Make sure you have dotenv installed

// const apiKey = process.env.GEMINI_API_KEY;

// if (!apiKey) {
//   console.error("❌ No API Key found in .env file");
//   process.exit(1);
// }

// const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

// console.log("🔍 Checking available models for your API key...");

// fetch(url)
//   .then((res) => res.json())
//   .then((data) => {
//     if (data.error) {
//       console.error("❌ Error:", data.error.message);
//     } else {
//       console.log("\n✅ AVAILABLE MODELS:");
//       // Filter for models that support 'generateContent'
//       const chatModels = data.models.filter((m) =>
//         m.supportedGenerationMethods.includes("generateContent"),
//       );

//       chatModels.forEach((m) => {
//         // We strip 'models/' from the name to get the ID you need for code
//         console.log(`- ${m.name.replace("models/", "")}`);
//       });
//       console.log(
//         "\n👉 Copy one of the names above into your ai.service.js file.",
//       );
//     }
//   })
//   .catch((err) => console.error("❌ Network Error:", err));



const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Note: This 'listModels' method might not be exposed in the high-level SDK,
  // so we rely on the error message usually.
  // Instead, we will try the absolute oldest model as a fallback test.
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
