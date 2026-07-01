import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getConversation } from "../../services/chatService";
import { WS_BASE_URL } from "../../services/api";

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("access");

  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const [connected, setConnected] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    loadConversation();
    connectWebSocket();

    return () => {
      if (
        socketRef.current?.readyState === WebSocket.OPEN ||
        socketRef.current?.readyState === WebSocket.CONNECTING
      ) {
        socketRef.current.close();
      }

      socketRef.current = null;
      clearTimeout(typingTimeoutRef.current);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typingUser]);

  // ==========================
  // LOAD CONVERSATION
  // ==========================
  const loadConversation = async () => {
    try {
      setLoading(true);

      const data = await getConversation(conversationId);

      setConversation(data);

      setMessages(data.messages || []);
    } catch (error) {
  console.error(
    "Conversation load error:",
    error.response?.data || error
  );

  alert(
    error.response?.data?.error ||
      "Unable to load conversation"
  );

  navigate(-1);
} finally {
  setLoading(false);
}
  };

// ==========================
// WEBSOCKET
// ==========================
const connectWebSocket = () => {
  const socket = new WebSocket(
    `${WS_BASE_URL}/ws/chat/conversation/${conversationId}/?token=${token}`
  );

  socketRef.current = socket;

  socket.onopen = () => {
    setConnected(true);
  };

  socket.onclose = () => {
    setConnected(false);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
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

    if (data.type === "typing") {
      setTypingUser(data.sender_name);
    }

    if (data.type === "stop_typing") {
      setTypingUser(null);
    }
  };
};

  // ==========================
  // SEND MESSAGE
  // ==========================
  const sendMessage = () => {
    if (!input.trim()) return;

    if (
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN
    ) {
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

  // ==========================
  // TYPING
  // ==========================
  const handleTyping = (e) => {
    setInput(e.target.value);

    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      socketRef.current.send(
        JSON.stringify({
          type: "typing",
        })
      );
    }

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1500);
  };

  const stopTyping = () => {
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      socketRef.current.send(
        JSON.stringify({
          type: "stop_typing",
        })
      );
    }

    clearTimeout(typingTimeoutRef.current);
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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">
                {conversation?.property_title}
              </h2>
              <div className="flex items-center space-x-2 mt-0.5">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                <p className="text-xs text-gray-400">
                  {connected ? "Connected" : "Disconnected"}
                </p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-gray-700 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white px-6 py-6 space-y-4">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-400 font-medium">No messages yet</p>
                <p className="text-gray-300 text-sm mt-1">Start the conversation!</p>
              </div>
            )}

            {messages.map((msg, index) => {
              const isMe = Number(msg.sender_id) === Number(user?.id);
              const showSender = !isMe && (index === 0 || messages[index - 1]?.sender_id !== msg.sender_id);

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div className={`max-w-sm lg:max-w-md ${!isMe && showSender ? 'mt-2' : ''}`}>
                    {!isMe && showSender && (
                      <p className="text-xs font-medium text-gray-500 mb-1 ml-2">
                        {msg.sender_name}
                      </p>
                    )}
                    
                    <div className="flex items-end space-x-2">
                      {!isMe && (
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-white text-xs font-semibold">
                            {msg.sender_name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      <div
                        className={`relative px-4 py-2.5 rounded-2xl text-sm shadow-sm transition-all duration-200 ${
                          isMe
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
                            : "bg-white border border-gray-200 text-gray-800 rounded-bl-none hover:border-gray-300"
                        }`}
                      >
                        {msg.content}
                        <div className={`absolute bottom-0 ${isMe ? '-right-1' : '-left-1'} w-2 h-2 ${isMe ? 'bg-blue-700' : 'bg-white border-r border-b border-gray-200'} transform rotate-45`} />
                      </div>
                    </div>
                    
                    <p className={`text-xs text-gray-400 mt-1 ${isMe ? 'text-right mr-2' : 'ml-8'}`}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}

            {typingUser && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2.5 shadow-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{typingUser} is typing...</p>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* INPUT */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={handleTyping}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  rows="1"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none overflow-y-auto text-sm"
                  style={{ maxHeight: '120px' }}
                />
                <div className="absolute right-3 bottom-2.5 text-xs text-gray-400">
                  ↵
                </div>
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!connected || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Send</span>
              </button>
            </div>
            
            {!connected && (
              <p className="text-xs text-red-500 mt-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Disconnected. Trying to reconnect...
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-bounce {
          animation: bounce 1.4s infinite;
        }
        
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatPage;