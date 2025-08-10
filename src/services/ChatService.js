import { publicApi } from "../configs/AxiosConfig";

const ChatService = {
  sendMessage: async (payload, token = null, conversationId = null) => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const url = conversationId
        ? `/aichatbot/chat?conversationId=${conversationId}`
        : "/aichatbot/chat";
      // Send payload as-is (string) since API expects a string
      console.log("Sending message - URL:", url, "Payload:", payload, "Config:", config);
      const response = await publicApi.post(url, payload, config);
      console.log("Message received:", response);
      console.log("Send message response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Send message failed:",
        {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          payload: payload,
          url: error.config?.url,
          headers: error.config?.headers,
        }
      );
      throw error;
    }
  },

  getMessages: async (token = null, conversationId, backwardNumber = 999, lastIndex = null) => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      if (!conversationId) throw new Error("ConversationId is required");
      const url = `/aichatbot/chat/${conversationId}/messages?BackwardNumber=${backwardNumber}`;
      const response = await publicApi.get(url, config);
      console.log("Get messages response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "Get messages failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getUserConversations: async (token = null) => {
    try {
      if (!token) throw new Error("Token is required");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await publicApi.get("/aichatbot/chat/", config);
      console.log("Get user conversations response:", response.data.data);
      return response.data.data || [];
    } catch (error) {
      console.error(
        "Get user conversations failed:",
        error.response?.data || error.message
      );
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
      console.error(
        "Delete conversation failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default ChatService;