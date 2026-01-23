from fastapi import APIRouter, FastAPI, UploadFile, File

from backend.services.ocr import extract_text
from backend.services.parser import parse_contract_fields  
from backend.services.compare_logic import compare_contracts 

router = APIRouter(tags=["Compare Contracts"]) 


@router.post("/compare-from-files")
async def compare_contracts_from_files(
    contract_a: UploadFile = File(...),
    contract_b: UploadFile = File(...)
):
    # Read files
    file_a_bytes = await contract_a.read()
    file_b_bytes = await contract_b.read()

    # Step 1: Extract text
    text_a = extract_text(file_a_bytes, contract_a.filename)
    text_b = extract_text(file_b_bytes, contract_b.filename)

    # Step 2: Parse structured data
    data_a = parse_contract_fields(text_a)
    data_b = parse_contract_fields(text_b)

    # Step 3: Compare using your logic
    result = compare_contracts(data_a, data_b)

    return {
        "contract_a_extracted": data_a,
        "contract_b_extracted": data_b,
        "comparison": result
    }
