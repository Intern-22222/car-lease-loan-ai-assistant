from fastapi.testclient import TestClient
from backend.main import app  # Import your FastAPI app
import pytest

client = TestClient(app)

def test_read_health():
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_upload_file():
    """Test the file upload endpoint with a dummy file."""
    files = {"file": ("test.pdf", b"dummy content", "application/pdf")}
    response = client.post("/upload", files=files)
    
    assert response.status_code == 200
    assert "file_id" in response.json()
    assert response.json()["message"] == "File received"

def test_trigger_ocr():
    """Test the OCR trigger endpoint (Updated for Milestone 2)."""
    file_id = 123
    response = client.post(f"/ocr/{file_id}")
    
    assert response.status_code == 200
    assert "status" in response.json()
    # FIX: Updated to match the new 'OCR and Extraction' message
    assert response.json()["message"] == f"OCR and Extraction started for {file_id}"

def test_integrated_results():
    """
    NEW for Milestone 2 Task 1: 
    Tests the combined SLA (LLM) and Vehicle (VIN API) data endpoint.
    """
    file_id = 123
    response = client.get(f"/contract/{file_id}")
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify the two main data components exist
    assert "sla_extraction" in data
    assert "vehicle_info" in data
    
    # Verify sample data within the components
    assert data["sla_extraction"]["apr"] == 4.99
    assert data["vehicle_info"]["make"] == "Toyota"
    assert data["status"] == "completed"