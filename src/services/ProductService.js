import httpClient from "../configs/AxiosConfig";

const endpoint = "/products/sellable";

const ProductService = {
  getAllProducts: async () => await httpClient.get(endpoint),
  getProductById: async (productId) => await httpClient.get(`${endpoint}/${productId}`),
};

export default ProductService;