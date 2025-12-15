# Car Lease/Loan Contract Review AI Assistant

AI assistant to review car lease/loan contracts, extract key terms, compare market prices & assist with negotiation using LLMs and public vehicle data.

## 🚀 Features

- **OCR Processing**: Extract text from PDF contracts using PaddleOCR
- **Multi-page Support**: Process contracts of any length
- **Text Cleanup**: Automatic correction of common OCR mistakes
- **API Ready**: Backend-integrated OCR endpoint

## 📁 Project Structure

```
car-lease-loan-ai-assistant/
├── docs/
│   └── run_local.md          # Local development setup guide
├── ocr/
│   └── test_ocr.py           # Basic OCR test script
├── backend/
│   └── app/
│       └── ocr.py            # Reusable OCR module
├── tests/
│   └── test_ocr.py           # Unit tests
├── data/
│   └── sample_ocr.txt        # Example OCR output
├── requirements.txt          # Python dependencies
└── README.md
```

## 🛠️ Installation

### Prerequisites
- Python 3.8+
- Poppler (for PDF processing)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Intern-22222/car-lease-loan-ai-assistant.git
   cd car-lease-loan-ai-assistant
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Poppler** (see [docs/run_local.md](docs/run_local.md) for detailed instructions)

## 📖 Usage

### Basic OCR Test
```bash
python ocr/test_ocr.py path/to/your/contract.pdf
```

### Using the OCR Module in Code
```python
from backend.app.ocr import process_pdf

text = process_pdf("contract.pdf", dpi=300)
print(text)
```

### Run Unit Tests
```bash
python -m pytest tests/test_ocr.py -v
```

## 📋 Week 1 & 2 Deliverables

### Week 1 ✅
- [x] `docs/run_local.md` - Installation guide for PaddleOCR & Poppler
- [x] `ocr/test_ocr.py` - Basic OCR test script
- [x] `data/sample_ocr.txt` - Example OCR output

### Week 2 ✅
- [x] `backend/app/ocr.py` - Reusable OCR module with:
  - Multi-page PDF support
  - Configurable DPI (default 300)
  - Text cleanup (remove newlines, fix OCR mistakes)
- [x] `tests/test_ocr.py` - Unit tests verifying:
  - Output existence
  - Minimum length (>100 chars)
  - Error handling

## 🔧 Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `dpi` | 300 | Image quality for OCR (higher = better, slower) |
| `cleanup` | True | Apply text cleanup heuristics |
| `lang` | 'en' | OCR language |

## 📜 License

MIT License
