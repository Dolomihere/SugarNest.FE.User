// ProductOption.js
import { publicApi } from '../configs/AxiosConfig';

const endpoint = '/productoptions';

const ProductOptionService = {
  getAllOptions: () => publicApi.get(`${endpoint}/groups`),
  getOptionOfProductById: async (productId) => {
    try {
      const response = await publicApi.get(`${endpoint}/groups/byproduct/${productId}/sellable`);
      console.log('API response for sellable product options:', response.data);
      if (response.data.statusCode !== 200) {
        throw new Error(`API returned status ${response.data.statusCode}`);
      }
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching product options for productId ${productId}:`, error.response?.data || error.message);
      throw error;
    }
  },
};

export default ProductOptionService;