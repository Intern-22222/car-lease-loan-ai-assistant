# Testing Checklist

## API Tests
- [x] Upload PDF using POST /upload
- [x] OCR extracts text correctly
- [x] Extracted text saved to file
- [x] Fetch extracted text using GET /contracts/<sample_lease.pdf>

## Error Handling
- [x] Upload without file returns error
- [x] Fetching non-existing contract returns 404

## Manual Testing
- All APIs tested using Postman
- Backend logs verified
