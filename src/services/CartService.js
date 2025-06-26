import httpClient from '../configs/AxiosConfig'

const endpoint = '/carts'

const CartService = {
  getUserCart: (token) => httpClient.get(`${endpoint}/mine`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  addItemToCart: (itemData, token) => httpClient.post(`${endpoint}/items`, itemData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  updateQuantity: (cartItemId, quantity) => httpClient.patch(`${endpoint}/items/${cartItemId}/quantity`, { quantity }),
  updateNote: (cartItemId, note) => httpClient.patch(`${endpoint}/items/${cartItemId}/note`, { note }),
  deleteItem: (cartItemId) => httpClient.delete(`${endpoint}/items/${cartItemId}`),
};

export default CartService;
