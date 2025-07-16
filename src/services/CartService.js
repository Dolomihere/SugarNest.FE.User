import { publicApi } from "../configs/AxiosConfig";

const endpoint = "/carts";

const CartService = {
  getUserCart: async (token) => {
    try {
      const response = await publicApi.get(`${endpoint}/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Get cart response:", response.data);
      return response;
    } catch (error) {
      console.error("Get cart error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      throw error;
    }
  },
  getGuestCart: async (cartId) =>
    await publicApi.get(`${endpoint}/guest/${cartId}`),
  addItemToCart: async (itemData, token) => {
    try {
      const response = await publicApi.post(`${endpoint}/items`, itemData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Add item response:", response.data);
      return response;
    } catch (error) {
      console.error("Add item error:", error.response?.data || error.message);
      throw error;
    }
  },
  updateQuantity: async (cartItemId, quantity, token) => {
    try {
      const response = await publicApi.patch(
        `${endpoint}/items/${cartItemId}/quantity`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Update quantity response:", response.data);
      return response;
    } catch (error) {
      console.error("Update quantity error:", error.response?.data || error.message);
      throw error;
    }
  },
  updateNote: async (cartItemId, note, token) => {
    try {
      const response = await publicApi.patch(
        `${endpoint}/items/${cartItemId}/note`,
        { note },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Update note response:", response.data);
      return response;
    } catch (error) {
      console.error("Update note error:", error.response?.data || error.message);
      throw error;
    }
  },
  deleteItem: async (cartItemId, token) => {
    try {
      const response = await publicApi.delete(`${endpoint}/items/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Delete item response:", response.data);
      return response;
    } catch (error) {
      console.error("Delete item error:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default CartService;
