import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyConversations } from "../../services/chatService";

const OwnerPropertyConversations = () => {

  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, [propertyId]);

  const loadConversations = async () => {
    try {
      setLoading(true);

      const res = await getPropertyConversations(propertyId);

      setConversations(res.data || []);

    } catch (error) {
      console.log("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const openChat = (conversationId) => {
    navigate(`/chat/conversation/${conversationId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        Property Conversations
      </h1>

      {/* EMPTY STATE */}
      {conversations.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No messages yet for this property
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">

        {conversations.map((conv) => (

          <div
            key={conv.conversation_id}
            onClick={() => openChat(conv.conversation_id)}
            className="border rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition"
          >

            {/* TOP ROW */}
            <div className="flex justify-between items-center">

              <h2 className="font-semibold text-gray-800">
                {conv.traveler_name}
              </h2>

              <span className="text-xs text-gray-400">
                {conv.updated_at}
              </span>

            </div>

            {/* LAST MESSAGE */}
            <p className="text-sm text-gray-500 mt-2 truncate">
              {conv.last_message || "No messages yet"}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
};

export default OwnerPropertyConversations;