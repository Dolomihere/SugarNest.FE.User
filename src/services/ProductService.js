import httpClient from '../configs/AxiosConfig'

const endpoint = '/products'

const ProductService = {
  getAllProducts: () => httpClient.get(endpoint),
  getProductById: (productId) => httpClient.get(`${endpoint}/${productId}`),
};

export default ProductService;
