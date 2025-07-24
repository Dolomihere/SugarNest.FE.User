import axios from "../core/services/AxiosInstance.ts";

const RatingService = {
  // Lấy danh sách đánh giá theo productId
  getRatingsByProductId: (productId) => {
    return axios.get(`/ratings/byproduct/${productId}`);
  },

  // (Tuỳ chọn) Gửi đánh giá mới
  submitRating: (data, token) => {
    return axios.post("/ratings", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // (Tuỳ chọn) Xoá đánh giá (dành cho admin hoặc người đánh giá)
  deleteRating: (ratingId, token) => {
    return axios.delete(`/ratings/${ratingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default RatingService;
