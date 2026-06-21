import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyConversations } from "../../services/chatService";
import { 
  MessageCircle, 
  ArrowLeft, 
  Clock, 
  ChevronRight,
  Home,
  Inbox
} from "lucide-react";

const OwnerPropertyConversations = () => {

  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propertyTitle, setPropertyTitle] = useState("");

  useEffect(() => {
    loadConversations();
  }, [propertyId]);

  const loadConversations = async () => {
    try {
      setLoading(true);

      const data = await getPropertyConversations(propertyId);

      console.log("Conversations API:", data);

      setConversations(data || []);
      
      if (data && data.length > 0 && data[0].property_title) {
        setPropertyTitle(data[0].property_title);
      }

    } catch (error) {
      console.log("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const openChat = (conversationId) => {
    navigate(`/chat/${conversationId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-gray-900"></div>
          <p className="mt-4 text-gray-500 text-sm">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Conversations
              </h1>
              {propertyTitle && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Home size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-500">{propertyTitle}</span>
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              {conversations.length} {conversations.length === 1 ? 'chat' : 'chats'}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {conversations.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox size={20} className="text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">
              No conversations yet
            </h3>
            <p className="text-sm text-gray-500">
              Messages from travelers will appear here
            </p>
          </div>
        )}

        {/* Conversations List */}
        {conversations.length > 0 && (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.conversation_id}
                onClick={() => openChat(conv.conversation_id)}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  {/* Left side */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">
                          {conv.traveler_name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h2 className="text-sm font-medium text-gray-900 truncate">
                            {conv.traveler_name}
                          </h2>
                          <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                            {formatDate(conv.updated_at)}
                          </span>
                        </div>
                        
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {conv.last_message || "No messages yet"}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <MessageCircle size={10} />
                            {conv.message_count || 0}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={10} />
                            {formatDate(conv.updated_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side */}
                  <div className="flex items-center ml-3">
                    {conv.unread_count > 0 && (
                      <span className="bg-gray-900 text-white text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[20px] text-center mr-2">
                        {conv.unread_count}
                      </span>
                    )}
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerPropertyConversations;