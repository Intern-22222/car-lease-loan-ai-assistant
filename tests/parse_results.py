import json

with open('test_results_20260127_220631.json', 'r') as f:
    data = json.load(f)

print("="*60)
print("OCR QUALITY CHECK RESULTS")
print("="*60)
print(f"Total PDFs tested: {len(data['ocr_quality_check'])}\n")

for item in data['ocr_quality_check']:
    print(f"File: {item['filename']}")
    print(f"  Status: {item['status']}")
    print(f"  Text Length: {item['text_length']} characters")
    if 'issues' in item and item['issues']:
        print(f"  Issues: {', '.join(item['issues'])}")
    print()

print("="*60)
print(f"BUGS FOUND: {len(data['bugs_found'])}")
print("="*60)
for bug in data['bugs_found']:
    print(f"- {bug}")

print("\n" + "="*60)
print("E2E USER FLOWS")
print("="*60)
for flow_name, result in data['e2e_user_flows'].items():
    print(f"{flow_name}: {result}")
