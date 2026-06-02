import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChatHistory } from "../../services/chatService";

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("access");

  // ================= STATE =================
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  // ================= REFS =================
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ================= AUTH + INIT =================
  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    loadHistory();
    connectWebSocket();

    return () => {
      socketRef.current?.close();
      clearTimeout(typingTimeoutRef.current);
    };
  }, [conversationId]);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  // ================= LOAD HISTORY =================
  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await getChatHistory(conversationId);
      setMessages(res.data?.messages || []);
    } catch (err) {
      console.error("History error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= WEBSOCKET =================
  const connectWebSocket = () => {
    const wsUrl = `ws://localhost:8000/ws/chat/conversation/${conversationId}/?token=${token}`;

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);

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

      if (data.type === "typing") {
        setTypingUser(data.sender_name);
      }

      if (data.type === "stop_typing") {
        setTypingUser(null);
      }
    };
  };

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        type: "chat_message",
        content: input.trim(),
      })
    );

    setInput("");
    stopTyping();
  };

  // ================= TYPING =================
  const handleTyping = (e) => {
    setInput(e.target.value);

    socketRef.current?.send(JSON.stringify({ type: "typing" }));

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1500);
  };

  const stopTyping = () => {
    socketRef.current?.send(JSON.stringify({ type: "stop_typing" }));
    clearTimeout(typingTimeoutRef.current);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading chat...</p>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="max-w-3xl mx-auto h-screen flex flex-col p-4">

      {/* HEADER */}
      <div className="border rounded-t-2xl px-6 py-4 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-xl font-bold">Conversation</h2>
          <p className="text-sm text-gray-500">
            {connected ? "Online" : "Offline"}
          </p>
        </div>

        <div
          className={`w-3 h-3 rounded-full ${
            connected ? "bg-green-500" : "bg-red-400"
          }`}
        />
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-4 space-y-3">

        {messages.length === 0 && (
          <p className="text-center text-gray-400">
            No messages yet
          </p>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-xs`}>
                {!isMe && (
                  <p className="text-xs text-gray-400 mb-1">
                    {msg.sender_name}
                  </p>
                )}

                <div
                  className={`px-4 py-2 rounded-2xl text-sm ${
                    isMe
                      ? "bg-black text-white"
                      : "bg-white border"
                  }`}
                >
                  {msg.content}
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  {formatTime(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}

        {/* typing */}
        {typingUser && (
          <p className="text-sm text-gray-400 italic">
            {typingUser} is typing...
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="border rounded-b-2xl p-3 flex gap-2 bg-white">
        <input
          value={input}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          placeholder="Type message..."
          className="flex-1 border rounded-xl px-4 py-2 text-sm"
        />

        <button
          onClick={sendMessage}
          disabled={!input.trim() || !connected}
          className="bg-black text-white px-5 py-2 rounded-xl disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;