from fastapi import FastAPI, UploadFile, File

app = FastAPI()

# Task: /health endpoint (Day 4-5 task)
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Service is running"}

# Task: /upload endpoint (Day 4-5 task)
@app.post("/upload")
def upload_file(file: UploadFile = File(...)):
    return {
        "filename": file.filename, 
        "message": "File received (storage not implemented yet)"
    }