// TransactionService.js
import { publicApi, privateApi } from "../configs/AxiosConfig";

// Hàm logout
const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/signin";
};

class TransactionService {
  // Lấy tất cả giao dịch
  static async getAllTransactions(sortAndFilterRequest = {}, paginationRequest = {}) {
    try {
      const response = await privateApi.get("/transactions", {
        params: {
          ...sortAndFilterRequest,
          ...paginationRequest,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy tất cả giao dịch:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.response?.status === 401) {
        logout();
      }
      throw error;
    }
  }

  // Lấy giao dịch theo ID
  static async getTransactionById(transactionId) {
    try {
      const response = await publicApi.get(`/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy giao dịch với ID ${transactionId}:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  }

  // Lấy tất cả giao dịch theo Order ID
  static async getAllTransactionsByOrder(orderId, sortAndFilterRequest = {}, paginationRequest = {}) {
    try {
      const response = await privateApi.get(`/transactions/order/${orderId}`, {
        params: {
          ...sortAndFilterRequest,
          ...paginationRequest,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy giao dịch theo Order ID ${orderId}:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.response?.status === 401) {
        logout();
      }
      throw error;
    }
  }

  // Kiểm tra thông tin giao dịch VnPay
  static async checkVnPayTransaction(transactionId) {
    try {
      const response = await privateApi.get(`/transactions/vnpay/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi kiểm tra giao dịch VnPay ${transactionId}:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.response?.status === 401) {
        logout();
      }
      throw error;
    }
  }

  // Tạo giao dịch tiền mặt
//  static async createCashTransaction(orderId, model) {
//     try {
//       if (!orderId) throw new Error("Order ID is undefined");
//       const response = await privateApi.post(`/transactions/cash/${orderId}`, model);
//       return response.data;
//     } catch (error) {
//       console.error(`❌ Lỗi khi tạo giao dịch tiền mặt cho Order ID ${orderId}:`, error);
//       if (error.response?.status === 401) logout();
//       throw error;
//     }
//   }

  static async createVnPayTransaction(orderId, token) {
    try {
      // alert(`token in api ${token}`)
      if (!orderId) throw new Error("Order ID is undefined");
      const response = await privateApi.post(`/transactions/vnpay/${orderId}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("data vnpay ", response.data)
      return response.data;
    } catch (error) {
      console.error(`❌ Lỗi khi tạo giao dịch VnPay cho Order ID ${orderId}:`, error);
      throw error;
    }
  }

  // Hoàn tiền giao dịch VnPay
  static async refundVnPayTransaction(transactionId, model) {
    try {
      const response = await privateApi.patch(`/transactions/vnpay/${transactionId}/refund`, model);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi hoàn tiền giao dịch VnPay ${transactionId}:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.response?.status === 401) {
        logout();
      }
      throw error;
    }
  }

  // Hoàn tiền giao dịch tiền mặt
  static async refundCashTransaction(transactionId, model) {
    try {
      const response = await privateApi.patch(`/transactions/cash/${transactionId}/refund`, model);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi hoàn tiền giao dịch tiền mặt ${transactionId}:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.response?.status === 401) {
        logout();
      }
      throw error;
    }
  }

  // Xử lý IPN của VnPay
  static async handleVnPayIPN(query) {
    try {
      const response = await publicApi.get("/transactions/vnpay/ipn", {
        params: query,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xử lý IPN của VnPay:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  }

  // Xử lý callback của VnPay
  static async vnPayCallback(query) {
    try {
      const response = await publicApi.get("/transactions/vnpay/callback", {
        params: query,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xử lý callback của VnPay:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  }

  // Cập nhật trạng thái giao dịch thủ công
  static async updateTransactionStatusManually(transactionId, model) {
    try {
      const response = await privateApi.patch(`/transactions/${transactionId}/status`, model);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái giao dịch ${transactionId}:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.response?.status === 401) {
        logout();
      }
      throw error;
    }
  }

  // Lấy tất cả thông báo
}

export default TransactionService;