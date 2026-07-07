import { useState, useRef, useEffect } from "react";

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL;
console.log("AI URL:", import.meta.env.VITE_AI_SERVICE_URL);

const GREETING = {
  role: "assistant",
  content: "Hi! I'm StayLink Assistant 👋\n\nTell me what kind of property you're looking for — location, type, budget, or any preferences!"
};

// Storage key — per user so different logins don't share history
function getStorageKey() {
  try {
    const raw = localStorage.getItem("authTokens") || localStorage.getItem("token");
    if (raw) {
      // parse JWT payload to get user id
      const token = raw.includes("{") ? JSON.parse(raw)?.access : raw;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return `staylink_ai_chat_${payload.user_id}`;
    }
  } catch {}
  return "staylink_ai_chat_guest";
}

function loadHistory() {
  try {
    const key = getStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Always start with greeting, then saved history
      return [GREETING, ...parsed.filter(m => m.role !== "assistant" || m.content !== GREETING.content)];
    }
  } catch {}
  return [GREETING];
}

function saveHistory(messages) {
  try {
    const key = getStorageKey();
    // Don't save the greeting itself — it's always added on load
    const toSave = messages.slice(1);
    localStorage.setItem(key, JSON.stringify(toSave));
  } catch {}
}

export default function AIChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState(loadHistory);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 1) {
      saveHistory(messages);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    const updatedMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // slice(1) removes greeting, slice(-10) keeps last 10 real turns
      const historyToSend = updatedMessages
        .slice(1)
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch(`${AI_SERVICE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          chat_history: historyToSend
        })
      });

      if (!response.ok) throw new Error("AI service error");

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);

    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Clear chat history for this user
  const clearHistory = () => {
    try { localStorage.removeItem(getStorageKey()); } catch {}
    setMessages([GREETING]);
  };

  const handleClose = () => {
    setInput("");
    onClose();
    // Don't reset messages on close — they persist now
  };

  if (!isOpen) return null;

  return (
    <>
      <div onClick={handleClose} style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.4)", zIndex: 998
      }} />

      <div style={{
        position: "fixed", bottom: "90px", right: "24px",
        width: "380px", height: "550px", background: "white",
        borderRadius: "16px", boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
        display: "flex", flexDirection: "column", zIndex: 999, overflow: "hidden"
      }}>

        {/* Header */}
        <div style={{
          background: "#FF385C", color: "white",
          padding: "14px 16px", display: "flex",
          alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>🏠</span>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "15px" }}>StayLink Assistant</div>
              <div style={{ fontSize: "11px", opacity: 0.85 }}>AI-powered property search</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {/* Clear history button */}
            <button onClick={clearHistory} title="Clear chat history" style={{
              background: "rgba(255,255,255,0.2)", border: "none", color: "white",
              borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer",
              fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center"
            }}>🗑</button>
            <button onClick={handleClose} style={{
              background: "rgba(255,255,255,0.2)", border: "none", color: "white",
              borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer",
              fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center"
            }}>✕</button>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "14px",
          background: "#f9f9f9", display: "flex",
          flexDirection: "column", gap: "10px"
        }}>
          {messages.map((msg, index) => (
            <div key={index} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
            }}>
              <div style={{
                maxWidth: "80%", padding: "9px 13px",
                borderRadius: msg.role === "user"
                  ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: msg.role === "user" ? "#FF385C" : "white",
                color: msg.role === "user" ? "white" : "#333",
                fontSize: "13px", lineHeight: "1.5",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                whiteSpace: "pre-wrap"
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{
                padding: "9px 13px", background: "white",
                borderRadius: "16px 16px 16px 4px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                color: "#999", fontSize: "13px"
              }}>Thinking... ✨</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: "10px 12px", background: "white",
          borderTop: "1px solid #eee", display: "flex",
          gap: "8px", alignItems: "center"
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about properties..."
            disabled={loading}
            style={{
              flex: 1, padding: "9px 13px", borderRadius: "20px",
              border: "1px solid #e0e0e0", outline: "none",
              fontSize: "13px", background: loading ? "#f5f5f5" : "white"
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: "9px 16px",
              background: loading || !input.trim() ? "#ccc" : "#FF385C",
              color: "white", border: "none", borderRadius: "20px",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              fontSize: "13px", fontWeight: "bold"
            }}
          >Send</button>
        </div>
      </div>
    </>
  );
}