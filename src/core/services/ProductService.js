import { serverApi } from '../../configs/AxiosConfig';

const path = '/products/sellable';

export const productService = {
  getById: async (productId) => {
    const res = await serverApi.get(`${path}/${productId}`);
    return res.data;
  },
  getAll: async ({ queryKey }) => {
    const [_key, { searchTerm, sortBy, sortDescending, isActive, categoryId, pageIndex, pageSize }] = queryKey;

    const res = await axios.get('https://sugarnest-api.io.vn/products/sellable', {
      params: {
        SearchTerm: searchTerm,
        SortBy: sortBy,
        SortDescending: sortDescending,
        'Filter.IsActive': isActive,
        'Filter.CategoryId': categoryId,
        PageIndex: pageIndex,
        PageSize: pageSize,
      },
    });

    return res.data;
  }
};
