#!/bin/bash

# Configuration
API_URL="http://localhost:8000"
SAMPLE_FILE="samples/sample_contract.pdf"

echo "🚀 Starting Smoke Test..."

# Step 1: Check if the Backend is running
echo "Checking /health endpoint..."
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/health)
if [ "$HEALTH_STATUS" -eq 200 ]; then
    echo "✅ Backend is UP."
else
    echo "❌ Backend is DOWN (Status: $HEALTH_STATUS). Ensure docker-compose is running."
    exit 1
fi

# Step 2: Upload a sample contract
# This targets the endpoint Intern B is building [cite: 220]
echo "Uploading contract: $SAMPLE_FILE..."
UPLOAD_RESPONSE=$(curl -s -X POST "$API_URL/upload" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@$SAMPLE_FILE")

# Extract file_id from JSON response (assumes Intern B returns {"file_id": 1})
FILE_ID=$(echo $UPLOAD_RESPONSE | grep -oP '(?<="file_id":)[0-9]+')

if [ -z "$FILE_ID" ]; then
    echo "❌ Upload failed or did not return a file_id."
    echo "Response: $UPLOAD_RESPONSE"
    exit 1
else
    echo "✅ Upload success! File ID: $FILE_ID"
fi

# Step 3: Trigger OCR
# This targets the endpoint Intern C is integrating 
echo "Triggering OCR for File ID: $FILE_ID..."
OCR_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/ocr/$FILE_ID")

if [ "$OCR_STATUS" -eq 200 ]; then
    echo "✅ OCR process triggered successfully."
else
    echo "❌ OCR trigger failed (Status: $OCR_STATUS)."
    exit 1
fi

echo "⭐ Smoke Test Passed!"