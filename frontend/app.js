// app.js - Connected to Backend API with Chat History

// API Base URL
const API_BASE = 'http://localhost:5000';

// State
let currentContext = {
    vehicle_details: null,
    market_value: null,
    engine_specs: null,
    drivetrain: null,
    safety_features: null
};
let currentVIN = null;
let sessionId = null;

// Elements
const loadCarBtn = document.getElementById('loadCarBtn');
const vinInput = document.getElementById('vinInput');
const vehicleDetails = document.getElementById('vehicleDetails');
const marketCard = document.getElementById('marketCard');
const chatInput = document.getElementById('userMessage');
const sendBtn = document.getElementById('sendBtn');
const chatHistory = document.getElementById('chatHistory');
const chatStatusText = document.getElementById('chatStatusText');

// Simple Markdown to HTML converter
function markdownToHtml(text) {
    if (!text) return '';
    
    return text
        // Headers
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Unordered lists
        .replace(/^\* (.*$)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        // Numbered lists
        .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
        // Line breaks
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
}

// Helpers
function addMessage(content, isUser = false, isHtml = false) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.classList.add(isUser ? 'user-message' : 'bot-message');
    
    // Create content wrapper
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');

    if (isHtml) {
        contentDiv.innerHTML = content;
        div.classList.add('loading-message');
    } else if (!isUser) {
        // For bot messages, convert markdown to HTML
        contentDiv.innerHTML = markdownToHtml(content);
        // Track for history (only non-loading messages)
        addMessageToHistory(content, false);
    } else {
        contentDiv.textContent = content;
        // Track user message for history
        addMessageToHistory(content, true);
    }
    
    div.appendChild(contentDiv);
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function updateStatus(text, isActive = false) {
    chatStatusText.textContent = text;
    const dot = document.querySelector('.status-dot');
    dot.style.backgroundColor = isActive ? '#4ade80' : '#fbbf24';
}

function clearChat() {
    // Clear all messages except the first welcome message
    const messages = chatHistory.querySelectorAll('.message');
    messages.forEach((msg, index) => {
        if (index > 0) msg.remove();
    });
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
            // Store VIN and create session ID
            currentVIN = vin;
            sessionId = `vin_${vin}`;
            
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
            const currency = data.market_value.currency === 'GBP' ? '£' : '$';
            document.getElementById('marketPrice').textContent = data.market_value.price.toLocaleString();
            document.getElementById('rangeLow').textContent = data.market_value.fair_price_range.low.toLocaleString();
            document.getElementById('rangeHigh').textContent = data.market_value.fair_price_range.high.toLocaleString();
            document.querySelector('.currency').textContent = currency;

            // Show sections
            vehicleDetails.classList.remove('hidden');
            marketCard.classList.remove('hidden');
            document.getElementById('engineCard').classList.remove('hidden');

            // Enable Chat
            chatInput.disabled = false;
            sendBtn.disabled = false;
            loadCarBtn.textContent = 'Analyzed';
            loadCarBtn.style.display = 'none'; // Hide analyze button
            resetBtn.classList.remove('hidden'); // Show reset button
            
            updateStatus(`Negotiating: ${data.vehicle_details.year} ${data.vehicle_details.make} ${data.vehicle_details.model}`, true);
            
            // Load chat history from backend
            await loadChatHistory(sessionId, data.vehicle_details, data.market_value, currency, vin);

            // Fetch VIN Insights (Days on Market, Similar Listings, Tips)
            try {
                const insightsResp = await fetch(`${API_BASE}/api/vin_insights?vin=${encodeURIComponent(vin)}`);
                const insights = await insightsResp.json();
                
                if (insights.success) {
                    const insightsCard = document.getElementById('insightsCard');
                    
                    // Days on Market
                    const domValue = document.getElementById('domValue');
                    if (insights.days_on_market) {
                        domValue.textContent = `${insights.days_on_market} days`;
                        if (insights.days_on_market > 60) domValue.style.color = '#4ade80';
                        else if (insights.days_on_market > 30) domValue.style.color = '#fbbf24';
                        else domValue.style.color = '#f87171';
                    } else {
                        domValue.textContent = 'N/A';
                    }
                    
                    // Market Position
                    const posValue = document.getElementById('positionValue');
                    if (insights.market_position === 'above_market') {
                        posValue.textContent = 'Above Market';
                        posValue.className = 'insight-value above';
                    } else if (insights.market_position === 'below_market') {
                        posValue.textContent = 'Good Deal!';
                        posValue.className = 'insight-value below';
                    } else if (insights.market_position === 'at_market') {
                        posValue.textContent = 'Fair Price';
                        posValue.className = 'insight-value at';
                    } else {
                        posValue.textContent = 'N/A';
                    }
                    
                    // Negotiation Tips
                    const tipsContainer = document.getElementById('insightsTips');
                    tipsContainer.innerHTML = '';
                    if (insights.negotiation_tips && insights.negotiation_tips.length > 0) {
                        insights.negotiation_tips.forEach(tip => {
                            const tipDiv = document.createElement('div');
                            tipDiv.className = 'tip-item';
                            tipDiv.textContent = tip;
                            tipsContainer.appendChild(tipDiv);
                        });
                    }
                    
                    // Store in context for AI
                    currentContext.insights = insights;
                    
                    // Show card
                    insightsCard.classList.remove('hidden');
                }
            } catch (insightErr) {
                console.log('VIN Insights not available:', insightErr);
            }
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

// Reset Analysis Logic
const resetBtn = document.getElementById('resetBtn');

resetBtn.addEventListener('click', () => {
    // Reset UI State
    loadCarBtn.style.display = 'block';
    loadCarBtn.textContent = 'Analyze VIN';
    loadCarBtn.disabled = false;
    resetBtn.classList.add('hidden');
    
    // Hide details cards
    vehicleDetails.classList.add('hidden');
    marketCard.classList.add('hidden');
    document.getElementById('engineCard').classList.add('hidden');
    document.getElementById('insightsCard').classList.add('hidden');
    
    // Clear Chat
    clearChat();
    chatInput.disabled = true;
    sendBtn.disabled = true;
    updateStatus("Ready to assist", false);
    
    // Reset Data
    currentVIN = null;
    sessionId = null;
    currentContext = {
        vehicle_details: null,
        market_value: null
    };
    
    // Focus input
    vinInput.value = '';
    vinInput.focus();
});

// ============================================
// 2. Chat Logic - Calls Milestone 3 API with History
// ============================================
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    chatInput.value = '';
    
    // Show loading indicator
    const typingIndicator = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    addMessage(typingIndicator, false, true); // true flag for HTML content
    const loadingMsg = chatHistory.lastChild;

    try {
        // Call the real backend chat API with session_id
        const response = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: text,
                context: currentContext,
                session_id: sessionId || 'default'
            })
        });
        
        const data = await response.json();

        // Remove loading indicator
        chatHistory.removeChild(loadingMsg);

        if (data.success) {
            addMessage(data.response);
            
            // Update history preview in sidebar
            if (currentVIN && currentContext.vehicle_details) {
                saveSessionToHistory(currentVIN, currentContext.vehicle_details, data.response);
            }
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

// ============================================
// 3. Load Chat History from Backend
// ============================================
// ============================================
// 3. Tab & History Management
// ============================================

// Tabs
const tabAnalysis = document.getElementById('tabAnalysis');
const tabHistory = document.getElementById('tabHistory');
const analysisView = document.getElementById('analysisView');
const historyView = document.getElementById('historyView');
const historyList = document.getElementById('historyList');

function switchTab(tab) {
    if (tab === 'analysis') {
        tabAnalysis.classList.add('active');
        tabHistory.classList.remove('active');
        analysisView.classList.remove('hidden');
        historyView.classList.add('hidden');
    } else {
        tabHistory.classList.add('active');
        tabAnalysis.classList.remove('active');
        historyView.classList.remove('hidden');
        analysisView.classList.add('hidden');
        renderHistoryList();
    }
}

tabAnalysis.addEventListener('click', () => switchTab('analysis'));
tabHistory.addEventListener('click', () => switchTab('history'));

// History Persistence (LocalStorage)
const HISTORY_KEY = 'car_assistant_sessions';
let currentChatMessages = [];
let currentSessionKey = null; // Unique key for current chat session

function getSavedSessions() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
        return [];
    }
}

