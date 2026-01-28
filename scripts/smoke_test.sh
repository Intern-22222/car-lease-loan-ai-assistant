#!/bin/bash
# scripts/smoke_test.sh

API_URL="http://localhost:8000"
SAMPLE_FILE="samples/contract1.pdf"

echo "🚀 Starting Milestone 2 & 4 Smoke Test..."

# 1. Health Check (Wait for server to be ready)
# Docker containers can sometimes take a few seconds to initialize
MAX_RETRIES=5
COUNT=0
until $(curl -s -o /dev/null -w "%{http_code}" $API_URL/health | grep -q "200"); do
    if [ $COUNT -eq $MAX_RETRIES ]; then
      echo "❌ Backend is DOWN after $MAX_RETRIES attempts."
      exit 1
    fi
    echo "⏳ Waiting for backend..."
    sleep 2
    ((COUNT++))
done
echo "✅ Backend is UP."

# 2. Upload - Extract UUID file_id from JSON response
UPLOAD_RES=$(curl -s -F "file=@$SAMPLE_FILE" $API_URL/upload)
FILE_ID=$(echo $UPLOAD_RES | grep -oP '(?<="file_id":")[a-f0-9-]+')

if [ -z "$FILE_ID" ]; then
    echo "❌ Upload failed, could not retrieve File ID."
    exit 1
fi
echo "✅ Uploaded File ID: $FILE_ID"

# 3. Trigger OCR/Extraction
curl -s -X POST "$API_URL/ocr/$FILE_ID" > /dev/null
echo "✅ Extraction Triggered."

# 4. Verify Integrated Results (Task 1 Goal & Task 2 Verification)
echo "🔍 Verifying Integrated Results..."
RESULTS=$(curl -s "$API_URL/contract/$FILE_ID")

# Check for analysis data (includes contract terms, APR, payments, etc.)
if echo "$RESULTS" | grep -q '"analysis"'; then
    echo "✅ Analysis Data Found."
else
    echo "❌ Analysis Data Missing."
    exit 1
fi


# Check for Vehicle data (VIN Info)
if echo "$RESULTS" | grep -q "vehicle_info"; then
    echo "✅ Vehicle Info Found."
else
    echo "❌ Vehicle Info Missing."
    exit 1
fi

# NEW: Verify Milestone 4 Junk Fee data is present
if echo "$RESULTS" | grep -q "junk_fees"; then
    echo "✅ Junk Fee Data Verified."
else
    echo "🚩 WARNING: Junk Fee data missing from integrated response."
fi

echo "⭐ MILESTONE 2 SMOKE TEST PASSED!"