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
  getCurrentChat: async (token, conversationId) => {
    const res = await publicApi.get(`${path}/chat/${conversationId}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
  submitMessage: async (text, token) => {
    const res = await publicApi.post(`${path}/chat`, JSON.stringify(text), {
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
  },
  genProductSuggest: async ({ message, configs, meta }, token) => {
    const res = await publicApi.post(`${path}/generate/product`, {
      message: message ?? null,
      configs: configs ?? null,
      meta: {
        name: meta?.name ?? null,
        description: meta?.description ?? null,
        details: meta?.details ?? null,
        keywords: meta?.keywords ?? null,
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
}
