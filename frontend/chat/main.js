// Sample data model: threads and messages
const threads = [
  {
    id: "thread-1",
    title: "Dealer A - New Lease Offer",
    lastUpdated: "2026-01-09 10:15",
    messages: [
      {
        id: "m1",
        sender: "user",
        text: "Hi, can you share the lease offer details?",
        timestamp: "2026-01-09 09:30"
      },
      {
        id: "m2",
        sender: "dealer",
        text: "Sure, 36 months, 10k miles/year, $350 per month.",
        timestamp: "2026-01-09 09:32"
      }
    ]
  },
  {
    id: "thread-2",
    title: "Dealer B - Counter Offer",
    lastUpdated: "2026-01-08 17:05",
    messages: [
      {
        id: "m1",
        sender: "user",
        text: "Can you match $320/month if I increase the down payment?",
        timestamp: "2026-01-08 16:55"
      },
      {
        id: "m2",
        sender: "dealer",
        text: "We can do $330/month with a slightly higher down payment.",
        timestamp: "2026-01-08 17:05"
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
      <div class="thread-meta">Last updated: ${thread.lastUpdated}</div>
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

// Render messages for a thread
function renderMessages(thread) {
  chatMessagesEl.innerHTML = "";
  thread.messages.forEach((msg) => {
    const row = document.createElement("div");
    row.className = `message-row ${msg.sender}`;

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = msg.text;

    const time = document.createElement("div");
    time.className = "message-time";
    time.textContent = msg.timestamp;

    bubble.appendChild(time);
    row.appendChild(bubble);
    chatMessagesEl.appendChild(row);
  });

  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

// Send a new user message
function sendMessage() {
  const text = messageInputEl.value.trim();
  if (!text || !activeThreadId) return;

  const thread = threads.find((t) => t.id === activeThreadId);
  if (!thread) return;

  const now = new Date();
  const timestamp = now.toISOString().slice(0, 16).replace("T", " ");

  const newMessage = {
    id: `m-${Date.now()}`,
    sender: "user",
    text,
    timestamp
  };

  thread.messages.push(newMessage);
  thread.lastUpdated = timestamp;

  messageInputEl.value = "";
  renderThreadList();
  renderMessages(thread);
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
