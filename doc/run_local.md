# run_local.md — OCR setup (Windows)

## Install Tesseract
1. Download Tesseract (UB Mannheim) and run installer.
2. Default install path: C:\Program Files\Tesseract-OCR\
3. Verify: open PowerShell/CMD and run `tesseract --version`.

## Install Poppler for Windows
1. Download Poppler ZIP for Windows and extract, e.g. to: C:\tools\poppler
2. Ensure `pdftoppm.exe` is present under `C:\tools\poppler\Library\bin` (or `C:\tools\poppler\bin`).


## How to run OCR
1. Put sample PDFs into `samples/` (or into `ocr/`).
2. Update paths in `ocr/test_ocr.py`:
   - TESSERACT_EXE = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
   - POPPLER_BIN = r"C:\tools\poppler\Library\bin"
3. Open CMD in `project-root/ocr` and run:

4. Output files will be written to `data/<pdf_basename>.txt`.
