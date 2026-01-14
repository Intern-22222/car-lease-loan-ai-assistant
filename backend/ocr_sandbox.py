import pdfplumber
import os

PDF_PATH = "data/sample_contracts/sample_lease_1.pdf"
OUTPUT_PATH = "data/extracted_text/sample_lease_1_sandbox.txt"

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


def main():
    if not os.path.exists(PDF_PATH):
        print("PDF not found:", PDF_PATH)
        return

    text = extract_text_from_pdf(PDF_PATH)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(text)

    print("OCR completed successfully")
    print("Saved to:", OUTPUT_PATH)
    print("\n--- OCR PREVIEW ---\n")
    print(text[:1000])


if __name__ == "__main__":
    main()
