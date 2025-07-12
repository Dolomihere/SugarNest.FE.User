import { api } from "../configs/AxiosConfig"

export const CartService = {
  getUserCart: async () => {
    const res = await api.get('/carts/mine');
    return res.data;
  }
}
