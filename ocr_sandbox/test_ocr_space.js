require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const formData = new FormData();

formData.append("apikey", process.env.OCR_API_KEY);

formData.append(
  "file",
  fs.createReadStream(
    "../dataset/raw_contracts/synthetic_home_loan_agreement_01.pdf"
  )
);

formData.append("language", "eng");

axios
  .post("https://api.ocr.space/parse/image", formData, {
    headers: formData.getHeaders(),
  })
  .then((response) => {
    console.log(response.data.ParsedResults[0].ParsedText);
  })
  .catch((error) => {
    console.error("OCR Error:", error.message);
  });
