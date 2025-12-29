import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.main import app
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_upload():
    response = client.post(
        "/upload",
        files={"file": ("test.txt", b"hello")}
    )
    assert response.status_code == 200
    assert "filename" in response.json()

def test_ocr():
    response = client.post("/ocr")
    assert response.status_code == 200
    assert "text" in response.json()
