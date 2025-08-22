import { publicApi } from "../configs/AxiosConfig";

const endpoint = "/itemvouchers";

const ItemVoucherService = {
  // Lấy tất cả voucher
  getAllItemVouchers: async (accessToken) => {
    try {
      const res = await publicApi.get(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data?.data || [];
    } catch (error) {
      console.error("ItemVoucherService.getAllItemVouchers error:", error);
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Không thể tải danh sách voucher: " +
          (error.response?.data?.message || error.message)
      );
    }
  },

  // Lấy voucher theo ID
  getItemVoucherById: async (voucherId, accessToken) => {
    try {
      const url = `${endpoint}/${voucherId}`;
      const res = await publicApi.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data;
    } catch (error) {
      console.error("ItemVoucherService.getItemVoucherById error:", error);
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Không thể lấy thông tin voucher: " +
          (error.response?.data?.message || error.message)
      );
    }
  },

  // Lấy danh sách voucher của user
  getUserItemVouchers: async (accessToken) => {
    try {
      const res = await publicApi.get(`${endpoint}/mine`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res?.data?.data) return [];
      return res.data.data;
    } catch (error) {
      console.error("ItemVoucherService.getUserItemVouchers error:", error);
      return [];
    }
  },

  // Tạo mới voucher (Admin)
  createItemVoucher: async (model, accessToken) => {
    try {
      const res = await publicApi.post(endpoint, model, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data;
    } catch (error) {
      console.error("ItemVoucherService.createItemVoucher error:", error);
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Không thể tạo voucher: " +
          (error.response?.data?.message || error.message)
      );
    }
  },

  // Cập nhật voucher (Admin)
  updateItemVoucher: async (voucherId, model, accessToken) => {
    try {
      const url = `${endpoint}/${voucherId}`;
      const res = await publicApi.put(url, model, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data;
    } catch (error) {
      console.error("ItemVoucherService.updateItemVoucher error:", error);
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Không thể cập nhật voucher: " +
          (error.response?.data?.message || error.message)
      );
    }
  },

  // Xóa voucher (Admin)
  deleteItemVoucher: async (voucherId, accessToken) => {
    try {
      const url = `${endpoint}/${voucherId}`;
      const res = await publicApi.delete(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data;
    } catch (error) {
      console.error("ItemVoucherService.deleteItemVoucher error:", error);
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Không thể xóa voucher: " +
          (error.response?.data?.message || error.message)
      );
    }
  },

  // Gán voucher cho người dùng (Admin)
  assignItemVoucher: async (voucherId, model, accessToken) => {
    try {
      const url = `${endpoint}/${voucherId}`;
      const res = await publicApi.post(url, model, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data;
    } catch (error) {
      console.error("ItemVoucherService.assignItemVoucher error:", error);
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Không thể gán voucher: " +
          (error.response?.data?.message || error.message)
      );
    }
  },

  // Kiểm tra voucher (assuming this uses GET /itemvouchers/code or similar; adjust if needed)
  validateItemVoucher: async (voucherId, accessToken) => {
    try {
      const url = `${endpoint}/validate/${voucherId}`; // Note: This may not exist; replace with GET /itemvouchers/{voucherId} if validation is part of fetch
      const res = await publicApi.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data;
    } catch (error) {
      console.error("ItemVoucherService.validateItemVoucher error:", error);
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Không thể kiểm tra voucher: " +
          (error.response?.data?.message || error.message)
      );
    }
  },

  // Placeholder for getApplied (no backend endpoint, so return null; handle locally in components)
  getAppliedVoucherDiscountAsync: async () => {
    return null; // No backend support; use localStorage in VoucherSection instead
  },
};

export default ItemVoucherService;