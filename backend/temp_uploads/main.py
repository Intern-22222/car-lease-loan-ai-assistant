from fastapi import FastAPI, UploadFile, File
import os
import shutil

app = FastAPI()

TEMP_FOLDER = "temp_uploads"

# Create temporary folder if it does not exist
os.makedirs(TEMP_FOLDER, exist_ok=True)

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    file_path = os.path.join(TEMP_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "status": "success",
        "message": "Document uploaded successfully",
        "filename": file.filename
    }
