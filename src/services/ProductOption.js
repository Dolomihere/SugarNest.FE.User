import { publicApi } from "../configs/AxiosConfig";

const endpoint = '/productoptions'

const ProductOptionService = {
  getAllOptions: () => publicApi.get(`${endpoint}/groups`),
  getOptionOfProductById: (productId) => publicApi.get(`${endpoint}/groups/byproduct/${productId}`),
};

export default ProductOptionService;
