import { publicApi } from "../configs/AxiosConfig";

const endpoint = "/orders";

const OrderService = {
  createOrder: async (orderData, accessToken, guestCartId) => {
    try {
      let url = `${endpoint}`;
      const config = {};

      if (accessToken) {
        config.headers = { Authorization: `Bearer ${accessToken}` };
        const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
        console.log("Decoded Token:", decodedToken);
        const userId =
          decodedToken.userId ||
          decodedToken.sub ||
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];
        console.log("Extracted UserId:", userId);
      } else if (guestCartId) {
        url += `?cartId=${guestCartId}`;
      } else {
        throw new Error("Không có accessToken hoặc guestCartId");
      }

      console.log("Request URL:", url);
      console.log("Request Config:", config);
      console.log("Request Data:", JSON.stringify(orderData, null, 2));

      const response = await publicApi.post(url, orderData, config);
      console.log("Create order response:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("OrderService.createOrder error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Lỗi khi tạo đơn hàng: " +
          (error.response?.data?.message || error.message)
      );
    }
  },

  getOrderById: async (orderId, accessToken) => {
  try {
    const response = await publicApi.get(`${endpoint}/${orderId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const rawData = response.data?.data || response.data;
    const order = rawData.order || rawData; // nếu có field "order" thì lấy ra

    return {
      ...order,
      subTotal: order.subTotal || 0,
      shippingFee: order.shippingFee || 0,
      voucherDiscount: order.voucherDiscount || 0
    };
  } catch (error) {
      console.error("OrderService.getOrderById error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw new Error(
        "Không thể lấy thông tin đơn hàng: " +
          (error.response?.data?.message || error.message)
      );
    }
  },

  getOrderHistory: async (accessToken) => {
    try {
      const response = await publicApi.get(`${endpoint}/mine`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("Get order history response:", response.data);
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
      console.log("Phản hồi phí vận chuyển:", JSON.stringify(response.data, null, 2));
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
      console.log("Gọi API thanh toán:", url, { orderId, amount });

      const response = await publicApi.post(url, { amount });
      console.log("Process payment response:", response.data);
      return response.data;
    } catch (error) {
      console.error("OrderService.processPayment error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      console.warn("API thanh toán chưa sẵn sàng, trả về dữ liệu giả.");
      return new Promise((resolve) => {
        setTimeout(() => resolve({ status: "success", mock: true }), 1000);
      });
    }
  },

  sendOrderConfirmationEmail: async ({ email, orderId, orderData }) => {
    try {
      const url = `${endpoint}/${orderId}/send-confirmation-email`;
      console.log("Gọi API gửi email:", url, { email, orderData });

      const response = await publicApi.post(url, { email, orderData });
      console.log("Send confirmation email response:", response.data);
      return response.data;
    } catch (error) {
      console.error("OrderService.sendOrderConfirmationEmail error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      console.warn("API gửi email chưa sẵn sàng, thực hiện log giả lập.");
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
