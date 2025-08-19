import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import OrderService from "../services/OrderService";

const getStatusInVietnamese = (status) => {
  const statusMap = {
    "-2": { label: "Đã trả hàng", bg: "bg-red-100", text: "text-red-700" },
    "-1": { label: "Đã hủy", bg: "bg-red-100", text: "text-red-700" },
    "0": { label: "Đang chờ xác nhận", bg: "bg-yellow-100", text: "text-yellow-800" },
    "1": { label: "Đã xác nhận", bg: "bg-blue-100", text: "text-blue-800" },
    "2": { label: "Đang xử lý", bg: "bg-yellow-100", text: "text-yellow-800" },
    "3": { label: "Đang vận chuyển", bg: "bg-blue-100", text: "text-blue-800" },
    "4": { label: "Đã giao hàng", bg: "bg-green-100", text: "text-green-800" },
  };
  return statusMap[status?.toString()] || { label: "Không xác định", bg: "bg-gray-200", text: "text-gray-600" };
};

const OrderHistory = ({ embedded = false }) => {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "decimal" }).format(value || 0) + " VND";

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Không xác định";

  useEffect(() => {
    if (!token) {
      setError("Bạn chưa đăng nhập.");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const historyRes = await OrderService.getOrderHistory(token);
        const orderList = historyRes?.data?.orders || [];

        const detailedOrders = await Promise.all(
          orderList.map(async (order) => {
            try {
              const detailRes = await OrderService.getOrderById(order.orderId, token);
              const detail = detailRes.data || detailRes;
              const total = (detail.subTotal || 0) + (detail.shippingFee || 0) - (detail.voucherDiscount || 0);
              return { ...order, ...detail, total };
            } catch {
              return order;
            }
          })
        );

        setOrders(detailedOrders);
      } catch {
        setError("Không thể tải lịch sử đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const content = (
    <div className="w-full">
      {!embedded && <h2 className="text-3xl font-bold mb-8 text-center text-[#a17455]">Lịch sử đơn hàng</h2>}
      {embedded && <h2 className="text-2xl font-semibold mb-6 text-[#a17455]">Lịch sử đơn hàng</h2>}

      {loading && <p className="text-center">Đang tải đơn hàng...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && orders.length === 0 && <p className="text-center">Bạn chưa có đơn hàng nào.</p>}

      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {orders.map((order) => {
            const status = getStatusInVietnamese(order.status);
            return (
              <div
                key={order.orderId}
                className="p-5 bg-white border border-[#eaded2] rounded-2xl shadow hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-[#7b553c]">Đơn hàng</h3>
                  <span className={`text-xs font-semibold rounded-full px-3 py-1 ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>
                <div className="mb-3 text-sm text-gray-600">
                  <p>Ngày đặt: <span className="text-[#5e5045]">{formatDate(order.createdAt)}</span></p>
                  <p>Tổng thanh toán: <span className="font-semibold text-[#d48d57]">{formatCurrency(order.total)}</span></p>
                </div>
                <button
                  onClick={() => navigate(`/order/${order.orderId}`)}
                  className="w-full text-sm font-medium text-[#a17455] border border-[#d6a97e] px-4 py-2 rounded-lg hover:bg-[#f5e9dc] transition"
                >
                  Xem chi tiết
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // Nếu nhúng trong AccountPage → chỉ render nội dung
  if (embedded) return content;

  // Nếu là trang riêng → có Header + Footer
  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] bg-[#FFF9F4] text-[#3d2e23]">
      <Header />
      <main className="w-full px-6 py-10 mx-auto max-w-7xl">{content}</main>
      <Footer />
    </div>
  );
};

export default OrderHistory;
