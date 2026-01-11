"""
Batch evaluation script for OCR outputs.
Compares ground truth vs OCR text using CER, WER, and Field Accuracy.
"""

from pathlib import Path
from ocr_metrics import cer, wer, field_accuracy

SAMPLES_DIR = Path("samples")

KEY_FIELDS = ["2025-12-30", "Contract ID: 123", "$5000"]

def evaluate_all():
    for gt_file in SAMPLES_DIR.glob("*_gt.txt"):
        base_name = gt_file.stem.replace("_gt", "")
        ocr_file = SAMPLES_DIR / f"{base_name}_ocr.txt"

        if not ocr_file.exists():
            print(f"[SKIP] OCR file missing for {base_name}")
            continue

        gt = gt_file.read_text()
        ocr = ocr_file.read_text()

        print(f"\n Evaluating: {base_name}")
        print(f"CER: {cer(gt, ocr):.2f}")
        print(f"WER: {wer(gt, ocr):.2f}")
        print(f"Field Accuracy: {field_accuracy(KEY_FIELDS, ocr):.2f}")

if __name__ == "__main__":
    evaluate_all()
