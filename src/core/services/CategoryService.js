import { serverApi } from '../../configs/AxiosConfig';

const path = '/categories/sellable';

export const categoryService = {
  getAll: async () => {
    const res = await serverApi.get(path);
    return res.data;
  },
  getById: async (categoryId) => {
    const res = await serverApi.get(`${path}/${categoryId}`);
    return res.data;
  }
};
