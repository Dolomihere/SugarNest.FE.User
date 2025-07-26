import { serverApi } from '../../configs/AxiosConfig';

const path = '/favorite'

export const favoriteService = {
  getClientFavorite: async (token) => {
    const res = await serverApi.get(path, {
      headers: {
        Authorization: `Bearer ${token}`
      }});
    return res.data;
  },
  addToFavorite: async (...productIds) => {
    const res = await serverApi.post(path, productIds, {
      headers: {
        Authorization: `Bearer ${token}`
      }});
    return res.data;
  },
  removeFromFavorite: async (...productIds) => {
    const res = await serverApi.put(path, productIds, {
      headers: {
        Authorization: `Bearer ${token}`
      }});
    return res.data;
  }
};
