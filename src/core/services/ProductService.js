import { serverApi } from '../../configs/AxiosConfig';

const path = '/products/sellable';

export const productService = {
  getById: async (productId) => {
    const res = await serverApi.get(`${path}/${productId}`);
    return res.data;
  },
  getAll: async (params) => {
    const queryString = JSON.stringify(
      {
        SearchTerm: params.searchTerm || '',
        SortBy: params.sortBy || 'CreatedAt',
        SortDescending: params.sortDescending ?? true,
        'Filter.IsActive': params.isActive ?? true,
        'Filter.CategoryId': params.categoryId || undefined,
        PageIndex: params.pageIndex ?? 1,
        PageSize: params.pageSize ?? 10,
      },
      { skipNulls: true }
    );

    const res = await serverApi.get(`${path}?${queryString}`);
    return res.data;
  },
};
