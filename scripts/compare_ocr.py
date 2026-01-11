import difflib

def compare_text(gt_path, ocr_path):
    with open(gt_path, 'r') as gt_file, open(ocr_path, 'r') as ocr_file:
        gt = gt_file.read()
        ocr = ocr_file.read()
    diff = difflib.ndiff(gt.split(), ocr.split())
    errors = [d for d in diff if d.startswith('- ') or d.startswith('+ ')]
    return errors


errors = compare_text("samples/contract1_gt.txt", "samples/contract1_ocr.txt")
print("Errors found:", errors)
