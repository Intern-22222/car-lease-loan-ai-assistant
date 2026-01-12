// Suggested questions + auto replies for each dealer
const dealerSuggestions = {
  "thread-1": [
    {
      id: "a-q1",
      question: "What are the lease terms for this offer?",
      answer:
        "For this vehicle, the lease is 36 months, 10k miles per year, at $350 per month with standard fees."
    },
    {
      id: "a-q2",
      question: "Can I reduce the monthly payment with a higher down payment?",
      answer:
        "Yes. If you put $2,000 down, we can bring the monthly payment close to $330, depending on credit approval."
    },
    {
      id: "a-q3",
      question: "Are there any hidden fees I should know about?",
      answer:
        "Besides the monthly payment, there is a documentation fee, registration, and a disposition fee at the end of the lease."
    },
    {
      id: "a-q4",
      question: "Is maintenance included in this lease?",
      answer:
        "Regular maintenance is not included by default, but we can add a maintenance package for a small additional monthly fee."
    }
  ],
  "thread-2": [
    {
      id: "b-q1",
      question: "Can you match the price from another dealer?",
      answer:
        "If you share the exact quote, we will do our best to match or beat their monthly payment and terms."
    },
    {
      id: "b-q2",
      question: "What mileage options do you offer?",
      answer:
        "We typically offer 10k, 12k, and 15k miles per year. The monthly payment increases slightly as mileage goes up."
    },
    {
      id: "b-q3",
      question: "Can you explain the excess mileage charges?",
      answer:
        "Extra miles are usually charged between 15–25 cents per mile, depending on the specific model and lease program."
    },
    {
      id: "b-q4",
      question: "Do you offer any loyalty or college grad discounts?",
      answer:
        "Yes, we have loyalty and college graduate rebates that can lower your due-at-signing or monthly payment if you qualify."
    }
  ]
};

// Initial threads with greeting (no timestamps)
const threads = [
  {
    id: "thread-1",
    title: "Dealer A - Lease Questions",
    lastUpdated: "",
    messages: [
      {
        id: "a-m0",
        sender: "dealer",
        text: "Hi, how can I help you with the following questions? Please pick one or type your question."
      }
    ]
  },
  {
    id: "thread-2",
    title: "Dealer B - Offer Comparison",
    lastUpdated: "",
    messages: [
      {
        id: "b-m0",
        sender: "dealer",
        text: "Hi, I can help you compare our offer with other dealers. Select a question or type your own."
      }
    ]
  }
];

let activeThreadId = null;

// DOM elements
const appShellEl = document.querySelector(".app-shell");
const toggleAllBtn = document.getElementById("toggleAll");

const threadListEl = document.getElementById("threadList");
const chatSubTitleEl = document.getElementById("chatSubTitle");
const chatMessagesEl = document.getElementById("chatMessages");
const messageInputEl = document.getElementById("messageInput");
const sendButtonEl = document.getElementById("sendButton");

// Render thread list in sidebar
function renderThreadList() {
  threadListEl.innerHTML = "";
  threads.forEach((thread) => {
    const li = document.createElement("li");
    li.className =
      "thread-item" + (thread.id === activeThreadId ? " active" : "");
    li.dataset.threadId = thread.id;
    li.innerHTML = `
      <div class="thread-title">${thread.title}</div>
    `;
    li.addEventListener("click", () => {
      setActiveThread(thread.id);
    });
    threadListEl.appendChild(li);
  });
}

// Activate a thread and render messages
function setActiveThread(threadId) {
  activeThreadId = threadId;
  const thread = threads.find((t) => t.id === threadId);
  if (!thread) return;

  chatSubTitleEl.textContent = thread.title;
  messageInputEl.disabled = false;
  sendButtonEl.disabled = false;

  renderThreadList();
  renderMessages(thread);
}

// Render messages and dealer suggestions for the active thread
function renderMessages(thread) {
  chatMessagesEl.innerHTML = "";

  thread.messages.forEach((msg) => {
    const row = document.createElement("div");
    row.className = `message-row ${msg.sender}`;

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = msg.text;

    row.appendChild(bubble);
    chatMessagesEl.appendChild(row);
  });

  const suggestions = dealerSuggestions[thread.id];
  if (suggestions && suggestions.length > 0) {
    const suggestionRow = document.createElement("div");
    suggestionRow.className = "message-row dealer";

    const suggestionBubble = document.createElement("div");
    suggestionBubble.className = "message-bubble";
    suggestionBubble.style.background = "#e0f2fe";
    suggestionBubble.style.color = "#0f172a";

    const label = document.createElement("div");
    label.style.fontSize = "13px";
    label.style.marginBottom = "6px";
    label.textContent = "Tap a question or type it below:";

    suggestionBubble.appendChild(label);

    suggestions.forEach((item) => {
      const btn = document.createElement("button");
      btn.className = "suggestion-btn";
      btn.textContent = item.question;
      // 1) Click = directly send question + auto reply
      btn.addEventListener("click", () => {
        activeThreadId = thread.id;
        sendQuestionAndAnswer(thread.id, item.question);
      });
      suggestionBubble.appendChild(btn);
    });

    suggestionRow.appendChild(suggestionBubble);
    chatMessagesEl.appendChild(suggestionRow);
  }

  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

// Helper: send question + auto‑reply if it matches suggestions
function sendQuestionAndAnswer(threadId, questionText) {
  const thread = threads.find((t) => t.id === threadId);
  if (!thread) return;

  // Add user message
  thread.messages.push({
    id: `u-${Date.now()}`,
    sender: "user",
    text: questionText
  });

  // Find matching suggestion (case‑insensitive, trim spaces)
  const suggestions = dealerSuggestions[threadId] || [];
  const match = suggestions.find(
    (s) => s.question.trim().toLowerCase() === questionText.trim().toLowerCase()
  );

  // If matched, add dealer answer
  if (match) {
    thread.messages.push({
      id: `d-${Date.now() + 1}`,
      sender: "dealer",
      text: match.answer
    });
  }

  renderThreadList();
  if (activeThreadId === threadId) {
    renderMessages(thread);
  }
}

// Send message from input (can be suggestion text or custom)
function sendMessage() {
  const text = messageInputEl.value.trim();
  if (!text || !activeThreadId) return;

  // Use unified helper so typed text also gets auto‑reply if it matches
  sendQuestionAndAnswer(activeThreadId, text);

  // Clear box
  messageInputEl.value = "";
}

// Wire up send actions
sendButtonEl.addEventListener("click", sendMessage);
messageInputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Minimize / maximize entire window (threads + chat)
toggleAllBtn.addEventListener("click", () => {
  const minimized = appShellEl.classList.toggle("minimized");
  toggleAllBtn.textContent = minimized ? "+" : "─";
  toggleAllBtn.setAttribute(
    "aria-label",
    minimized ? "Maximize window" : "Minimize window"
  );
});

// Initial render
renderThreadList();
setActiveThread("thread-1");
