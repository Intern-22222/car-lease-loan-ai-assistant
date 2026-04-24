

const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path"); 
const { convertPdfToImages } = require("./pdf_to_png.service");

const extractTextFromPDF = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("PDF file not found");
    }
    
    const pages = await convertPdfToImages(filePath);

    let fullText = "";
    let pageTexts = [];
    let pageNumber = 1;
    
    for (const page of pages) {
      
      const result = await Tesseract.recognize(page.content, "eng+hin", {
        langPath: path.join(__dirname, "../../") 
      });
      
      const pageText = (result?.data?.text || "").trim();
      
      pageTexts.push({
        page: pageNumber,
        text: pageText
      });
      
      if (pageText.length > 0) {
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
      totalPages: pages.length,
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

