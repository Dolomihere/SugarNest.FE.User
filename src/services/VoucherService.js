import { publicApi } from "../configs/AxiosConfig";

const endpoint = "/vouchers";

const VoucherService = {
  // Lấy tất cả voucher
  getAllVouchers: async (accessToken) => {
    try {
      const res = await publicApi.get(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data?.data || [];
    } catch (error) {
      console.error("VoucherService.getAllVouchers error:", error);
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Không thể tải danh sách voucher: " +
          (error.response?.data?.message || error.message)
      );
    }
  },

  // Lấy voucher toàn đơn của người dùng
  getOrderVouchers: async (accessToken) => {
    try {
      const res = await publicApi.get("/vouchers/mine", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("Order Vouchers API response:", JSON.stringify(res.data, null, 2));
      return res.data?.data || [];
    } catch (error) {
      console.error("VoucherService.getOrderVouchers error:", error);
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Không thể tải danh sách voucher toàn đơn: " +
          (error.response?.data?.message || error.message)
      );
    }
  },

  // Lấy voucher theo ID
  getVoucherById: async (voucherId, accessToken) => {
    try {
      const url = `${endpoint}/${voucherId}`;
      const res = await publicApi.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data;
    } catch (error) {
      console.error("VoucherService.getVoucherById error:", error);
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Không thể lấy thông tin voucher: " +
          (error.response?.data?.message || error.message)
      );
    }
  },

  // Lấy danh sách voucher item của user
  getUserItemVouchers: async (accessToken) => {
    try {
      const res = await publicApi.get("/itemvouchers/mine", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("User Item Vouchers API response:", JSON.stringify(res.data, null, 2));
      if (!res?.data?.data) return [];
      let vouchers = res?.data?.data ?? [];
      vouchers = vouchers.sort((a, b) => b.productName.localeCompare(a.productName));
      return vouchers;
    } catch (error) {
      console.error("VoucherService.getUserItemVouchers error:", error);
      return [];
    }
  },

  // Áp dụng voucher
  applyVoucher: async ({ code, cartId, accessToken }) => {
    try {
      const url = `${endpoint}/apply`;
      const res = await publicApi.post(
        url,
        { code, cartId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return res.data;
    } catch (error) {
      console.error("VoucherService.applyVoucher error:", error);
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      // Mock fallback nếu API chưa sẵn sàng
      return new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            status: "success",
            discount: 50000,
            mock: true,
          });
        }, 1000)
      );
    }
  },

  // Kiểm tra voucher
  validateVoucher: async (code, accessToken) => {
    try {
      const url = `${endpoint}/validate/${code}`;
      const res = await publicApi.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data;
    } catch (error) {
      console.error("VoucherService.validateVoucher error:", error);
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Không thể kiểm tra voucher: " +
          (error.response?.data?.message || error.message)
      );
    }
  },
};

export default VoucherService;