import { publicApi } from "../configs/AxiosConfig";

const ChatService = {
  sendMessage: async (message, token = null, conversationId = null) => {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      // Nếu có conversationId thêm query param
      const url = conversationId ? `/aichatbot/chat?conversationId=${conversationId}` : "/aichatbot/chat";
      const response = await publicApi.post(url, message, config);
      console.log("Send message response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Send message failed:", error.response?.data || error.message);
      throw error;
    }
  },

  getMessages: async (token = null, conversationId) => {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      if (!conversationId) throw new Error("ConversationId is required");
      const url = `/aichatbot/chat/${conversationId}/messages`;
      const response = await publicApi.get(url, config);
      console.log("Get messages response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get messages failed:", error.response?.data || error.message);
      throw error;
    }
  },

  getUserConversations: async (token = null) => {
    try {
      if (!token) throw new Error("Token is required");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await publicApi.get("/aichatbot/chat/", config);
      console.log("Get user conversations response:", response.data);
      return response.data || [];
    } catch (error) {
      console.error("Get user conversations failed:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteConversation: async (token = null, conversationId) => {
    try {
      if (!token) throw new Error("Token is required");
      if (!conversationId) throw new Error("ConversationId is required");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const url = `/aichatbot/chat/${conversationId}`;
      const response = await publicApi.delete(url, config);
      console.log("Delete conversation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Delete conversation failed:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default ChatService;