function saveSession(vin, vehicleInfo, chatMessages) {
    const sessions = getSavedSessions();
    
    // Check if session for this VIN already exists
    const existingIndex = sessions.findIndex(s => s.vin === vin);
    
    // Create robust vehicle title
    let vehicleTitle = 'General Chat';
    if (vehicleInfo && vehicleInfo.make) {
        vehicleTitle = `${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`;
    }
    
    const sessionData = {
        vin: vin,
        vehicle: vehicleTitle,
        lastMessage: chatMessages.length > 0 ? chatMessages[chatMessages.length - 1].text.substring(0, 50) : 'New conversation',
        timestamp: new Date().toISOString(),
        messages: chatMessages
    };
    
    if (existingIndex >= 0) {
        sessions[existingIndex] = sessionData;
        // Move to top
        const updated = sessions.splice(existingIndex, 1)[0];
        sessions.unshift(updated);
    } else {
        sessions.unshift(sessionData); // Add to beginning
    }
    
    // Keep only last 20 sessions
    const trimmedSessions = sessions.slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedSessions));
    
    renderHistoryList();
}

function renderHistoryList() {
    const sessions = getSavedSessions();
    historyList.innerHTML = '';
    
    if (sessions.length === 0) {
        historyList.innerHTML = '<div class="no-history">No saved sessions</div>';
        return;
    }
    
    sessions.forEach((session, index) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        const dateStr = session.timestamp ? new Date(session.timestamp).toLocaleDateString() : '';
        
        item.innerHTML = `
            <div class="history-vehicle">${session.vehicle}</div>
            <div class="history-preview">${session.lastMessage}...</div>
            <span class="date">${dateStr}</span>
        `;
        item.onclick = () => loadSession(index);
        historyList.appendChild(item);
    });
}

