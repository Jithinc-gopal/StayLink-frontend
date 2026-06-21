// src/components/LandingpageComponents/AIChatButton.jsx
import { useState } from "react";
import AIChat from "../TravelerComponents/AIChat";

export default function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button — visible on all traveler pages */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          background: "#FF385C",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          boxShadow: "0 4px 16px rgba(255,56,92,0.4)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s",
        }}
        title="Ask AI Assistant"
      >
        {isOpen ? "✕" : "🤖"}
      </button>

      {/* AI Chat window — shows when button clicked */}
      <AIChat
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}