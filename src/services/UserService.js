import { publicApi } from "../configs/AxiosConfig";

const UserService = {
  getPersonalUser: async (token) => {
    try {
      const response = await publicApi.get("/users/personal", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Get personal user response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Get personal user error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw error;
    }
  },
};

export default UserService;
