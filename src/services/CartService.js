import httpClient from '../configs/AxiosConfig'

const endpoint = '/carts'

const CartService = {
  getUserCart: (userId) => httpClient.get(`${endpoint}/user/${userId}`),
  addItemToCart: (itemData) => httpClient.post(`${endpoint}/items`, itemData),
  updateQuantity: (cartItemId, quantity) => httpClient.patch(`${endpoint}/items/${cartItemId}/quantity`, { quantity }),
  updateNote: (cartItemId, note) => httpClient.patch(`${endpoint}/items/${cartItemId}/note`, { note }),
  deleteItem: (cartItemId) => httpClient.delete(`${endpoint}/items/${cartItemId}`),
};

export default CartService;
