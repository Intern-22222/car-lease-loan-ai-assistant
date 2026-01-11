import textdistance

def cer(gt, ocr):
    distance = textdistance.levenshtein.distance(list(gt), list(ocr))
    return 1 - (distance / len(gt))

def wer(gt, ocr):
    # Word Error Rate
    gt_words = gt.split()
    ocr_words = ocr.split()
    distance = textdistance.levenshtein.distance(gt_words, ocr_words)
    return distance / len(gt_words)

def field_accuracy(gt_fields, ocr_text):
    matches = sum(1 for field in gt_fields if field in ocr_text)
    return matches / len(gt_fields)

# Example usage
with open("samples/contract1_gt.txt") as gt_file, open("samples/contract1_ocr.txt") as ocr_file:
    gt = gt_file.read()
    ocr = ocr_file.read()

print("CER:", cer(gt, ocr))
print("WER:", wer(gt, ocr))
print("Field Accuracy:", field_accuracy(["2025-12-30", "Contract ID: 123", "$5000"], ocr))
