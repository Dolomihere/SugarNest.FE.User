import httpClient from "../configs/AxiosConfig";

const endpoint = "/categories/sellable";

const CategoryService = {
  getAllCategories: () => httpClient.get(endpoint),
  getCategoryById: (categoryId) => httpClient.get(`${endpoint}/${categoryId}`),
};

export default CategoryService;
