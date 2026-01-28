# Test Files Organization

All test files have been moved to the `tests/` directory for better project organization.

## Test Files

### Smoke Tests
- `comprehensive_smoke_test.py` - Complete smoke test for all features
- `smoke_test.py` - Original Python smoke test
- `scripts/smoke_test.sh` - Bash smoke test (remains in scripts/)

### Feature Tests
- `test_auto_analysis.py` - Tests auto-analysis on upload
- `test_vehicle_info.py` - Tests vehicle info extraction
- `test_hf_api.py` - Tests HuggingFace API connectivity
- `final_frontend_test.py` - Frontend integration test
- `quick_smoke_test.py` - Quick validation test

### OCR Tests
- `test_ocr_verification.py` - OCR pipeline verification
- `test_ocr_pipeline.py` - OCR functionality tests
- `test_opencv_ocr.py` - OpenCV OCR tests

### Debug/Utility Tests
- `check_contract.py` - Check contract endpoint responses
- `debug_response.py` - Debug API responses
- `parse_results.py` - Parse test result JSON files

### Existing Tests
- `milestone4_test_suite.py` - Milestone 4 comprehensive tests
- `intern_d_workflow_test.py` - Workflow tests
- `test_api_upload.py` - API upload tests

## Running Tests

```bash
# Run comprehensive smoke test
python tests/comprehensive_smoke_test.py

# Run smoke test via bash
bash scripts/smoke_test.sh

# Run all pytest tests
pytest tests/
```
