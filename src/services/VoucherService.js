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
    const res = await publicApi.get(endpoint+`/mine?SortBy=ProductName`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("VoucherService.getUserItemVouchers raw response:", JSON.stringify(res.data, null, 2));
    if (!res?.data?.data) {
      console.warn("No voucher data returned from API");
      return [];
    }
    let vouchers = res.data.data.map((v) => ({
      userItemVoucherId: v.userItemVoucherId,
      itemVoucherId: v.itemVoucherId,
      name: v.name,
      productId: v.productId,
      productName: v.productName,
      minQuantity: v.minQuantity,
      maxQuantity: v.maxQuantity,
      hardValue: v.hardValue,
      percentValue: v.percentValue,
      isActive: v.isActive,
      startTime: v.startTime,
      endTime: v.endTime,
    }));
    vouchers = vouchers.sort((a, b) => b.productName.localeCompare(a.productName));
    console.log("Mapped vouchers:", JSON.stringify(vouchers, null, 2));
    return vouchers;
  } catch (error) {
    console.error("VoucherService.getUserItemVouchers error:", error.response?.data || error.message);
    return [];
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