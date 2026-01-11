$BASE_URL = "http://localhost:8000"
$SAMPLE_FILE = "samples\contract1.pdf"

Write-Host "[smoke] Uploading sample file..."
$response = Invoke-WebRequest -Uri "$BASE_URL/upload" -Method POST -InFile $SAMPLE_FILE -ContentType "multipart/form-data"
$fileId = ($response.Content | ConvertFrom-Json).file_id

Write-Host "[smoke] Got file_id=$fileId"

Write-Host "[smoke] Calling OCR endpoint..."
$ocrResp = Invoke-WebRequest -Uri "$BASE_URL/ocr" -Method POST -Body "{""file_id"":""$fileId""}" -ContentType "application/json"
$status = ($ocrResp.Content | ConvertFrom-Json).status

if ($status -eq "ok") {
    Write-Host "[smoke][ok] Smoke test passed"
} else {
    Write-Host "[smoke][error] OCR status not ok"
    exit 1
}
