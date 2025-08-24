// src/services/UserService.js
import { privateApi, publicApi } from "../configs/AxiosConfig";

const UserService = {
  // 🔒 Lấy thông tin cá nhân (của chính user đang login)
  getPersonalUser: async () => {
    try {
      const response = await privateApi.get("/users/personal");
      return response.data;
    } catch (error) {
      console.error(
        "Get personal user error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 🌍 Lấy thông tin public của user bất kỳ theo userId
  getPublicUser: async (userId) => {
    try {
      const response = await publicApi.get(`/users/${userId}/public`);
      return response.data;
    } catch (error) {
      console.error(
        "Get public user error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default UserService;
