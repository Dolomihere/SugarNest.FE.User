import httpClient from "../configs/AxiosConfig";

const endpoint = "/products/sellable";

const ProductService = {
  getAllProducts: () => httpClient.get(endpoint),
  getProductById: (productId) => httpClient.get(`${endpoint}/${productId}`),
};

export default ProductService;