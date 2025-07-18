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
  getGuestCart: async (cartId) => {
    try {
      const response = await publicApi.get(`${endpoint}/guest/${cartId}`);
      console.log("Get guest cart response:", response.data);
      return response;
    } catch (error) {
      console.error(
        "Get guest cart error:",
        error.response?.data || error.message
      );
      return { data: { data: { cartItems: [] } } }; // Return empty cart if guest cart doesn't exist
    }
  },
  addItemToCart: async (itemData, token = null) => {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await publicApi.post(
        `${endpoint}/items`,
        itemData,
        config
      );
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
      console.error(
        "Update quantity error:",
        error.response?.data || error.message
      );
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
      console.error(
        "Update note error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  deleteItem: async (cartItemId, token) => {
    try {
      const response = await publicApi.delete(
        `${endpoint}/items/${cartItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Delete item response:", response.data);
      return response;
    } catch (error) {
      console.error(
        "Delete item error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  mergeGuestCart: async (cartId, token) => {
    try {
      const response = await publicApi.post(
        `${endpoint}/merge`,
        { guestCartId: cartId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Merge guest cart response:", response.data);
      return response;
    } catch (error) {
      console.error(
        "Merge guest cart error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default CartService;