function loadSession(index) {
    const sessions = getSavedSessions();
    const session = sessions[index];
    if (!session) return;
    
    // Clear current chat first (keep welcome message)
    clearChat();
    
    // Restore variables
    currentChatMessages = session.messages || [];
    currentVIN = session.vin === 'general-chat' ? null : session.vin;
    
    // Restore messages to UI
    if (session.messages && session.messages.length > 0) {
        session.messages.forEach(msg => {
            const div = document.createElement('div');
            div.classList.add('message');
            div.classList.add(msg.isUser ? 'user-message' : 'bot-message');
            
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('content');
            
            if (!msg.isUser) {
                contentDiv.innerHTML = markdownToHtml(msg.text);
            } else {
                contentDiv.textContent = msg.text;
            }
            
            div.appendChild(contentDiv);
            chatHistory.appendChild(div);
        });
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Just enable chat - NO VIN analysis
    updateStatus(`Viewing: ${session.vehicle}`, true);
    chatInput.disabled = false;
    sendBtn.disabled = false;
    
    // If there was a VIN, just show it in the input (don't click analyze)
    if (session.vin && session.vin !== 'general-chat') {
        vinInput.value = session.vin;
    }
    
    // Switch to controls view
    document.getElementById('controlsView').classList.remove('hidden');
    document.getElementById('historyView').classList.add('hidden');
    
    // Highlight controls tab
    tabAnalysis.classList.add('active');
    tabHistory.classList.remove('active');
    analysisView.classList.remove('hidden');
    historyView.classList.add('hidden');
}

function addMessageToHistory(text, isUser) {
    currentChatMessages.push({ text, isUser, timestamp: new Date().toISOString() });
    
    // Generate unique session key if not set
    if (!currentSessionKey) {
        currentSessionKey = `chat_${Date.now()}`;
    }
    
    // Auto-save after each message
    if (currentVIN && currentContext.vehicle_details) {
        saveSession(currentVIN, currentContext.vehicle_details, currentChatMessages);
    } else {
        // Save as "General Chat" with unique session key
        const genericInfo = { year: '', make: 'General', model: 'Chat' };
        saveSession(currentSessionKey, genericInfo, currentChatMessages);
    }
}

// Initialize history list on page load
document.addEventListener('DOMContentLoaded', () => {
    vinInput.value = ''; // Clear any auto-filled value
    renderHistoryList();
});

// New Chat / Reset Logic
const newChatBtn = document.getElementById('newChatBtn');

function startNewChat() {
    // Reset UI State
    loadCarBtn.style.display = 'block';
    loadCarBtn.textContent = 'Analyze VIN';
    loadCarBtn.disabled = false;
    resetBtn.classList.add('hidden');
    
    // Hide details cards
    vehicleDetails.classList.add('hidden');
    marketCard.classList.add('hidden');
    document.getElementById('engineCard').classList.add('hidden');
    document.getElementById('insightsCard').classList.add('hidden');
    
    // Clear Chat
    clearChat();
    chatInput.disabled = false;
    sendBtn.disabled = false;
    document.querySelector('#userMessage').disabled = false; // ensure input enabled
    updateStatus("Ready to assist", false);
    
    // Reset Data
    currentVIN = null;
    sessionId = null;
    currentContext = {
        vehicle_details: null,
        market_value: null,
        engine_specs: null,
        drivetrain: null,
        safety_features: null
    };
    currentChatMessages = []; // Clear tracked messages
    currentSessionKey = null; // Generate new session key for next chat
    
    // Focus input
    vinInput.value = '';
    vinInput.focus();
    
    // Switch to Controls tab
    tabAnalysis.click();
}

// Connect Buttons
if (newChatBtn) newChatBtn.addEventListener('click', startNewChat);

// Update Reset Button to use the same logic
// Note: resetBtn listener in original code might duplicate this, but this function is cleaner
// We'll replace the old listener in the file or just ensure this one is primary
resetBtn.replaceWith(resetBtn.cloneNode(true)); // Remove old listeners
document.getElementById('resetBtn').addEventListener('click', startNewChat);

// 4. Update loadChatHistory to support history updates
async function loadChatHistory(sessionId, vehicleDetails, marketValue, currency, vin) {
    try {
        clearChat(); // Clear existing chat
        
        const response = await fetch(`${API_BASE}/api/chat/history?session_id=${encodeURIComponent(sessionId)}`);
        const data = await response.json();
        
        let hasHistory = false;
        
        if (data.success && data.history && data.history.length > 0) {
            hasHistory = true;
            console.log(`Restoring ${data.history.length} messages from history`);
            data.history.forEach(msg => {
                addMessage(msg.content, msg.role === 'user');
            });
            
            // Update local storage entry if needed (using last message)
            const lastMsg = data.history[data.history.length - 1];
            saveSessionToHistory(vin, vehicleDetails, lastMsg.content);
        } else {
            // No history - show welcome message
            const carName = `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}`;
            const priceStr = `${currency}${marketValue.price.toLocaleString()}`;
            addMessage(`Great! I found your ${carName} (VIN: ${vin.slice(-8)}). The estimated fair market value is ${priceStr}. What's the dealer asking for it?`);
            
            // Create initial session entry
            saveSessionToHistory(vin, vehicleDetails, "New conversation started");
        }
    } catch (err) {
        console.error('Failed to load chat history:', err);
    }
}


// File Attachment Handler (ChatGPT-style)
const fileInput = document.getElementById('fileInput');
const attachmentPreview = document.getElementById('attachmentPreview');
const attachedFileName = document.getElementById('attachedFileName');
const removeAttachment = document.getElementById('removeAttachment');

let attachedFile = null; // Store the attached file

// When user selects a file, show preview chip instead of auto-uploading
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    attachedFile = file;
    attachedFileName.textContent = `📄 ${file.name}`;
    attachmentPreview.classList.remove('hidden');
    
    // Enable the input so user can type their question
    document.getElementById('userMessage').disabled = false;
    document.getElementById('sendBtn').disabled = false;
    
    // Clear the input so the same file can be re-selected if needed
    fileInput.value = '';
});

