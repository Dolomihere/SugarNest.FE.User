import httpClient from "../configs/AxiosConfig";

const endpoint = "/carts";

const CartService = {
  getUserCart: async (token) =>
    await ttpClient.get(`${endpoint}/mine`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getGuestCart: async (cartId) =>
    await httpClient.get(`${endpoint}/guest/${cartId}`),
  addItemToCart: async (itemData, token) =>
    await httpClient.post(`${endpoint}/items`, itemData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  updateQuantity: async (cartItemId, quantity, cartId) =>
    await httpClient.patch(
      `${endpoint}/items/${cartItemId}/quantity?cartId=${cartId}`,
      { quantity }
    ),
  updateNote: async (cartItemId, note) =>
    await httpClient.patch(`${endpoint}/items/${cartItemId}/note`, { note }),
  deleteItem: async (cartItemId) =>
    await httpClient.delete(`${endpoint}/items/${cartItemId}`),
};

export default CartService;
