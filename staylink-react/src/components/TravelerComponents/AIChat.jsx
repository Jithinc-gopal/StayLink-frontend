// src/components/TravelerComponents/AIChat.jsx
import { useState, useRef, useEffect } from "react";

const AI_SERVICE_URL = "http://localhost:8001";

export default function AIChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm StayLink Assistant 👋\n\nTell me what kind of property you're looking for — location, type, budget, or any preferences!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    const updatedMessages = [
      ...messages,
      { role: "user", content: userMessage }
    ];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch(`${AI_SERVICE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          chat_history: updatedMessages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) throw new Error("AI service error");

      const data = await response.json();
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.reply }
      ]);

    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again."
        }
      ]);
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

  // If not open, don't render
  if (!isOpen) return null;

  return (
    <>
      {/* Dark overlay behind chat */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 998
        }}
      />

      {/* Chat window */}
      <div style={{
        position: "fixed",
        bottom: "90px",
        right: "24px",
        width: "380px",
        height: "550px",
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        zIndex: 999,
        overflow: "hidden"
      }}>

        {/* Header */}
        <div style={{
          background: "#FF385C",
          color: "white",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>🏠</span>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "15px" }}>
                StayLink Assistant
              </div>
              <div style={{ fontSize: "11px", opacity: 0.85 }}>
                AI-powered property search
              </div>
            </div>
          </div>
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px",
          background: "#f9f9f9",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: msg.role === "user"
                  ? "flex-end"
                  : "flex-start"
              }}
            >
              <div style={{
                maxWidth: "80%",
                padding: "9px 13px",
                borderRadius: msg.role === "user"
                  ? "16px 16px 4px 16px"
                  : "16px 16px 16px 4px",
                background: msg.role === "user"
                  ? "#FF385C"
                  : "white",
                color: msg.role === "user" ? "white" : "#333",
                fontSize: "13px",
                lineHeight: "1.5",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                whiteSpace: "pre-wrap"
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{
                padding: "9px 13px",
                background: "white",
                borderRadius: "16px 16px 16px 4px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                color: "#999",
                fontSize: "13px"
              }}>
                Thinking... ✨
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: "10px 12px",
          background: "white",
          borderTop: "1px solid #eee",
          display: "flex",
          gap: "8px",
          alignItems: "center"
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about properties..."
            disabled={loading}
            style={{
              flex: 1,
              padding: "9px 13px",
              borderRadius: "20px",
              border: "1px solid #e0e0e0",
              outline: "none",
              fontSize: "13px",
              background: loading ? "#f5f5f5" : "white"
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: "9px 16px",
              background: loading || !input.trim()
                ? "#ccc"
                : "#FF385C",
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: loading || !input.trim()
                ? "not-allowed"
                : "pointer",
              fontSize: "13px",
              fontWeight: "bold"
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}