// Remove attachment
removeAttachment.addEventListener('click', () => {
    attachedFile = null;
    attachmentPreview.classList.add('hidden');
    attachedFileName.textContent = '';
    // Input stays enabled - user can still chat without VIN
});

// Modify sendMessage to handle file + prompt
const originalSendMessage = sendMessage;
sendMessage = async function() {
    const userInput = document.getElementById('userMessage');
    const message = userInput.value.trim();
    
    // If there's an attached file, process it with the prompt
    if (attachedFile) {
        // Show user's message with file indicator
        const displayMsg = message ? `📄 ${attachedFile.name}: "${message}"` : `📄 Analyzing: ${attachedFile.name}`;
        addMessage(displayMsg, true, true);
        
        // Show loading
        const loadingId = 'loading-' + Date.now();
        const typingIndicator = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        addMessage(typingIndicator, false, true);
        const loadingMsg = chatHistory.lastElementChild;
        loadingMsg.id = loadingId;
        
        // Clear input and attachment
        userInput.value = '';
        const fileToSend = attachedFile;
        attachedFile = null;
        attachmentPreview.classList.add('hidden');
        
        // Send file + prompt to backend
        const formData = new FormData();
        formData.append('file', fileToSend);
        if (message) {
            formData.append('prompt', message);
        }
        
        try {
            console.log('📤 Sending file to backend:', fileToSend.name, fileToSend.size, 'bytes');
            console.log('📝 User prompt:', message || '(none)');
            
            const response = await fetch(`${API_BASE}/api/document/analyze`, {
                method: 'POST',
                body: formData
            });
            console.log('📥 Response status:', response.status);
            const data = await response.json();
            console.log('📥 Response data:', data);
            
            // Remove loading
            const msgToRemove = document.getElementById(loadingId);
            if (msgToRemove) msgToRemove.remove();
            
            if (data.success) {
                // Check if it's a conversation response or structured analysis
                if (data.is_conversation) {
                    addMessage(data.response, false, false);
                } else if (data.analysis) {
                    // Format structured analysis
                    const analysis = data.analysis;
                    let output = `<strong>📄 ${analysis.document_type || 'Document Analysis'}</strong><br><br>`;
                    
                    if (analysis.financials) {
                        const f = analysis.financials;
                        if (f.price) output += `💰 <strong>Price:</strong> $${f.price.toLocaleString()}<br>`;
                        if (f.doc_fee) output += `📝 <strong>Doc Fee:</strong> $${f.doc_fee}<br>`;
                        if (f.add_ons_total) output += `➕ <strong>Add-ons:</strong> $${f.add_ons_total}<br>`;
                    }
                    
                    if (analysis.insights && analysis.insights.length) {
                        output += `<br><strong>🔍 Insights:</strong><br><ul>`;
                        analysis.insights.forEach(i => output += `<li>${i}</li>`);
                        output += '</ul>';
                    }
                    
                    if (analysis.summary) {
                        output += `<br><em>${analysis.summary}</em>`;
                    }
                    
                    addMessage(output, false, true);
                    
                    // Auto-fill VIN if found
                    if (analysis.vehicle && analysis.vehicle.vin && !currentVIN) {
                        addMessage(`💡 Found VIN: <strong>${analysis.vehicle.vin}</strong>. Click Analyze VIN to get full valuation!`, false, true);
                        vinInput.value = analysis.vehicle.vin;
                    }
                }
            } else {
                addMessage(`❌ Error: ${data.error || 'Unknown error'}`, false, false);
            }
        } catch (err) {
            console.error('Document analysis error:', err);
            const msgToRemove = document.getElementById(loadingId);
            if (msgToRemove) msgToRemove.remove();
            addMessage("❌ Failed to analyze document. Please try again.", false, false);
        }
        
        return;
    }
    
    // No file attached - use original send logic
    if (!message) return;
    await originalSendMessage();
};


