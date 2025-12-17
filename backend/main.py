from fastapi import FastAPI, UploadFile, File

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# This allows your smoke_test.sh to succeed for Day 6-7
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # In Week 2, we just need to return a valid JSON with a file_id
    return {"message": "File received", "file_id": 123}

@app.post("/ocr/{file_id}")
async def trigger_ocr(file_id: int):
    return {"message": f"OCR started for {file_id}", "status": "processing"}