// app.js - Connected to Backend API

// API Base URL (change if running on different port)
const API_BASE = 'http://localhost:5000';

// State
let currentContext = {
    vehicle_details: null,
    market_value: null
};

// Elements
const loadCarBtn = document.getElementById('loadCarBtn');
const vinInput = document.getElementById('vinInput');
const vehicleDetails = document.getElementById('vehicleDetails');
const marketCard = document.getElementById('marketCard');
const chatInput = document.getElementById('userMessage');
const sendBtn = document.getElementById('sendBtn');
const chatHistory = document.getElementById('chatHistory');
const chatStatusText = document.getElementById('chatStatusText');

// Helpers
function addMessage(text, isUser = false) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.classList.add(isUser ? 'user-message' : 'bot-message');
    div.textContent = text;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function updateStatus(text, isActive = false) {
    chatStatusText.textContent = text;
    const dot = document.querySelector('.status-dot');
    dot.style.backgroundColor = isActive ? '#4ade80' : '#fbbf24';
}

// ============================================
// 1. Load Car Data - Calls Milestone 4 API
// ============================================
loadCarBtn.addEventListener('click', async () => {
    const vin = vinInput.value.trim();
    if (!vin) {
        alert('Please enter a VIN');
        return;
    }

    loadCarBtn.textContent = 'Analyzing...';
    loadCarBtn.disabled = true;
    updateStatus("Decoding VIN via NHTSA...", false);

    try {
        // Call the real backend API (Milestone 4)
        const response = await fetch(`${API_BASE}/api/market_value?vin=${encodeURIComponent(vin)}`);
        const data = await response.json();

        if (data.success) {
            currentContext.vehicle_details = data.vehicle_details;
            currentContext.market_value = data.market_value;
            currentContext.engine_specs = data.engine_specs;
            currentContext.drivetrain = data.drivetrain;
            currentContext.safety_features = data.safety_features;

            // Render vehicle details
            document.getElementById('valYear').textContent = data.vehicle_details.year || '-';
            document.getElementById('valMake').textContent = data.vehicle_details.make || '-';
            document.getElementById('valModel').textContent = data.vehicle_details.model || '-';
            document.getElementById('valTrim').textContent = data.vehicle_details.trim || '-';
            document.getElementById('valBody').textContent = data.vehicle_details.body_class || '-';
            document.getElementById('valDoors').textContent = data.vehicle_details.doors || '-';
            
            // Render engine & drivetrain
            const engineSpecs = data.engine_specs || {};
            const drivetrain = data.drivetrain || {};
            const cylinders = engineSpecs.cylinders || '';
            const displacement = engineSpecs.displacement_l ? `${engineSpecs.displacement_l}L` : '';
            document.getElementById('valEngine').textContent = `${cylinders} cyl ${displacement}`.trim() || '-';
            document.getElementById('valHP').textContent = engineSpecs.horsepower ? `${engineSpecs.horsepower} hp` : '-';
            document.getElementById('valFuel').textContent = engineSpecs.fuel_type || '-';
            document.getElementById('valTrans').textContent = drivetrain.transmission || '-';
            document.getElementById('valDrive').textContent = drivetrain.drive_type || '-';
            
            // Render market value
            document.getElementById('marketPrice').textContent = data.market_value.price.toLocaleString();
            document.getElementById('rangeLow').textContent = data.market_value.fair_price_range.low.toLocaleString();
            document.getElementById('rangeHigh').textContent = data.market_value.fair_price_range.high.toLocaleString();

            // Show sections
            vehicleDetails.classList.remove('hidden');
            marketCard.classList.remove('hidden');
            document.getElementById('engineCard').classList.remove('hidden');

            // Enable Chat
            chatInput.disabled = false;
            sendBtn.disabled = false;
            loadCarBtn.textContent = '✓ Analyzed';
            updateStatus("AI Negotiator Online", true);
            
            addMessage(`Great! I found your ${data.vehicle_details.year} ${data.vehicle_details.make} ${data.vehicle_details.model}. The estimated fair market value is $${data.market_value.price.toLocaleString()}. What's the dealer asking for it?`);
        } else {
            // Handle API error
            loadCarBtn.textContent = 'Try Again';
            loadCarBtn.disabled = false;
            addMessage(`Error: ${data.error || 'Could not decode VIN'}. Please check the VIN and try again.`);
        }

    } catch (err) {
        console.error('API Error:', err);
        loadCarBtn.textContent = 'Try Again';
        loadCarBtn.disabled = false;
        addMessage("Could not connect to the server. Make sure the backend is running (python server.py).");
    }
});

// ============================================
// 2. Chat Logic - Calls Milestone 3 API
// ============================================
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    chatInput.value = '';
    
    // Show loading indicator
    addMessage("...", false);
    const loadingMsg = chatHistory.lastChild;

    try {
        // Call the real backend chat API (Milestone 3)
        const response = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: text,
                context: currentContext
            })
        });
        
        const data = await response.json();

        // Remove loading indicator
        chatHistory.removeChild(loadingMsg);

        if (data.success) {
            addMessage(data.response);
        } else {
            addMessage("Sorry, I couldn't process that. Please try again.");
        }

    } catch (err) {
        console.error('Chat API Error:', err);
        chatHistory.removeChild(loadingMsg);
        addMessage("Connection error. Is the backend server running?");
    }
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
