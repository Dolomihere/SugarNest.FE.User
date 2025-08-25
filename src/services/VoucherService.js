import { publicApi } from "../configs/AxiosConfig";

const endpoint = "/itemvouchers";

const VoucherService = {
  getAllVouchers: async (accessToken) => {
    try {
      const res = await publicApi.get(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("VoucherService.getAllVouchers response:", res.data);
      return res.data?.data.map((v) => ({
        voucherId: v.itemVoucherId,
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
      })) || [];
    } catch (error) {
      console.error("VoucherService.getAllVouchers error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Không thể tải danh sách voucher: " +
          (error.response?.data?.message || error.message)
      );
    }
  },

  getVoucherById: async (voucherId, accessToken) => {
  try {
    if (!accessToken) {
      console.warn("No accessToken provided for getVoucherById");
      return null;
    }
    const url = `${endpoint}/${voucherId}`;
    const res = await publicApi.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("VoucherService.getVoucherById response:", JSON.stringify(res.data, null, 2));
    return {
      voucherId: res.data.itemVoucherId,
      name: res.data.name,
      productId: res.data.productId,
      productName: res.data.productName,
      minQuantity: res.data.minQuantity,
      maxQuantity: res.data.maxQuantity,
      hardValue: res.data.hardValue,
      percentValue: res.data.percentValue,
      isActive: res.data.isActive,
      startTime: res.data.startTime,
      endTime: res.data.endTime,
    };
  } catch (error) {
    console.error("VoucherService.getVoucherById error:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
    }
    throw new Error(
      "Không thể lấy thông tin voucher: " +
        (error.response?.data?.message || error.message)
    );
  }
},

getUserItemVouchers: async (accessToken) => {
  try {
    if (!accessToken) {
      console.warn("No accessToken provided for getUserItemVouchers");
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

  getUserItemVoucherByCode: async (code, accessToken) => {
    try {
      const url = `${endpoint}/code?code=${encodeURIComponent(code)}`;
      const res = await publicApi.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("VoucherService.getUserItemVoucherByCode response:", res.data);
      return {
        voucherId: res.data.itemVoucherId,
        name: res.data.name,
        productId: res.data.productId,
        productName: res.data.productName,
        minQuantity: res.data.minQuantity,
        maxQuantity: res.data.maxQuantity,
        hardValue: res.data.hardValue,
        percentValue: res.data.percentValue,
        isActive: res.data.isActive,
        startTime: res.data.startTime,
        endTime: res.data.endTime,
      };
    } catch (error) {
      console.error("VoucherService.getUserItemVoucherByCode error:", error.response?.data || error.message);
      const message = error.response?.data?.message || error.message;
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      } else if (error.response?.status === 404) {
        throw new Error("Mã voucher không tồn tại.");
      } else if (error.response?.status === 400) {
        throw new Error("Mã voucher không hợp lệ: " + message);
      }
      throw new Error("Không thể kiểm tra voucher: " + message);
    }
  },
};

export default VoucherService;