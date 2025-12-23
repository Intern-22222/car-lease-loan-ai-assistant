const dotenv = require("dotenv").config();

const OCR_PROVIDER = process.env.OCR_PROVIDER;
const OCR_API_KEY = process.env.OCR_API_KEY;
const OCR_BASE_URL = process.env.OCR_BASE_URL;


const extractTextFromPDF = async (filePath) => {
  if(!OCR_PROVIDER||!OCR_API_KEY||!OCR_BASE_URL){
      return null;
  }
  return null;
};


module.exports = {
  extractTextFromPDF,
};


