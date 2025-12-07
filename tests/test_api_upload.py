import os
import requests

# Base URL of your backend (can be overridden in CI with BASE_URL env)
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")


def test_upload_returns_file_id(tmp_path):
    # Create a temporary sample file
    sample = tmp_path / "sample.txt"
    sample.write_text("hello ocr")

    with sample.open("rb") as fh:
        resp = requests.post(f"{BASE_URL}/upload", files={"file": fh})

    # Basic assertions
    assert resp.status_code == 200
    data = resp.json()
    assert "file_id" in data
    assert isinstance(data["file_id"], str)
    assert data["file_id"] != ""


def test_ocr_returns_ok_and_text(tmp_path):
    # Upload a new sample file
    sample = tmp_path / "sample2.txt"
    sample.write_text("hello ocr 2")

    with sample.open("rb") as fh:
        up = requests.post(f"{BASE_URL}/upload", files={"file": fh})

    assert up.status_code == 200
    file_id = up.json().get("file_id")
    assert file_id

    # Call OCR endpoint with the file_id
    ocr = requests.post(f"{BASE_URL}/ocr", json={"file_id": file_id})

    # Basic assertions
    assert ocr.status_code == 200
    data = ocr.json()
    assert data.get("status") == "ok"
    assert "text" in data
    assert isinstance(data["text"], str)
