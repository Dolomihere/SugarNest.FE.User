// TransactionService.js (with fixes for type error)

import { publicApi, privateApi } from "../configs/AxiosConfig";

// Hàm logout (định nghĩa trong file này để tránh phụ thuộc vòng)
const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/signin";
};

class TransactionService {
  // Lấy tất cả giao dịch với bộ lọc và phân trang (yêu cầu xác thực)
  static async getAllTransactions(sortAndFilterRequest = {}, paginationRequest = {}) {
    try {
      const response = await privateApi.get("/transactions", {  // Change to privateApi if auth required
        params: {
          ...sortAndFilterRequest,
          ...paginationRequest,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy tất cả giao dịch:", error);
      throw error;
    }
  }

  // Lấy giao dịch theo ID (không yêu cầu xác thực)
  static async getTransactionById(transactionId) {
    try {
      const response = await publicApi.get(`/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy giao dịch với ID ${transactionId}:`, error);
      throw error;
    }
  }

  // Lấy tất cả giao dịch theo Order ID với bộ lọc và phân trang (yêu cầu xác thực)
  static async getAllTransactionsByOrder(orderId, sortAndFilterRequest = {}, paginationRequest = {}) {
    try {
      const response = await privateApi.get(`/transactions/order/${orderId}`, {  // Change to privateApi
        params: {
          ...sortAndFilterRequest,
          ...paginationRequest,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy giao dịch theo Order ID ${orderId}:`, error);
      throw error;
    }
  }

  // Kiểm tra thông tin giao dịch VnPay (yêu cầu xác thực)
  static async checkVnPayTransaction(transactionId) {
    try {
      const response = await privateApi.get(`/transactions/vnpay/${transactionId}`);  // Change to privateApi
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi kiểm tra giao dịch VnPay ${transactionId}:`, error);
      throw error;
    }
  }

  // Tạo giao dịch tiền mặt (yêu cầu xác thực)
  static async createCashTransaction(orderId, model) {
    try {
      const response = await privateApi.post(`/transactions/cash/${orderId}`, model);  // Change to privateApi
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi tạo giao dịch tiền mặt cho Order ID ${orderId}:`, error);
      throw error;
    }
  }

  // Tạo giao dịch VnPay (không yêu cầu xác thực)
  static async createVnPayTransaction(orderId) {
    try {
      const response = await publicApi.post(`/transactions/vnpay/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi tạo giao dịch VnPay cho Order ID ${orderId}:`, error);
      throw error;
    }
  }

  // Hoàn tiền giao dịch VnPay (yêu cầu xác thực)
  static async refundVnPayTransaction(transactionId, model) {
    try {
      const response = await privateApi.patch(`/transactions/vnpay/${transactionId}/refund`, model);  // Change to privateApi
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi hoàn tiền giao dịch VnPay ${transactionId}:`, error);
      throw error;
    }
  }

  // Hoàn tiền giao dịch tiền mặt (yêu cầu xác thực)
  static async refundCashTransaction(transactionId, model) {
    try {
      const response = await privateApi.patch(`/transactions/cash/${transactionId}/refund`, model);  // Change to privateApi
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi hoàn tiền giao dịch tiền mặt ${transactionId}:`, error);
      throw error;
    }
  }

  // Xử lý IPN của VnPay (không yêu cầu xác thực)
  static async handleVnPayIPN(query) {
    try {
      const response = await publicApi.get("/transactions/vnpay/ipn", {
        params: query,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xử lý IPN của VnPay:", error);
      throw error;
    }
  }

  // Xử lý callback của VnPay (không yêu cầu xác thực)
  static async vnPayCallback(query) {
    try {
      const response = await publicApi.get("/transactions/vnpay/callback", {
        params: query,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xử lý callback của VnPay:", error);
      throw error;
    }
  }

  // Cập nhật trạng thái giao dịch thủ công (yêu cầu xác thực)
  static async updateTransactionStatusManually(transactionId, model) {
    try {
      const response = await privateApi.patch(`/transactions/${transactionId}/status`, model);  // Change to privateApi
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái giao dịch ${transactionId}:`, error);
      throw error;
    }
  }

  // Lấy tất cả thông báo (yêu cầu xác thực)
  static async getAllNotifications(sortAndFilterRequest = {}, paginationRequest = {}) {
    try {
      const filter = {
        ...sortAndFilterRequest,
        status: ["Updated", "Pending"], // Điều chỉnh bộ lọc theo nhu cầu
      };
      const response = await privateApi.get("/transactions", {
        params: {
          ...filter,
          ...paginationRequest,
        },
      });
      // Chuyển đổi dữ liệu giao dịch thành danh sách thông báo
      const notifications = response.data.data.map((transaction) => ({
        id: transaction.id,
        message: `Đơn hàng ${transaction.orderId} đã được ${String(transaction.status).toLowerCase()}!`,
        orderId: transaction.orderId,
        timestamp: new Date(transaction.updatedAt || transaction.createdAt || Date.now()), // Fallback nếu không có updatedAt
        isRead: false,  // Thêm flag để đánh dấu đã đọc
      }));
      return {
        isSuccess: true,
        data: notifications,
        total: response.data.total || notifications.length,
      };
    } catch (error) {
      console.error("Lỗi khi lấy tất cả thông báo:", error);
      throw error;
    }
  }
}

export default TransactionService;