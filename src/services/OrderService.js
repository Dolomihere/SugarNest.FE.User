import { publicApi } from "../configs/AxiosConfig";

const endpoint = "/orders";

const OrderService = {
  getUserCart: async (accessToken) => {
    try {
      const response = await publicApi.get("/carts", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("OrderService.getUserCart error:", error.response?.data || error.message);
      throw error;
    }
  },

  getGuestCart: async (cartId) => {
    try {
      const response = await publicApi.get(`/carts/${cartId}`);
      return response.data;
    } catch (error) {
      console.error("OrderService.getGuestCart error:", error.response?.data || error.message);
      throw error;
    }
  },

  createCart: async () => {
    try {
      const response = await publicApi.post("/carts", {});
      return response.data;
    } catch (error) {
      console.error("OrderService.createCart error:", error.response?.data || error.message);
      throw error;
    }
  },

  getUserCartId: async (accessToken) => {
    try {
      const response = await publicApi.get("/carts/id", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.cartId;
    } catch (error) {
      console.error("OrderService.getUserCartId error:", error.response?.data || error.message);
      throw error;
    }
  },

  calculateShippingFee: async ({ lat, lng }) => {
    try {
      const response = await publicApi.post("/shipping/calculate", { lat, lng });
      return response.data;
    } catch (error) {
      console.error("OrderService.calculateShippingFee error:", error.response?.data || error.message);
      throw error;
    }
  },

  createOrder: async (orderData, accessToken, cartId) => {
    try {
      const response = await publicApi.post(
        "/orders",
        orderData,
        {
          headers: { Authorization: `Bearer ${accessToken || cartId}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("OrderService.createOrder error:", error.response?.data || error.message);
      throw error;
    }
  },

  getOrderHistory: async (accessToken) => {
    try {
      const response = await publicApi.get(`${endpoint}/mine`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return {
        data: {
          orders: response.data.data?.orders || response.data.data || [],
        },
      };
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

  calculateShippingFee: async ({ lat, lng }) => {
    try {
      const response = await publicApi.get(
        `${endpoint}/shippingfee?longitude=${lng}&latitude=${lat}`,
        {
          params: {
            latitude: lat,
            longitude: lng,
          },
        }
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

      // fallback mock
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

      // fallback mock
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`(Giả lập) Gửi email tới ${email} cho đơn hàng ${orderId}`);
          console.log("Chi tiết đơn hàng:", orderData);
          resolve({ status: "email_sent", mock: true });
        }, 1000);
      });
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
