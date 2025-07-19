import { publicApi } from "../configs/AxiosConfig";

const endpoint = "/products/sellable";

const ProductService = {
  getAllProducts: async () => await publicApi.get(endpoint),
  getProductById: async (productId) => await publicApi.get(`${endpoint}/${productId}`),
};

export default ProductService;