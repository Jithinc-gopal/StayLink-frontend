import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BrokerLayout from "../../components/BrokerComponents/BrokerLayout";
import { getBrokerConversations } from "../../services/chatService";
import { MessageCircle, RefreshCw } from "lucide-react";

export default function BrokerChatInbox() {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getBrokerConversations();
      setConversations(data || []);
    } catch (error) {
      console.error("Broker conversations error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <BrokerLayout>
      <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Broker Chats
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View and reply to traveler messages.
            </p>
          </div>

          <button
            onClick={loadConversations}
            className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading chats...</p>
        ) : conversations.length === 0 ? (
          <div className="bg-white rounded-2xl border p-10 text-center">
            <MessageCircle className="mx-auto text-slate-400" size={40} />
            <h2 className="mt-4 font-bold text-slate-900">
              No chats yet
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Traveler messages will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <div
                key={conv.conversation_id}
                onClick={() =>
                  navigate(`/broker/chat/${conv.conversation_id}`)
                }
                className="cursor-pointer rounded-2xl border bg-white p-5 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      {conv.user_name}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {conv.user_email}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {conv.last_message || "No messages yet"}
                    </p>
                  </div>

                  <MessageCircle className="text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BrokerLayout>
  );
}