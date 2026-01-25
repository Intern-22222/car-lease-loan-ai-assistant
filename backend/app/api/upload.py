import json
import re
import shutil
import os
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.services.openrouter_service import extract_contract_info
from app.core.config import get_settings

router = APIRouter()

def clean_ai_json(raw_string: str):
    """
    Robustly extracts JSON from a string, even if the AI includes 
    markdown backticks or conversational text around it.
    """
    try:
        # Use regex to find content between ```json and ``` or just ```
        match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", raw_string)
        if match:
            return match.group(1).strip()
        return raw_string.strip()
    except Exception:
        return raw_string.strip()

@router.post("/upload")
async def upload_lease(file: UploadFile = File(...), settings=Depends(get_settings)):
    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    
    try:
        # 1. Save File locally for AI processing
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 2. Extract Data using AI via OpenRouter service
        raw_ai_summary = await extract_contract_info(file_path)
        
        # 3. Robustly Parse the JSON
        clean_json = clean_ai_json(raw_ai_summary)
        extracted_data = json.loads(clean_json)

        # 4. FIX: Ensure "model" and "make" exist for the Intelligence Panel
        # We check common alternative keys the AI might return
        if "model" not in extracted_data:
            extracted_data["model"] = extracted_data.get("vehicle_model") or extracted_data.get("vehicle") or "---"
        
        if "make" not in extracted_data:
            extracted_data["make"] = extracted_data.get("vehicle_make") or extracted_data.get("brand") or ""

        # 5. Return formatted response to Frontend
        return {
            "status": "success",
            "filename": file.filename,
            "file_path": file_path, # Used by chat service for context
            "data": extracted_data  # This now contains the 'model' and 'make' keys
        }

    except json.JSONDecodeError as je:
        print(f"JSON Parsing Error: {je} | Raw: {raw_ai_summary}")
        raise HTTPException(status_code=500, detail="AI returned invalid data format.")
    except Exception as e:
        print(f"Extraction Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze contract: {str(e)}")