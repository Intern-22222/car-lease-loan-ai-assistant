You need two main tools installed on your machine: Tesseract (the OCR engine) and Poppler (to convert PDFs to images).

Install System Tools:

Windows: Download the installers for Tesseract-OCR and Poppler. Add their bin folders to your System PATH environment variable.

Mac: Run brew install tesseract and brew install poppler.

Linux: Run sudo apt-get install tesseract-ocr poppler-utils.

Install Python Libraries: Run this in your terminal:

pip install pytesseract pdf2image pillow
##################################
1. Verify Tools
Run the following commands to confirm setup: tesseract --version pdftoppm -v

2. Run the OCR Test Script
Use this command to run OCR on a PDF: python ocr/test_ocr.py "pdfs/your_file.pdf"

Example: python ocr/test_ocr.py "pdfs/ML project 360.pdf"

Output will be created at: data/sample_ocr.txt

3. Notes
Use quotes around filenames with spaces.
Do not place docs/, ocr/, or data/ inside the virtual environment (myenv).
The script converts PDF → images → text.
