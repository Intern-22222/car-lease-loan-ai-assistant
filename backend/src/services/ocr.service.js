// const dotenv = require("dotenv").config();

// const OCR_PROVIDER = process.env.OCR_PROVIDER;
// const OCR_API_KEY = process.env.OCR_API_KEY;
// const OCR_BASE_URL = process.env.OCR_BASE_URL;

// const extractTextFromPDF = async (filePath) => {
//   if(!OCR_PROVIDER||!OCR_API_KEY||!OCR_BASE_URL){
//       return null;
//   }
//   return null;
// };

// module.exports = {
//   extractTextFromPDF,
// };

const Tesseract = require("tesseract.js");
const fs = require("fs");
const { convertPdfToImages } = require("./pdf_to_png.service");

const extractTextFromPDF = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("PDF file not found");
    }
    // const result = await Tesseract.recognize(filePath, "eng");
    const pages = await convertPdfToImages(filePath);

    let fullText = "";

    // for (const page of pages) {
    //   const result = await Tesseract.recognize(page.content, "eng");
    //   fullText += "\n" + result.data.text;
    // }
    
    let pageTexts = [];
    let pageNumber = 1;
    for(const page of pages){
      const result = await Tesseract.recognize(page.content,"eng");
      const pageText = (result?.data?.text||"").trim();
      pageTexts.push({
        page:pageNumber,
        text:pageText
      })
      if(pageText.length>0){
      fullText += `\n\n--- Page ${pageNumber} ---\n\n` + pageText;
      }
      pageNumber++;
    }
    let warnings = [];

    for (const p of pageTexts) {
      if (!p.text || p.text.trim().length === 0) {
        warnings.push(`Page ${p.page} appears unreadable or blank`);
      }
    }

    const text = fullText;
    if (!text || text.trim().length === 0) {
      throw new Error("OCR returned empty text");
    }
    

    return {
      success: true,
      rawText: text,
      totalPages:pages.length,
      warnings
    };
  } catch (error) {
    console.error("OCR Error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  extractTextFromPDF,
};
