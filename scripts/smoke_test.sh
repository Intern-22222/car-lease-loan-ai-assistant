#!/bin/bash
API_URL="http://localhost:8000"
SAMPLE_FILE="samples/sample_contract.pdf"

echo "🚀 Starting Milestone 2 Smoke Test..."

# 1. Health Check
curl -s -o /dev/null -w "%{http_code}" $API_URL/health | grep -q "200" || exit 1
echo "✅ Backend is UP."

# 2. Upload
UPLOAD_RES=$(curl -s -F "file=@$SAMPLE_FILE" $API_URL/upload)
FILE_ID=$(echo $UPLOAD_RES | grep -oP '(?<="file_id":)[0-9]+')
echo "✅ Uploaded File ID: $FILE_ID"

# 3. Trigger OCR/Extraction
curl -s -X POST "$API_URL/ocr/$FILE_ID" > /dev/null
echo "✅ Extraction Triggered."

# 4. NEW: Verify Integrated Results (Task 1 Goal)
echo "🔍 Verifying Integrated Results..."
RESULTS=$(curl -s "$API_URL/contract/$FILE_ID")

# Check for SLA data
if echo "$RESULTS" | grep -q "sla_extraction"; then
    echo "✅ SLA Data Found."
else
    echo "❌ SLA Data Missing."
    exit 1
fi

# Check for Vehicle data
if echo "$RESULTS" | grep -q "vehicle_info"; then
    echo "✅ Vehicle Info Found."
else
    echo "❌ Vehicle Info Missing."
    exit 1
fi

echo "⭐ MILESTONE 2 SMOKE TEST PASSED!"