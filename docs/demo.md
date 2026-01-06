# Demo Steps

1. Start backend server:
   python backend/app.py

2. Upload contract PDF using Postman:
   POST http://127.0.0.1:5000/upload

3. Fetch extracted contract text:
   GET http://127.0.0.1:5000/contracts/sample_lease.pdf

4. Verify extracted text output in response
