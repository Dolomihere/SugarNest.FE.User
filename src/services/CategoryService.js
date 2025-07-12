import httpClient from '../configs/AxiosConfig'

const endpoint = '/categories'

const CategoryService = {
  getAllCategories: () => httpClient.get(`${endpoint}/sellable`),
  getCategoryById: (categoryId) => httpClient.get(`${endpoint}/sellable/${categoryId}`)
}

export default CategoryService;
