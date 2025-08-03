import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import OrderService from "../services/OrderService";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";

// Ánh xạ trạng thái đơn hàng sang tiếng Việt và màu sắc
const getStatusInVietnamese = (status) => {
  const statusMap = {
    "-2": { label: "Đã trả hàng", bg: "bg-red-100", text: "text-red-700" }, // Returned
    "-1": { label: "Đã hủy", bg: "bg-red-100", text: "text-red-700" }, // Canceled
    "0": { label: "Đang chờ xác nhận", bg: "bg-yellow-100", text: "text-yellow-800" }, // Pending
    "1": { label: "Đã xác nhận", bg: "bg-blue-100", text: "text-blue-800" }, // Confirmed
    "2": { label: "Đang xử lý", bg: "bg-yellow-100", text: "text-yellow-800" }, // Processing
    "3": { label: "Đang vận chuyển", bg: "bg-blue-100", text: "text-blue-800" }, // InTransit
    "4": { label: "Đã giao hàng", bg: "bg-green-100", text: "text-green-800" }, // Delivered
  };
  // Chuẩn hóa status để xử lý cả chuỗi và số
  const normalizedStatus = status?.toString();
  return statusMap[normalizedStatus] || { label: "Không xác định", bg: "bg-gray-200", text: "text-gray-600" };
};

const OrderHistory = () => {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orderHistory", token],
    queryFn: () => OrderService.getOrderHistory(token),
    enabled: !!token,
  });

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value || 0) + " VND";

  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] bg-[#FFF9F4] text-[#3d2e23]">
      <Header />
      <main className="w-full px-6 py-10 mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#a17455]">
          Lịch sử đơn hàng
        </h2>

        {isLoading && <p className="text-[#a17455] text-center">Đang tải đơn hàng...</p>}
        {isError && <p className="text-center text-red-600">Lỗi: {error.message}</p>}
        {!isLoading && data?.data?.orders?.length === 0 && (
          <p className="text-center text-gray-600">Bạn chưa có đơn hàng nào.</p>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.data?.orders?.map((order) => {
              const status = getStatusInVietnamese(order.status);
              return (
                <div
                  key={order.orderId}
                  className="p-5 bg-white border border-[#eaded2] rounded-2xl shadow hover:shadow-lg transition duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[#7b553c]">Đơn hàng</h3>
                    <span className={`text-xs font-semibold rounded-full px-3 py-1 ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="mb-3 space-y-1 text-sm text-gray-600">
                    <p>
                      Ngày đặt: <span className="text-[#5e5045]">{formatDate(order.createdAt)}</span>
                    </p>
                    <p>
                      Tổng thanh toán:{" "}
                      <span className="font-semibold text-[#d48d57]">
                        {formatCurrency(order.total)}
                      </span>
                    </p>
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
      </main>
      <Footer />
    </div>
  );
};

export default OrderHistory;