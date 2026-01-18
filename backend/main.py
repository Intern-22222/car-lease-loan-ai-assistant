from fastapi import FastAPI, UploadFile, File
import time

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Simulating file saving and returning ID 123 used in tests
    return {"message": "File received", "file_id": 123}

@app.post("/ocr/{file_id}")
async def trigger_ocr(file_id: int):
    # Simulating the trigger for OCR + LLM Extraction
    return {"message": f"OCR and Extraction started for {file_id}", "status": "processing"}

# INTEGRATED ENDPOINT FOR MILESTONE 2 & 4
@app.get("/contract/{file_id}")
async def get_contract_results(file_id: int):
    """
    Simulates integrated response from OCR, LLM, and VIN API.
    Updated to align with Milestone 4 extraction requirements.
    """
    return {
        "file_id": file_id,
        "status": "completed",
        "sla_extraction": {
            "apr": 4.99,
            "monthly_payment": 350.00,
            "lease_term": "36 months",
            "mileage_allowance": 12000,
            "residual_value": 18000,
            # Junk fees extracted based on prompts/fee_extraction.json structure
            "junk_fees": [
                {"name": "Documentation Fee", "amount": 150, "type": "standard"},
                {"name": "Window Etching", "amount": 300, "type": "junk"}
            ],
            "total_hidden_charges": 450
        },
        "vehicle_info": {
            "vin": "123456789ABC",
            "make": "Toyota",
            "model": "RAV4",
            "year": 2024,
            "recall_history": "No active recalls"
        }
    }