#!/bin/bash

echo "Running smoke test..."

UPLOAD_RESPONSE=$(curl -s -X POST \
  -F "file=@samples/sample.txt" \
  http://localhost:8000/upload)

echo "Upload response: $UPLOAD_RESPONSE"

OCR_RESPONSE=$(curl -s -X POST \
  http://localhost:8000/ocr)

echo "OCR response: $OCR_RESPONSE"

echo "Smoke test completed successfully"
