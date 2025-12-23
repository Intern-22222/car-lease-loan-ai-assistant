const {extractTextFromPDF} = require("../services/ocr.service");

const uploadContract = async(req,res)=>{
    if (!req.file)
      return res.status(200).json({ message: "Upload route reachable" });

    const contractText = await extractTextFromPDF(req.file.path);

}

module.exports={
    uploadContract
}