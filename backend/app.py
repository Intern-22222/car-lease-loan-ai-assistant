from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import pdfplumber

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app, resources={r"/*": {"origins": "*"}})

# ---------- FOLDERS ----------
UPLOAD_FOLDER = "data/uploads"
EXTRACTED_TEXT_FOLDER = "data/extracted_text"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(EXTRACTED_TEXT_FOLDER, exist_ok=True)

# ---------- SERVE FRONTEND ----------
@app.route("/")
def serve_index():
    """Serve the main index.html file"""
    return send_from_directory('../frontend', 'index.html')

@app.route("/<path:filename>")
def serve_static_files(filename):
    """Serve static files (CSS, JS, images, etc.)"""
    return send_from_directory('../frontend', filename)

# ---------- OCR FUNCTION ----------
def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        if not text.strip():
            text = "No text could be extracted from this PDF"
    except Exception as e:
        print(f"PDF extraction error: {e}")
        text = f"Error extracting text from PDF: {str(e)}"
    return text

# ---------- UPLOAD API ----------
@app.route("/upload", methods=["POST"])
def upload_file():
    print("Upload endpoint hit!")  # Debug
    
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Only PDF files are allowed"}), 400

    # Save PDF
    pdf_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(pdf_path)
    print(f"File saved to: {pdf_path}")  # Debug

    # OCR
    extracted_text = extract_text_from_pdf(pdf_path)
    print(f"Extracted {len(extracted_text)} characters")  # Debug

    # Save extracted text
    text_file_name = file.filename.rsplit('.', 1)[0] + ".txt"
    text_path = os.path.join(EXTRACTED_TEXT_FOLDER, text_file_name)

    with open(text_path, "w", encoding="utf-8") as f:
        f.write(extracted_text)

    return jsonify({
        "message": "File uploaded and text extracted",
        "file_name": file.filename,
        "text_file": text_file_name
    })

# ---------- GET EXTRACTED TEXT ----------
@app.route("/contracts/<file_name>", methods=["GET"])
def get_contract_text(file_name):
    print(f"Getting contract text for: {file_name}")  # Debug
    
    # Handle both .pdf and .txt requests
    if file_name.endswith('.pdf'):
        text_file = file_name.replace(".pdf", ".txt")
    elif file_name.endswith('.txt'):
        text_file = file_name
    else:
        text_file = file_name + ".txt"
    
    text_path = os.path.join(EXTRACTED_TEXT_FOLDER, text_file)

    if not os.path.exists(text_path):
        return jsonify({"error": f"Extracted text not found: {text_file}"}), 404

    try:
        with open(text_path, "r", encoding="utf-8") as f:
            text = f.read()
    except Exception as e:
        return jsonify({"error": f"Read error: {str(e)}"}), 500

    return jsonify({
        "file_name": file_name,
        "extracted_text": text
    })

# ---------- RUN ----------
if __name__ == "__main__":
    print("\n" + "="*50)
    print("🚀 PDF Extractor Server Starting...")
    print("="*50)
    print(f"📂 Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")
    print(f"📄 Text folder: {os.path.abspath(EXTRACTED_TEXT_FOLDER)}")
    print(f"🌐 Frontend folder: {os.path.abspath('../frontend')}")
    print("="*50)
    print("✅ Server running at: http://127.0.0.1:5000")
    print("="*50 + "\n")
    app.run(debug=True, port=5000)