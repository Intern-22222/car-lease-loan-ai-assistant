from services.api import get_market_fair_price
import json
import os
from typing import Optional
from pypdf import PdfReader
import re
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn
from pydantic import BaseModel

app = FastAPI()

# 1. Allow React (Port 3000) to talk to Python (Port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class EmailRequest(BaseModel):
    body: str

@app.get("/")
def read_root():
    return {"message": "Car Lease AI Backend is Running!"}

# --- HELPER 1: Extract Text from PDF (OCR) ---
def extract_text_from_pdf(file_path):
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        
        # --- DEBUGGING: PRINT WHAT WE FOUND ---
        print(f"\n🔍 DEBUG: AI saw {len(text)} characters.")
        if len(text) > 0:
            print(f"🔍 PREVIEW: {text[:100]}...") # Show first 100 letters
        else:
            print("🔍 ERROR: PDF seems empty to the code!")
        # ---------------------------------------

        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

# --- HELPER 2: Advanced Analysis Logic ---
def analyze_contract_text(text):
    score = 10.0
    flags = []
    data = {"apr": None, "monthly": None}

    # 1. CHECK FOR EMPTINESS
    if len(text) < 50:
        return 0.0, ["Error: File is empty or unreadable (Scanned Image?)"], data

    # 2. EXTRACT APR (Interest Rate)
    # Regex looks for numbers like "4.5%" or "10.00 %"
    apr_matches = re.findall(r'(\d+\.?\d*)\s?%', text)
    if apr_matches:
        # Filter out crazy numbers (e.g., > 30%)
        valid_aprs = [float(x) for x in apr_matches if float(x) < 30]
        if valid_aprs:
            found_apr = max(valid_aprs)
            data["apr"] = found_apr
            if found_apr > 6.0:
                score -= 2.0
                flags.append(f"High Interest Rate detected: {found_apr}%")
    else:
        score -= 2.0
        flags.append("Warning: No APR/Interest Rate found in text.")

    # 3. EXTRACT MONTHLY PAYMENT
    # Regex looks for "$450", "$ 1,200", etc.
    price_matches = re.findall(r'\$\s?([0-9,]+)', text)
    if price_matches:
        # Clean up commas and filter for reasonable lease prices ($100 - $2500)
        prices = [float(p.replace(',', '')) for p in price_matches]
        reasonable_prices = [p for p in prices if 100 < p < 2500]
        
        if reasonable_prices:
            data["monthly"] = max(reasonable_prices) # Assume highest is the monthly payment
    
    if not data["monthly"]:
        score -= 2.0
        flags.append("Warning: No Monthly Payment found.")

    # 4. KEYWORD CHECKS (The "Fine Print")
    if "termination fee" in text.lower() or "disposition fee" in text.lower():
        score -= 1.5
        flags.append("Hidden Termination/Disposition Fee found.")
    
    if "arbitration" in text.lower() or "waive jury" in text.lower():
        score -= 1.0
        flags.append("Mandatory Arbitration Clause detected.")

    return round(max(0.0, score), 1), flags, data

