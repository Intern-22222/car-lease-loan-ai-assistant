import pdfplumber

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


if __name__ == "__main__":
    pdf_path = "../data/sample_contracts/sample_lease_1.pdf"
    extracted_text = extract_text_from_pdf(pdf_path)
    print(extracted_text[:1000])  # first 1000 characters
