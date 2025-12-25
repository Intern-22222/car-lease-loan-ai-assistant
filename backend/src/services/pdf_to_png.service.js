const { pdfToPng } = require("pdf-to-png-converter");

async function convertPdfToImages(filePath) {
  const images = await pdfToPng(filePath, {
    disableFontFace: true,
  });

  return images;
}

module.exports = { convertPdfToImages };
