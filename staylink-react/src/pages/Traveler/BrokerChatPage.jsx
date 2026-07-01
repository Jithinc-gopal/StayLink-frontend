import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getBrokerConversation,
  getBrokerConversationHistory,
} from "../../services/chatService";

import { WS_BASE_URL } from "../../services/api";

const BrokerChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("access");

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimerRef = useRef(null);

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    loadChat();
    connectSocket();

    return () => {
      if (
        socketRef.current?.readyState === WebSocket.OPEN ||
        socketRef.current?.readyState === WebSocket.CONNECTING
      ) {
        socketRef.current.close();
      }

      clearTimeout(typingTimerRef.current);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  const loadChat = async () => {
    try {
      setLoading(true);
      setPageError("");

      const conversationData = await getBrokerConversation(conversationId);
      const historyData = await getBrokerConversationHistory(conversationId);

      setConversation(conversationData);
      setMessages(historyData.messages || []);
    } catch (error) {
      console.error("Broker chat load error:", error.response?.data || error);
      setPageError(
        error.response?.data?.error ||
          "Unable to load broker chat. Check backend API."
      );
    } finally {
      setLoading(false);
    }
  };

  const connectSocket = () => {
    const socket = new WebSocket(
      `${WS_BASE_URL}/ws/chat/broker/${conversationId}/?token=${token}`
    );
    socketRef.current = socket;

    socket.onopen = () => setConnected(true);

    socket.onclose = (event) => {
      console.log("Broker WebSocket closed:", event);
      setConnected(false);
    };

    socket.onerror = (error) => {
      console.error("Broker WebSocket error:", error);
      setConnected(false);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat_message") {
        setMessages((prev) => [
          ...prev,
          {
            id: data.message_id,
            sender_id: data.sender_id,
            sender_name: data.sender_name,
            content: data.content,
            created_at: data.created_at,
          },
        ]);
        setTypingUser(null);
      }

      if (data.type === "typing") setTypingUser(data.sender_name);
      if (data.type === "stop_typing") setTypingUser(null);
    };
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      alert("Chat not connected");
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        type: "chat_message",
        content: input.trim(),
      })
    );

    setInput("");
    stopTyping();
  };

  const handleTyping = (e) => {
    setInput(e.target.value);

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "typing" }));
    }

    clearTimeout(typingTimerRef.current);

    typingTimerRef.current = setTimeout(() => {
      stopTyping();
    }, 1500);
  };

  const stopTyping = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "stop_typing" }));
    }

    clearTimeout(typingTimerRef.current);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading broker chat...</p>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-md text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Broker Chat Error</h2>
          <p className="mt-3 text-sm text-slate-500">{pageError}</p>

          <button
            onClick={loadChat}
            className="mt-6 px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">Broker Chat</h2>
            <p className="text-xs text-slate-300">
              {conversation?.broker_name || "Broker"} ↔{" "}
              {conversation?.user_name || "User"}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                connected ? "bg-green-400" : "bg-red-400"
              }`}
            />
            {connected ? "Connected" : "Disconnected"}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-slate-50">
          {messages.length === 0 && (
            <p className="text-center text-slate-400 mt-10">
              No messages yet. Start the conversation.
            </p>
          )}

          {messages.map((msg) => {
            const isMe = Number(msg.sender_id) === Number(user?.id);

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-md">
                  {!isMe && (
                    <p className="text-xs text-slate-400 mb-1">
                      {msg.sender_name}
                    </p>
                  )}

                  <div
                    className={`px-4 py-2 rounded-2xl text-sm ${
                      isMe
                        ? "bg-slate-900 text-white rounded-br-none"
                        : "bg-white border text-slate-800 rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1">
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })}

          {typingUser && (
            <p className="text-xs text-slate-400 italic">
              {typingUser} is typing...
            </p>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="border-t bg-white p-4 flex gap-3">
          <textarea
            value={input}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
          />

          <button
            onClick={sendMessage}
            disabled={!connected || !input.trim()}
            className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-semibold disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrokerChatPage;