import httpClient from '../configs/AxiosConfig'

const endpoint = '/productoptions'

const ProductOptionService = {
  getAllOptions: () => httpClient.get(`${endpoint}/groups`),
  getOptionOfProductById: (productId) => httpClient.get(`${endpoint}/groups/byproduct/${productId}`),
};

export default ProductOptionService;
