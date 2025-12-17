from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

app = FastAPI()

class OCRRequest(BaseModel):
    file_id: str

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    return {"file_id": "sample-123"}

@app.post("/ocr")
async def ocr(req: OCRRequest):
    return {"status": "ok", "text": f"OCR text for {req.file_id}"}