## --- 5. THE FINAL CORRECT ENDPOINT ---
@app.post("/compare")
async def compare_contracts(
    file1: Optional[UploadFile] = File(None), 
    file2: Optional[UploadFile] = File(None)
):
    # 1. DATA CONTAINERS
    result_a = None
    result_b = None
    score_a, score_b = 0, 0

    # 2. PROCESS FILE 1 (MANDATORY)
    if file1:
        file1_path = f"temp_{file1.filename}"
        with open(file1_path, "wb") as f1:
            f1.write(await file1.read())
        
        text_a = extract_text_from_pdf(file1_path)
        score_a, flags_a, data_a = analyze_contract_text(text_a)
        
        result_a = {
            "name": file1.filename,
            "score": round(max(0, min(10, score_a)), 1),
            "apr": data_a["apr"] if data_a["apr"] else "N/A",
            "monthly": data_a["monthly"] if data_a["monthly"] else "N/A",
            "details": flags_a if flags_a else ["Standard Terms - Looks Safe"]
        }

    # 3. PROCESS FILE 2 (OPTIONAL)
    if file2:
        file2_path = f"temp_{file2.filename}"
        with open(file2_path, "wb") as f2:
            f2.write(await file2.read())
        
        text_b = extract_text_from_pdf(file2_path)
        score_b, flags_b, data_b = analyze_contract_text(text_b)
        
        result_b = {
            "name": file2.filename,
            "score": round(max(0, min(10, score_b)), 1),
            "apr": data_b["apr"] if data_b["apr"] else "N/A",
            "monthly": data_b["monthly"] if data_b["monthly"] else "N/A",
            "details": flags_b if flags_b else ["Standard Terms - Looks Safe"]
        }

        # 4. RUN COMPARISON (ONLY IF BOTH EXIST)
        # If we have two prices, we compare them
        price_a = data_a.get("monthly")
        price_b = data_b.get("monthly")

        if price_a and price_b:
            if price_a < price_b:
                result_a["score"] = min(10, result_a["score"] + 1)
                result_b["score"] = max(0, result_b["score"] - 1)
                result_a["details"].append(f"Better Price! (${price_a} vs ${price_b})")
            elif price_b < price_a:
                result_b["score"] = min(10, result_b["score"] + 1)
                result_a["score"] = max(0, result_a["score"] - 1)
                result_b["details"].append(f"Better Price! (${price_b} vs ${price_a})")

    # 5. RETURN RESULTS
    # CRITICAL FIX: We send 'None' for contract_b if it doesn't exist.
    # This tells the Frontend: "Don't show the comparison circle!"
    return {
        "contract_a": result_a, 
        "contract_b": result_b, 
        "winner": "Contract A" if (result_b and result_a["score"] >= result_b["score"]) else "Contract B" if result_b else "N/A"
    }
# 3. NEW ENDPOINT: SEND EMAIL
@app.post("/send-email")
async def send_email(request: EmailRequest):
    print("--------------------------------------------------")
    print("🚀 [BACKEND] SENDING EMAIL TO DEALER:")
    print(request.body)
    print("--------------------------------------------------")
    return {"status": "success", "message": "Email sent!"}

# 4. NEW ENDPOINT: CHATBOT
class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    # This is a "Mock" AI response for the demo
    return {"answer": f"That is a great question about '{request.question}'! Based on the fairness score, I recommend negotiating the APR."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

    # --- 5. DYNAMIC AUTHENTICATION (Email Based) ---
class LoginRequest(BaseModel):
    email: str  # <--- Changed from username to email
    password: str

# Database File Path
DB_FILE = "users_db.json"

def load_users():
    if not os.path.exists(DB_FILE):
        return {} 
    try:
        with open(DB_FILE, "r") as f:
            return json.load(f)
    except:
        return {}

def save_users(users):
    with open(DB_FILE, "w") as f:
        json.dump(users, f)

@app.post("/login")
def login_user(request: LoginRequest):
    users = load_users()
    email = request.email.lower().strip() # Clean the email input

    # Extract a "Name" from the email (e.g., sanchit@gmail.com -> Sanchit)
    user_name = email.split("@")[0].capitalize()

    # SCENARIO A: OLD USER (Welcome Back)
    if email in users:
        if users[email] == request.password:
            return {
                "status": "success", 
                "message": f"Welcome Back, {user_name}!", 
                "user": email,
                "name": user_name,
                "type": "returning"
            }
        else:
            return {"status": "error", "message": "Wrong Password!"}

    # SCENARIO B: NEW USER (Auto-Register)
    else:
        users[email] = request.password
        save_users(users)
        
        return {
            "status": "success", 
            "message": f"Welcome New Member, {user_name}!", 
            "user": email,
            "name": user_name,
            "type": "new"
        }
    
    # --- 6. PRICE PREDICTION ENDPOINT (Merged Feature) ---
class PriceRequest(BaseModel):
    vin: str
    mileage: int = 12000

@app.post("/predict-price")
def predict_car_price(request: PriceRequest):
    print(f"🔮 Predicting price for VIN: {request.vin}")
    
    # Call the colleague's logic
    try:
        result = get_market_fair_price(request.vin, request.mileage)
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}