# Local Development Setup Guide

## Prerequisites

This project uses **PaddleOCR** for optical character recognition and **pdf2image** for PDF to image conversion.

---

## Installation Steps

### 1. Install Python Dependencies

```bash
pip install paddlepaddle paddleocr pdf2image pillow pytest
```

### 2. Install Poppler (Required for pdf2image)

#### Windows
1. Download Poppler for Windows from: https://github.com/osber/poppler-windows/releases
2. Extract to `C:\Program Files\poppler`
3. Add `C:\Program Files\poppler\bin` to your system PATH

Or use Chocolatey:
```powershell
choco install poppler
```

#### macOS
```bash
brew install poppler
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install poppler-utils
```

---

## Verify Installation

### Check Poppler (pdftoppm)
```bash
pdftoppm -v
```
Expected output: `pdftoppm version X.XX.X`

### Check PaddleOCR
```python
from paddleocr import PaddleOCR
ocr = PaddleOCR(use_angle_cls=True, lang='en')
print("PaddleOCR installed successfully!")
```

---

## Project Structure

```
car-lease-loan-ai-assistant/
├── docs/
│   └── run_local.md          # This file
├── ocr/
│   └── test_ocr.py           # Basic OCR test script
├── backend/
│   └── app/
│       └── ocr.py            # Reusable OCR module
├── tests/
│   └── test_ocr.py           # Unit tests
├── data/
│   ├── sample.pdf            # Sample PDF for testing
│   └── sample_ocr.txt        # OCR output
└── requirements.txt
```

---

## Running the OCR Scripts

### Basic OCR Test (Week 1)
```bash
python ocr/test_ocr.py data/sample.pdf
```

### Run Unit Tests
```bash
python -m pytest tests/test_ocr.py -v
```

---

## Troubleshooting

### PaddleOCR Download Issues
On first run, PaddleOCR downloads model files (~150MB). Ensure stable internet connection.

### Poppler Not Found
If you see `pdf2image.exceptions.PDFInfoNotInstalledError`:
- Verify Poppler is in PATH: `pdftoppm -v`
- Windows: Restart terminal after adding to PATH

### GPU/CUDA Issues
PaddleOCR runs on CPU by default. For GPU support:
```bash
pip install paddlepaddle-gpu
```
