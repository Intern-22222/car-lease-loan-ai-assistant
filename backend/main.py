from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn
from pydantic import BaseModel

app = FastAPI()

# 1. Allow React (Port 3000) to talk to Python (Port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class EmailRequest(BaseModel):
    body: str

@app.get("/")
def read_root():
    return {"message": "Car Lease AI Backend is Running!"}

# 2. The Smart Comparison Endpoint
@app.post("/compare")
async def compare_contracts(
    file1: Optional[UploadFile] = File(None),
    file2: Optional[UploadFile] = File(None)
):
    print(f"Received request. File 1: {file1.filename if file1 else 'None'}, File 2: {file2.filename if file2 else 'None'}")
    
    # MOCK LOGIC (This is where your AI extraction will go later)
    # For now, we return "Real Structure" data so the Frontend works.
    
    response_data = {
        "contract_a": None,
        "contract_b": None
    }

    # If File 1 exists, generate data for it
    if file1:
        response_data["contract_a"] = {
            "vehicle": "Toyota Camry (Extracted)",
            "price": 450,
            "apr": 4.5,
            "terminationFee": 350
        }

    # If File 2 exists, generate data for it
    if file2:
        response_data["contract_b"] = {
            "vehicle": "Honda Civic (Extracted)",
            "price": 410,
            "apr": 3.8,
            "terminationFee": 300
        }

    return response_data 

# 3. NEW ENDPOINT: SEND EMAIL
@app.post("/send-email")
async def send_email(request: EmailRequest):
    print("--------------------------------------------------")
    print("🚀 [BACKEND] SENDING EMAIL TO DEALER:")
    print(request.body)
    print("--------------------------------------------------")
    return {"status": "success", "message": "Email sent!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)