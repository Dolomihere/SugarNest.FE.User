import { publicApi } from "../configs/AxiosConfig";

const endpoint = "/products/sellable";

const ProductService = {
  getProductAdvanced: async (sortBy, pageNumber, sortDescending) => {
    try {
      const response = await publicApi.get(endpoint + `?${sortBy? `SortBy=${sortBy}&` : ""}${pageNumber? `PageSize=${pageNumber}&`:""}${sortDescending? `SortDescending=${sortDescending}&`:""}`);
      return response;
    } catch (error) {
      console.error("Get all products error:", error.response?.data || error.message);
      throw error;
    }
  },

  getAllProducts: async () => {
    try {
      const response = await publicApi.get(endpoint);
      return response;
    } catch (error) {
      console.error("Get all products error:", error.response?.data || error.message);
      throw error;
    }
  },
  getProductById: async (productId) => {
    try {
      const response = await publicApi.get(`${endpoint}/${productId}`);
      return response;
    } catch (error) {
      console.error("Get product by ID error:", error.response?.data || error.message);
      throw error;
    }
  },
  getProductRating: async (productId) => {
    try {
      const response = await publicApi.get(`/ratings/${productId}/point`);
      // Kiểm tra cấu trúc phản hồi API
      if (!response.data?.data) {
        throw new Error("Invalid rating response structure");
      }
      return response; // Trả về toàn bộ response để xử lý trong useQuery
    } catch (error) {
      console.error("Get product rating error:", error.response?.data || error.message);
      throw error; // Ném lỗi để useQuery xử lý
    }
  },
};

export default ProductService;