import { publicApi } from '../configs/AxiosConfig';

const path = '/aichatbot';

export const chatBotService = {
  getChatList: async (token) => {
    const res = await publicApi.get(`${path}/chat`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
  getCurrentChat: async (token) => {
    const res = await publicApi.get(`${path}/chat/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
  submitMessage: async (text, token) => {
    const res = await publicApi.post(`${path}/chat/recommend`, { text }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
  genProductRecommend: async (form, token) => {
    const res = await publicApi.post(`${path}/generate/product`, { ...form }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
  deleteChat: async (conversationId, token) => {
    const res = await publicApi.delete(`${path}/chat/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
}
