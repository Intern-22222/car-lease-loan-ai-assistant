from fastapi import FastAPI, UploadFile, File
import time

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Simulating file saving
    return {"message": "File received", "file_id": 123}

@app.post("/ocr/{file_id}")
async def trigger_ocr(file_id: int):
    # Simulating the trigger for OCR + LLM Extraction
    return {"message": f"OCR and Extraction started for {file_id}", "status": "processing"}

# NEW ENDPOINT FOR MILESTONE 2
@app.get("/contract/{file_id}")
async def get_contract_results(file_id: int):
    """
    This endpoint simulates the final integrated response 
    combining LLM data and VIN API data.
    """
    return {
        "file_id": file_id,
        "status": "completed",
        "sla_extraction": {
            "apr": 4.99,
            "monthly_payment": 350.00,
            "lease_term": "36 months",
            "mileage_allowance": 12000,
            "residual_value": 18000
        },
        "vehicle_info": {
            "vin": "123456789ABC",
            "make": "Toyota",
            "model": "RAV4",
            "year": 2024,
            "recall_history": "No active recalls"
        }
    }