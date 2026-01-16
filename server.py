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
        session_id: (optional) unique session identifier for history
    """
    data = request.get_json() or {}
    message = data.get('message', '')
    context = data.get('context', {})
    session_id = data.get('session_id', 'default')
    
    if not message:
        return jsonify({"success": False, "error": "Message is required"}), 400
    
    result = chat_negotiation(message, context, session_id)
    return jsonify(result)

@app.route('/api/chat/history', methods=['GET'])
def chat_history_endpoint():
    """Get chat history for a session."""
    session_id = request.args.get('session_id', 'default')
    from backend.app.api import get_chat_history
    result = get_chat_history(session_id)
    return jsonify(result)

@app.route('/api/chat/clear', methods=['POST'])
def chat_clear_endpoint():
    """Clear chat history for a session."""
    data = request.get_json() or {}
    session_id = data.get('session_id', 'default')
    from backend.app.api import clear_chat_history
    result = clear_chat_history(session_id)
    return jsonify(result)


# ============================================
# VIN Insights (Market Position, Days on Market, Similar Listings)
# ============================================
@app.route('/api/vin_insights', methods=['GET'])
def vin_insights_endpoint():
    """
    Get comprehensive VIN insights for negotiation.
    Returns: days on market, similar listings, market position, negotiation tips.
    """
    vin = request.args.get('vin', '')
    if not vin:
        return jsonify({"success": False, "error": "VIN is required"}), 400
    
    from backend.app.valuation import get_vin_insights
    result = get_vin_insights(vin)
    return jsonify(result)


# ============================================
# Document Analysis (OCR + AI)
# ============================================
@app.route('/api/document/analyze', methods=['POST'])
def analyze_document_endpoint():
    """
    Analyze uploaded document (image/PDF) with optional user prompt.
    Multipart form data: 'file' (required), 'prompt' (optional)
    """
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "error": "No selected file"}), 400
    
    # Get optional prompt from form data
    user_prompt = request.form.get('prompt', None)
        
    from backend.app.api import analyze_document
    result = analyze_document(file, user_prompt)
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
    print("   GET      /api/chat/history            - Get chat history")
    print("   POST     /api/chat/clear              - Clear chat history")
    print("\n" + "="*50 + "\n")
    
    app.run(debug=True, port=5000)

