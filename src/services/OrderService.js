import { privateApi, publicApi } from "../configs/AxiosConfig";

const endpoint = "/orders";

const OrderService = {
  // Lấy cart của user đã đăng nhập
  getUserCart: async (accessToken) => {
    const response = await publicApi.get("/carts/mine", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  },

  getGuestCart: async (cartId) => {
    const response = await publicApi.get(`/carts/guest/${cartId}`);
    return response.data;
  },

  createCart: async () => {
    try {
      const response = await publicApi.post("/carts", {});
      return response.data;
    } catch (error) {
      console.error(
        "OrderService.createCart error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getUserCartId: async (accessToken) => {
    try {
      const cart = await OrderService.getUserCart(accessToken);
      return cart.id; // vì backend sẽ trả về cart object có id
    } catch (error) {
      console.error(
        "OrderService.getUserCartId error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  calculateShippingFee: async ({ lat, lng }) => {
    try {
      const cart = await OrderService.getUserCart(accessToken);
      return cart.id;
    } catch (error) {
      console.error(
        "OrderService.getUserCartId error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  calculateShippingFee: async ({ lat, lng, subtotal }) => {
    try {
      console.log("Gọi API tính phí vận chuyển:", { lat, lng, subtotal });

      const response = await publicApi.get(`/orders/shippingfee`, {
        params: {
          latitude: lat,
          longitude: lng,
          subTotal: subtotal,
        },
      });

      return { shippingFee: response.data.data };
    } catch (error) {
      console.error("Lỗi OrderService.calculateShippingFee:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        params: error.config?.params,
      });
      throw new Error(
        "Không thể tính phí vận chuyển: " +
          (error.response?.data?.message || error.message)
      );
    }
  },
  createOrder: async (orderData, accessToken = null, guestCartId = null) => {
    try {
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      const payload = {
        Address: orderData.Address,
        CustomerName: orderData.CustomerName,
        PhoneNumber: orderData.PhoneNumber,
        Email: orderData.Email,
        DeliveryTime: orderData.DeliveryTime,
        RecipientName: orderData.RecipientName,
        RecipientEmail: orderData.RecipientEmail,
        RecipientPhone: orderData.RecipientPhone,
        Note: orderData.Note,
        UserVoucher: orderData.UserVoucher || null,
        Latitude: orderData.Latitude || null,
        Longitude: orderData.Longitude || null,
        usedPoint: orderData.usedPoint,
      };

      console.log(
        "📦 Sending order payload to backend:",
        JSON.stringify(payload, null, 2)
      );

      const response = await publicApi.post(
        guestCartId ? `${endpoint}?cartId=${guestCartId}` : endpoint,
        payload,
        { headers }
      );

      console.log(
        "📩 Backend response:",
        JSON.stringify(response.data, null, 2)
      );

      return response.data;
    } catch (error) {
      console.error(
        "OrderService.createOrder error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getOrderHistory: async (accessToken, pageIndex, pageSize) => {
    try {
      const response = await privateApi.get(`${endpoint}/mine`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      });
      const data = response.data;
      return data;
    } catch (error) {
      console.error(
        "OrderService.getOrderHistory error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Không thể tải lịch sử đơn hàng: " +
          (error.response?.data?.message || error.message)
      );
    }
  },

  getOrderById: async (orderId, accessToken) => {
    try {
      const response = await publicApi.get(`${endpoint}/${orderId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.data;
    } catch (error) {
      console.error(
        "OrderService.getOrderById error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Không thể tải đơn hàng: " +
          (error.response?.data?.message || error.message)
      );
    }
  },
  cancelOrder: async (orderId, reason, accessToken = null) => {
    try {
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};
      const response = await publicApi.post(
        `${endpoint}/${orderId}/cancel`,
        { reason },
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error(
        "OrderService.cancelOrder error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  calculateShippingFee: async ({ lat, lng, subTotal }) => {
    try {
      console.log("Gọi API tính phí vận chuyển:");
      const response = await publicApi.get(
        `${endpoint}/shippingfee?longitude=${lng}&latitude=${lat}&subTotal=${subTotal}`
      );
      return { shippingFee: response.data.data };
    } catch (error) {
      console.error("Lỗi OrderService.calculateShippingFee:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        params: error.config?.params,
      });
      throw new Error(
        "Không thể tính phí vận chuyển: " +
          (error.response?.data?.message || error.message)
      );
    }
  },

  processPayment: async ({ orderId, amount }) => {
    try {
      const url = `${endpoint}/${orderId}/payment`;
      const response = await publicApi.post(url, { amount });
      return response.data;
    } catch (error) {
      console.error("OrderService.processPayment error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      return new Promise((resolve) => {
        setTimeout(() => resolve({ status: "success", mock: true }), 1000);
      });
    }
  },

  sendOrderConfirmationEmail: async ({ email, orderId, orderData }) => {
    try {
      const url = `${endpoint}/${orderId}/send-confirmation-email`;
      const response = await publicApi.post(url, { email, orderData });
      return response.data;
    } catch (error) {
      console.error("OrderService.sendOrderConfirmationEmail error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(
            `(Giả lập) Gửi email tới ${email} cho đơn hàng ${orderId}`
          );
          console.log("Chi tiết đơn hàng:", orderData);
          resolve({ status: "email_sent", mock: true });
        }, 1000);
      });
    }
  },
  getOrderStatusHistory: async (accessToken) => {
    try {
      const response = await publicApi.get(`${endpoint}/mine/stats`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("OrderService.getOrderStatusHistory error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Không thể tải lịch sử trạng thái đơn hàng: " +
          (error.response?.data?.message || error.message)
      );
    }
  },
  getOrderStatusChanges: async (orderId, accessToken) => {
    try {
      const response = await publicApi.get(
        `${endpoint}/${orderId}/status-history`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data; // Giả sử response.data là mảng các thay đổi trạng thái
    } catch (error) {
      console.error("OrderService.getOrderStatusChanges error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Không thể tải lịch sử thay đổi trạng thái: " +
          (error.response?.data?.message || error.message)
      );
    }
  },
};

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export { getDistanceFromLatLonInKm };
export default OrderService;
