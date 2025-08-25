import { publicApi } from "../configs/AxiosConfig"

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
      alert(2)
      alert(itemData.userItemVoucherId)
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
 updateItemVoucher: async ({ cartItemId, userItemVoucherId }, token, guestCartId) => {
    try {
      let url = `${endpoint}/items/${cartItemId}/voucher`;
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (guestCartId) {
        url += `?cartId=${guestCartId}`;
      } else {
        throw new Error("Không có accessToken hoặc guestCartId");
      }

      const payload = { userItemVoucher: userItemVoucherId || null };
      const response = await publicApi.patch(url, payload, config);
      console.log("Update item voucher response:", JSON.stringify(response.data, null, 2));
      return {
        ...response.data,
        cartItem: response.data.data?.cartItem || null, // Mong đợi cartItem trong response
      };
    } catch (error) {
      console.error("CartService.updateItem error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(
        error.response?.data?.message || "Lỗi khi cập nhật voucher"
      );
    }
  },


  createCart: async (token = null) => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await publicApi.post(endpoint, {}, config);
      console.log("Create cart response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Create cart error:", error.response?.data || error.message);
      throw error;
    }
  },
};
export default CartService;