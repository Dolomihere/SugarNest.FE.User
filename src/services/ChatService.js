// src/services/ChatService.js
import { publicApi } from "../configs/AxiosConfig";

const ChatService = {
  sendMessage: async (payload) => {
    try {
      const response = await publicApi.post("/aichatbot/chat", payload);
      return response.data;
    } catch (error) {
      console.error("Send message failed:", error.response?.data || error.message);
      throw error;
    }
  },

  getMessages: async () => {
    try {
      const response = await publicApi.get("/aichatbot/chat/messages");
      return response.data;
    } catch (error) {
      console.error("Get messages failed:", error.response?.data || error.message);
      throw error;
    }
  },

  recommend: async () => {
    try {
      const response = await publicApi.post("/aichatbot/chat/recommend");
      return response.data;
    } catch (error) {
      console.error("Get recommend failed:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default ChatService;
