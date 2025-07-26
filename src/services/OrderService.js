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
        throw new Error("No accessToken or guestCartId provided");
      }

      console.log("Request URL:", url);
      console.log("Request Config:", config);
      console.log(
        "Request Data (Stringified):",
        JSON.stringify(orderData, null, 2)
      );

      const response = await publicApi.post(url, orderData, config);
      console.log(
        "Create order response (Full):",
        JSON.stringify(response.data, null, 2)
      );
      return response.data; // Return full response for flexibility
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

  calculateShippingFee: async ({ lat, lng }) => {
    try {
      const response = await publicApi.post("/shipping/calculate", {
        lat,
        lng,
      });
      console.log("Calculate shipping fee response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "OrderService.calculateShippingFee error:",
        error.response?.data || error.message
      );
      const storeLocation = { lat: 10.853826, lng: 106.627398 };
      const distance = getDistanceFromLatLonInKm(
        storeLocation.lat,
        storeLocation.lng,
        lat,
        lng
      );
      const shippingFee = distance > 5 ? 40000 : 0;
      return { shippingFee };
    }
  },

  processPayment: async ({ orderId, amount }) => {
    try {
      const response = await publicApi.post("/payment", { orderId, amount });
      console.log("Process payment response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "OrderService.processPayment error:",
        error.response?.data || error.message
      );
      return new Promise((resolve) => {
        setTimeout(() => resolve({ status: "success" }), 1000);
      });
    }
  },

  sendOrderConfirmationEmail: async ({ email, orderId, orderData }) => {
    try {
      const response = await publicApi.post("/email/confirmation", {
        email,
        orderId,
        orderData,
      });
      console.log("Send confirmation email response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "OrderService.sendOrderConfirmationEmail error:",
        error.response?.data || error.message
      );
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`Sending email to ${email} for order ${orderId}`);
          console.log("Order details:", orderData);
          resolve({ status: "email_sent" });
        }, 1000);
      });
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
};

// Haversine formula for distance calculation
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

export default OrderService;