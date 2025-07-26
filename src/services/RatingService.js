import { publicApi } from "../configs/AxiosConfig";

const endpoint = "/ratings";

const RatingService = {
  getAllRatings: async () => {
    try {
      const response = await publicApi.get(endpoint);
      console.log("Get ratings response:", response.data);
      return response;
    } catch (error) {
      console.error(
        "Get ratings error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  getRatingsByProduct: async (productId, token) => {
    try {
      const response = await publicApi.get(
        `${endpoint}/byproduct/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Get ratings by product response:", response.data);
      return response;
    } catch (error) {
      console.error(
        "Get ratings by product error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      return { data: { data: [] } };
    }
  },
  getRatingById: async (ratingId, token) => {
    try {
      console.log(`Sending request to ${endpoint}/${ratingId}`);
      const response = await publicApi.get(`${endpoint}/${ratingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Get rating by id response:", response.data);
      return response;
    } catch (error) {
      console.error(
        "Get rating by id error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  postRating: async (newRating, token) => {
    try {
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };
      const response = await publicApi.post(endpoint, newRating, { headers });
      console.log("Post rating response:", response.data);
      return response;
    } catch (error) {
      console.error(
        "Post rating error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw error;
    }
  },
};

export default RatingService;