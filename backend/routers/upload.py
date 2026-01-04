import os
from  fastapi import APIRouter, HTTPException, UploadFile, File

from backend.services.ocr import extract_text
from backend.services.standrd_txt import extract_std_txt

# this will ensure if tempfolder then it will create it
UPLOAD_DIR = "temp_file_uplod"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router=APIRouter(tags=["Upload file/doc"])

@router.post("/uploadfile")
async def upload_file(file: UploadFile=File(...)):
    if file.filename == "":
        raise HTTPException(status_code=400, detail="No file selected")
    filepath=os.path.join(UPLOAD_DIR, file.filename)
    
    filecont=await file.read()
    
    raw_t= extract_text(filecont,file.filename)
    std_text_data = extract_std_txt(raw_t)
    
    with open(filepath,"wb") as f:
        f.write(await file.read())
        
    return {"status": "success","filename":file.filename, "filepath":filepath, "extracted_text_preview": std_text_data}



    
