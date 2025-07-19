import { publicApi } from "../configs/AxiosConfig";

const endpoint = "/vouchers";

const VoucherService = {
  getAllVouchers: async () => {
    try {
      const response = await publicApi.get(endpoint);
      console.log("Get vouchers response:", response.data);
      return response;
    } catch (error) {
      console.error(
        "Get vouchers error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  getUserVouchers: async (token) => {
    try {
      const response = await publicApi.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Get user vouchers response:", response.data);
      return response;
    } catch (error) {
      console.error(
        "Get user vouchers error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      return { data: { data: [] } };
    }
  },
  getVoucherById: async (id, token) => {
    try {
      console.log(`Sending request to ${endpoint}/${id}`);
      const response = await publicApi.get(`${endpoint}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Get voucher by id response:", response.data);
      return response;
    } catch (error) {
      console.error(
        "Get voucher by id error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default VoucherService;