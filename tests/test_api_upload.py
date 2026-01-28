import sys
import os

# Add the project root to the sys.path so 'backend' can be found
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from fastapi.testclient import TestClient
from backend.main import app  # Now this import will be successful

client = TestClient(app)

def test_read_health():
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "healthy"
    assert "service" in data

def test_upload_file():
    """Test the file upload endpoint with a real PDF file."""
    # Use a real sample PDF
    test_file_path = "samples/contract2.pdf"
    
    if not os.path.exists(test_file_path):
        pytest.skip(f"Sample file {test_file_path} not found")
    
    with open(test_file_path, 'rb') as f:
        files = {"file": ("contract2.pdf", f, "application/pdf")}
        response = client.post("/upload", files=files)
    
    assert response.status_code == 200
    data = response.json()
    assert "file_id" in data
    assert "text_length" in data
    # Message changed after auto-analysis implementation
    assert "message" in data
    # Should have analysis data from auto-analysis
    assert "analysis" in data
    assert "risks" in data
    assert "fairness_score" in data
    # Store file_id for next test
    return data["file_id"]


def test_get_contract():
    """Test retrieving contract details."""
    # First upload a file
    file_id = test_upload_file()
    
    # Then retrieve it
    response = client.get(f"/contract/{file_id}")
    assert response.status_code == 200
    data = response.json()
    assert "filename" in data
    assert "text_raw" in data

def test_analyze_contract():
    """Test contract analysis endpoint."""
    # First upload
    file_id = test_upload_file()
    
    # Then analyze
    response = client.post(f"/analyze/{file_id}")
    assert response.status_code == 200
    data = response.json()
    assert "analysis" in data
    assert "fairness_score" in data
    assert "risks" in data