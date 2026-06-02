import API from "./api";

// =========================================
// START A NEW CONVERSATION
// =========================================
// POST /api/chat/conversations/
// Called when Owner ↔ Traveler begin chatting
// Returns the created conversation object
// =========================================
export const startConversation = async (ownerId, travelerId) => {
  const response = await API.post("/api/chat/conversations/", {
    owner: ownerId,
    traveler: travelerId,
  });
  return response.data;
};

// =========================================
// GET A SINGLE CONVERSATION
// =========================================
// GET /api/chat/conversations/:id/
// Called when opening a specific chat room
// Returns conversation details + participants
// =========================================
export const getConversation = async (conversationId) => {
  const response = await API.get(`/api/chat/conversations/${conversationId}/`);
  return response.data;
};

// =========================================
// GET ALL CONVERSATIONS FOR A PROPERTY
// =========================================
// GET /api/chat/property/:id/conversations/
// Called when viewing a property’s chat rooms
// Returns list of conversations tied to property
// =========================================
export const getPropertyConversations = async (propertyId) => {
  const response = await API.get(
    `/api/chat/property/${propertyId}/conversations/`
  );
  return response.data;
};

// =========================================
// GET CHAT HISTORY (Conversation-based)
// =========================================
// GET /api/chat/conversation/:id/history/
// Called once when chat page loads
// Returns all past messages for that conversation
// =========================================
export const getChatHistory = async (conversationId) => {
  const response = await API.get(
    `/api/chat/conversation/${conversationId}/history/`
  );
  return response.data;
};

// =========================================
// GET OWNER’S CHAT ROOMS
// =========================================
// GET /api/chat/owner/conversations/
// Called to list all conversations for Owner
// =========================================
export const getOwnerChatRooms = async () => {
  const response = await API.get("/api/chat/owner/conversations/");
  return response.data;
};
