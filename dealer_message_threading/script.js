let chatData = {};
let currentThread = "";

/* Load data */
if (localStorage.getItem("chatData")) {
  chatData = JSON.parse(localStorage.getItem("chatData"));
  loadThreads();
} else {
  fetch("messages.json")
    .then(res => res.json())
    .then(data => {
      chatData = data;
      saveToLocalStorage();
      loadThreads();
    });
}

/* Save to browser */
function saveToLocalStorage() {
  localStorage.setItem("chatData", JSON.stringify(chatData));
}

/* Load conversation list */
function loadThreads() {
  const list = document.getElementById("threadList");
  list.innerHTML = "";

  for (let id in chatData) {
    const li = document.createElement("li");
    li.innerText = id;
    li.onclick = () => openThread(id);
    list.appendChild(li);
  }
}

/* Open chat */
function openThread(id) {
  currentThread = id;
  document.getElementById("chatTitle").innerText = "Contract: " + id;
  renderMessages();
}

/* Render messages */
function renderMessages() {
  const msgDiv = document.getElementById("messages");
  msgDiv.innerHTML = "";

  chatData[currentThread].messages.forEach(m => {
    const div = document.createElement("div");
    div.className = "message " + m.sender;
    div.innerText = m.text;
    msgDiv.appendChild(div);
  });

  msgDiv.scrollTop = msgDiv.scrollHeight;
}

/* Send message */
function sendMessage() {
  const input = document.getElementById("newMessage");
  if (!input.value || !currentThread) return;

  // Customer message
  chatData[currentThread].messages.push({
    sender: "customer",
    text: input.value
  });

  saveToLocalStorage();
  renderMessages();

  const customerText = input.value;
  input.value = "";

  // Auto dealer reply
  setTimeout(() => {
    chatData[currentThread].messages.push({
      sender: "dealer",
      text: getDealerReply(customerText)
    });

    saveToLocalStorage();
    renderMessages();
  }, 1000);
}

/* Dealer reply logic */
function getDealerReply(text) {
  text = text.toLowerCase();

  if (text.includes("price") || text.includes("cost")) {
    return "Lease plans start from ₹15,000 per month.";
  }
  if (text.includes("tenure") || text.includes("months")) {
    return "Lease tenure ranges from 24 to 60 months.";
  }
  if (text.includes("down")) {
    return "Down payment starts at 10% of vehicle value.";
  }

  return "Thank you! Our executive will assist you shortly.";
}
