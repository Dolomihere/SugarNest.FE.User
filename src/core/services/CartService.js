import { serverApi } from '../../configs/AxiosConfig';

const path = '/cart';

export const cartService = {
  getUserCart: async (token) => {
    const res = await serverApi.get(`${path}/mine`, {
      headers: {
        Authorization: `Bearer ${token}`
    }});
    return res.data;
  },
  getGuestCart: async (cartId) => {
    const res = await serverApi.get(`${path}/guest${cartId}`);
    return res.data;
  },
  addItemToCart: async (data, cartId) => {
    const res = await serverApi.post(`${path}/items?cartId=${cartId}`, { ...data });
    return res.data;
  },
  addNote: async (cartItemId, cartId, note) => {
    const res = await serverApi.patch(`${path}/items`);
    return res.data;
  },
  increaseQuantity: async (cartItemId, cartId, quantity) => {
    const res = await serverApi.patch(`${path}/items/${cartItemId}/quantity?cartId=${cartId}`, { quantity: quantity });
    return res.data;
  },
  removeItemFromCart: async (cartItemId, cartId) => {
    const res = await serverApi.delete(`${path}/items/${cartItemId}?cartid=${cartId}`);
    return res.data;
  }
}
