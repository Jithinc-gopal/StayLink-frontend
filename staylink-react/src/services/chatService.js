import API from "./api";

/* OWNER ↔ TRAVELER CHAT */

export const startConversation = async (propertyId) => {
  const response = await API.post("/api/chat/start/", {
    property_id: propertyId,
  });
  return response.data;
};

export const getConversation = async (conversationId) => {
  const response = await API.get(
    `/api/chat/conversation/${conversationId}/`
  );
  return response.data;
};

export const getPropertyConversations = async (propertyId) => {
  const response = await API.get(
    `/api/chat/property/${propertyId}/conversations/`
  );
  return response.data;
};

export const getChatHistory = async (conversationId) => {
  const response = await API.get(
    `/api/chat/conversation/${conversationId}/history/`
  );
  return response.data;
};

/* BROKER ↔ USER CHAT */

export const startBrokerConversation = async (brokerUserId) => {
  const response = await API.post("/api/chat/broker/start/", {
    broker_user_id: brokerUserId,
  });
  return response.data;
};

export const getBrokerConversation = async (conversationId) => {
  const response = await API.get(
    `/api/chat/broker/conversation/${conversationId}/`
  );
  return response.data;
};

export const getBrokerConversationHistory = async (conversationId) => {
  const response = await API.get(
    `/api/chat/broker/conversation/${conversationId}/history/`
  );
  return response.data;
};

export const getBrokerConversations = async () => {
  const response = await API.get(
    "/api/chat/broker/conversations/"
  );
  return response.data;
};