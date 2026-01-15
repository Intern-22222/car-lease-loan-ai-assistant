"""
Unified Flask Server
Combines Milestone 3 (Chatbot) and Milestone 4 (VIN Decode + Valuation)
into a single runnable application for real-time testing.
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

# Import our modules
from backend.app.api import get_market_fair_price, chat_negotiation

app = Flask(__name__, static_folder='frontend', static_url_path='')
CORS(app)  # Enable CORS for frontend-backend communication

# ============================================
# Milestone 4: VIN Decode + Market Valuation
# ============================================
@app.route('/api/market_value', methods=['GET', 'POST'])
def market_value_endpoint():
    """
    Get market fair price for a vehicle by VIN.
    
    Query params or JSON body:
        vin: 17-character VIN string
        mileage: (optional) current mileage, default 12000
    """
    if request.method == 'POST':
        data = request.get_json() or {}
        vin = data.get('vin', '')
        mileage = data.get('mileage', 12000)
    else:
        vin = request.args.get('vin', '')
        mileage = int(request.args.get('mileage', 12000))
    
    if not vin:
        return jsonify({"success": False, "error": "VIN is required"}), 400
    
    result = get_market_fair_price(vin, mileage)
    return jsonify(result)


# ============================================
# Milestone 3: Negotiation Chatbot
# ============================================
@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    """
    Chat with the AI negotiation assistant.
    
    JSON body:
        message: user's message string
        context: {
            vehicle_details: {year, make, model, trim},
            market_value: {price, currency}
        }
    """
    data = request.get_json() or {}
    message = data.get('message', '')
    context = data.get('context', {})
    
    if not message:
        return jsonify({"success": False, "error": "Message is required"}), 400
    
    result = chat_negotiation(message, context)
    return jsonify(result)


# ============================================
# Serve Frontend
# ============================================
@app.route('/')
def serve_frontend():
    return send_from_directory('frontend', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('frontend', path)


# ============================================
# Run Server
# ============================================
if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚗 Car Lease/Loan AI Assistant - Unified Server")
    print("="*50)
    print("\n📍 Open your browser to: http://localhost:5000")
    print("\n📡 API Endpoints:")
    print("   GET/POST /api/market_value?vin=<VIN>  - Get car value")
    print("   POST     /api/chat                    - Chat with AI")
    print("\n" + "="*50 + "\n")
    
    app.run(debug=True, port=5000)
