from flask import Flask, request, jsonify
import os
import pdfplumber

app = Flask(__name__)

# ---------- FOLDERS ----------
UPLOAD_FOLDER = "data/uploads"
EXTRACTED_TEXT_FOLDER = "data/extracted_text"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(EXTRACTED_TEXT_FOLDER, exist_ok=True)

# ---------- HOME ROUTE ----------
@app.route("/")
def home():
    return "Car Lease / Loan AI Assistant Backend Running"

# ---------- OCR FUNCTION ----------
def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    return text

# ---------- SAVE EXTRACTED TEXT ----------
def save_extracted_text(file_name, text):
    text_file_path = os.path.join(
        EXTRACTED_TEXT_FOLDER,
        file_name.replace(".pdf", ".txt")
    )

    with open(text_file_path, "w", encoding="utf-8") as f:
        f.write(text)

    return text_file_path

# ---------- UPLOAD API ----------
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Save PDF
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # OCR
    extracted_text = extract_text_from_pdf(file_path)

    # Save extracted text
    text_file_path = save_extracted_text(file.filename, extracted_text)

    print("------ EXTRACTED TEXT (PREVIEW) ------")
    print(extracted_text[:500])
    print("------ SAVED TO FILE ------")
    print(text_file_path)
    saved_path = save_extracted_text(file.filename, extracted_text)
    print(f"Text saved at: {saved_path}")


    return jsonify({
        "message": "File uploaded, OCR completed, text saved",
        "pdf_file": file.filename,
        "text_file": text_file_path
    })

# ---------- RUN APP ----------
if __name__ == "__main__":
    app.run(debug=True)
from flask import Flask, request, jsonify
import os
import pdfplumber

app = Flask(__name__)

# ---------- FOLDERS ----------
UPLOAD_FOLDER = "data/uploads"
EXTRACTED_TEXT_FOLDER = "data/extracted_text"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(EXTRACTED_TEXT_FOLDER, exist_ok=True)

# ---------- HOME ROUTE ----------
@app.route("/")
def home():
    return "Car Lease / Loan AI Assistant Backend Running"

# ---------- OCR FUNCTION ----------
def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    return text

# ---------- SAVE EXTRACTED TEXT ----------
def save_extracted_text(file_name, text):
    text_file_path = os.path.join(
        EXTRACTED_TEXT_FOLDER,
        file_name.replace(".pdf", ".txt")
    )

    with open(text_file_path, "w", encoding="utf-8") as f:
        f.write(text)

    return text_file_path

# ---------- UPLOAD API ----------
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Save PDF
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # OCR
    extracted_text = extract_text_from_pdf(file_path)

    # Save extracted text
    text_file_path = save_extracted_text(file.filename, extracted_text)

    print("------ EXTRACTED TEXT (PREVIEW) ------")
    print(extracted_text[:500])
    print("------ SAVED TO FILE ------")
    print(text_file_path)
    saved_path = save_extracted_text(file.filename, extracted_text)
    print(f"Text saved at: {saved_path}")


    return jsonify({
        "message": "File uploaded, OCR completed, text saved",
        "pdf_file": file.filename,
        "text_file": text_file_path
    })
@app.route("/contracts/<file_name>", methods=["GET"])
def get_extracted_text(file_name):
    text_file = file_name.replace(".pdf", ".txt")
    text_path = os.path.join("data/extracted_text", text_file)

    if not os.path.exists(text_path):
        return jsonify({"error": "Extracted text not found"}), 404

    with open(text_path, "r", encoding="utf-8") as f:
        text = f.read()

    return jsonify({
        "file_name": file_name,
        "extracted_text": text
    })


# ---------- RUN APP ----------
if __name__ == "__main__":
    app.run(debug=True)
