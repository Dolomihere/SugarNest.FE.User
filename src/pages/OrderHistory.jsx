import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import OrderService from "../services/OrderService";

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const successMessage = state?.showSuccessMessage;
  const token = localStorage.getItem("accessToken");
  const isLoggedIn = !!token;

  // Format currency
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value || 0) + " VND";

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch order history using useQuery
  const { data, isLoading, error } = useQuery({
    queryKey: ["orderHistory", token],
    queryFn: () => OrderService.getOrderHistory(token),
    enabled: isLoggedIn,
    onError: (err) => {
      console.error("Lỗi tải lịch sử đơn hàng:", err);
      if (err.message === "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        navigate("/signin", { state: { from: "/order-history" } });
      }
    },
  });

  // Handle not logged in
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/signin", { state: { from: "/order-history" } });
    }
  }, [isLoggedIn, navigate]);

  const orders = data?.data?.orders || [];

  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] text-gray-700 bg-[#fffaf3]">
      <Header />
      <main className="max-w-6xl px-4 py-8 mx-auto">
        <h2 className="mb-6 text-2xl font-semibold text-heading">Lịch sử đơn hàng</h2>
        {successMessage && (
          <p className="mb-4 text-sm text-green-600">{successMessage}</p>
        )}
        {isLoading ? (
          <p className="text-sm text-gray-600">Đang tải...</p>
        ) : error ? (
          <p className="text-sm text-red-500">
            Không thể tải lịch sử đơn hàng: {error.message}
          </p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-600">Bạn chưa có đơn hàng nào.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="p-6 bg-white shadow-md rounded-2xl"
              >
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-semibold text-heading">
                    Đơn hàng #{order.orderId || "N/A"}
                  </h3>
                  <span
                    className={`text-sm ${
                      order.paymentStatus === "success"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.paymentStatus === "success"
                      ? "Thanh toán thành công"
                      : "Đang xử lý"}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Ngày đặt:</strong>{" "}
                    {formatDate(order.createdAt) || "Chưa xác định"}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {order.address || "Chưa có thông tin"}
                  </p>
                  <p>
                    <strong>Tổng tiền:</strong> {formatCurrency(order.total)}
                  </p>
                  <p>
                    <strong>Phương thức thanh toán:</strong>{" "}
                    {order.paymentMethod === "cash"
                      ? "Tiền mặt"
                      : order.paymentMethod === "bank_transfer"
                      ? "Chuyển khoản"
                      : "Chưa xác định"}
                  </p>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-sub">Chi tiết đơn hàng</h4>
                  <ul className="mt-2 space-y-2 text-sm text-gray-600">
                    {(order.cartItems || []).map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>
                          {item.productName || `Sản phẩm ${index + 1}`}{" "}
                          {item.cartItemOptions?.length > 0 && (
                            <span>
                              (
                              {item.cartItemOptions
                                .map((opt) => opt.optionValue)
                                .join(", ")}
                              )
                            </span>
                          )}
                        </span>
                        <span>{formatCurrency(item.total || 0)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() =>
                      navigate("/order-confirmation", {
                        state: {
                          orderId: order.orderId,
                          paymentStatus: order.paymentStatus,
                        },
                      })
                    }
                    className="px-4 py-2 text-sm font-semibold text-white rounded bg-amber-600 hover:bg-amber-700"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrderHistoryPage;