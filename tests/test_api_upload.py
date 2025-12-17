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
    # Create a dummy file in memory
    files = {"file": ("test.pdf", b"dummy content", "application/pdf")}
    response = client.post("/upload", files=files)
    
    assert response.status_code == 200
    assert "file_id" in response.json()
    assert response.json()["message"] == "File received"

def test_trigger_ocr():
    """Test the OCR trigger endpoint."""
    file_id = 123
    response = client.post(f"/ocr/{file_id}")
    
    assert response.status_code == 200
    assert "status" in response.json()
    assert response.json()["message"] == f"OCR started for {file_id}"