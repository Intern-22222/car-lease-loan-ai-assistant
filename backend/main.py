import os

DB_USER = os.getenv("POSTGRES_USER")
DB_PASS = os.getenv("POSTGRES_PASSWORD")
DB_NAME = os.getenv("POSTGRES_DB")
DB_HOST = os.getenv("DB_HOST", "postgres")  # service name in compose
DB_PORT = os.getenv("DB_PORT", "5432")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"status": "Backend running"}

@app.get("/docs")
def docs_check():
    return {"message": "Swagger available"}

from fastapi import FastAPI, UploadFile, File

app = FastAPI()

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    return {"filename": file.filename}

@app.post("/ocr")
async def ocr():
    return {"text": "dummy ocr output"}
