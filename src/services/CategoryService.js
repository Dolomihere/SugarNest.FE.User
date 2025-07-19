import { publicApi } from "../configs/AxiosConfig";

const endpoint = "/categories/sellable";

const CategoryService = {
  getAllCategories: () => publicApi.get(endpoint),
  getCategoryById: (categoryId) => publicApi.get(`${endpoint}/${categoryId}`),
};

export default CategoryService;
