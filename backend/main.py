from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os
import shutil
from pydantic import BaseModel
from chatbot import negotiation_chatbot

# 1. Initialize the app FIRST
app = FastAPI(title="Car Lease Loan AI Assistant")

# 2. Initialize your "Real Data" storage
db_history = []

# 3. Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

UPLOAD_FOLDER = "temp_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 4. Define your routes SECOND
@app.get("/")
def read_root():
    return {"message": "Car Lease Loan AI Backend is running"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Create real record for history
        new_record = {
            "id": len(db_history) + 1,
            "fileName": file.filename,
            "uploadedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "confidence": 0.85,
            "status": "Success"
        }
        db_history.append(new_record)

        return {"status": "success", "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/results")
async def get_history():
    return {"success": True, "records": db_history}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    reply = negotiation_chatbot(request.message)
    return {"reply": reply}