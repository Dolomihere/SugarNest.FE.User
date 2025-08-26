import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import OrderService from "../services/OrderService";

const getStatusInVietnamese = (status) => {
  const statusMap = {
    "-2": { label: "Đã trả hàng", bg: "bg-red-100", text: "text-red-700" },
    "-1": { label: "Đã hủy", bg: "bg-red-100", text: "text-red-700" },
    0: {
      label: "Đang chờ xác nhận",
      bg: "bg-yellow-100",
      text: "text-yellow-800",
    },
    1: { label: "Đã xác nhận", bg: "bg-blue-100", text: "text-blue-800" },
    2: { label: "Đang xử lý", bg: "bg-yellow-100", text: "text-yellow-800" },
    3: { label: "Đang vận chuyển", bg: "bg-blue-100", text: "text-blue-800" },
    4: { label: "Đã giao hàng", bg: "bg-green-100", text: "text-green-800" },
  };
  return (
    statusMap[status?.toString()] || {
      label: "Không xác định",
      bg: "bg-gray-200",
      text: "text-gray-600",
    }
  );
};

const OrderHistory = ({ embedded = false }) => {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "decimal" }).format(value || 0) +
    " VND";

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
    fetchOrders(1, 12);
  }, [token]);

  const fetchOrders = async (pageIndex, pageSize) => {
    try {
      const historyRes = await OrderService.getOrderHistory(
        token,
        pageIndex,
        pageSize
      );
      const meta = historyRes?.meta;
      console.log("meta: ", meta);
      setTotalCount(meta.totalCount || 0);
      setPageIndex(meta.pageIndex || 1);
      setPageSize(meta.pageSize || 10);
      setOrders(historyRes.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Không thể tải lịch sử đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage !== pageIndex) {
      setPageIndex(newPage);
      setLoading(true);
      fetchOrders(newPage, 12);
    }
  };

  const content = (
    <div className="w-full">
      {!embedded && (
        <h2 className="text-3xl font-bold mb-8 text-center text-[#a17455]">
          Lịch sử đơn hàng
        </h2>
      )}
      {embedded && (
        <h2 className="text-2xl font-semibold mb-6 text-[#a17455]">
          Lịch sử đơn hàng
        </h2>
      )}

      {loading && <p className="text-center">Đang tải đơn hàng...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && orders.length === 0 && (
        <p className="text-center">Bạn chưa có đơn hàng nào.</p>
      )}

      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-1 mt-8 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => {
            const status = getStatusInVietnamese(order.status);
            return (
              <div
                key={order.orderId}
                className="p-6 bg-white border border-[#eaded2] rounded-xl shadow-md hover:shadow-xl transition duration-300 ease-in-out"
              >
                {/* Header */}
                <div className="mb-2">
                  <h3 className="text-xl font-bold text-[#7b553c] tracking-tight line-clamp-2 break-words">
                    🧾 Đơn hàng #{order.orderId}
                  </h3>
                </div>

                {/* Status */}
                {/* <div className="mb-4">
                  <span
                    className={`inline-block text-xs font-semibold rounded-sm px-3 py-1 ${status.bg} ${status.text} shadow-sm`}
                  >
                    {status.label}
                  </span>
                </div> */}

                {/* Info */}
                <div className="mb-4 text-sm text-gray-700 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">🚚 Trạng thái:</span>
                    <span className="text-[#5e5045] font-medium">
                      <span
                        className={`inline-block text-xs font-semibold rounded-sm px-3 py-1 ${status.bg} ${status.text} shadow-sm`}
                      >
                        {status.label}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">💶 Tình trạng thanh toánt:</span>
                    <span className="text-[#5e5045] font-extrabold">
                      {order.isRefundedAfterFulfillment  == true? (<span className="text-yellow-600 ">Hoàn tiền</span>) : order.isPaid==true? (<span className="text-green-600 ">Đã thanh toán</span>) : (<span className="text-gray-600 ">Chưa thanh toán</span>)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">📅 Ngày đặt:</span>
                    <span className="text-[#5e5045] font-medium">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">💰 Tổng thanh toán:</span>
                    <span className="text-[#d48d57] font-semibold">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => navigate(`/order/${order.orderId}`)}
                  className="w-full text-sm font-medium text-[#a17455] border border-[#d6a97e] px-4 py-2 rounded-lg hover:bg-[#f5e9dc] transition duration-200 ease-in-out"
                >
                  🔍 Xem chi tiết
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!loading && totalCount > pageSize && (
        <div className="mt-8 flex justify-center items-center gap-2">
          {Array.from({
            length: Math.ceil(totalCount / pageSize),
          }).map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded border ${
                  page === pageIndex
                    ? "bg-[#a17455] text-white border-[#a17455]"
                    : "bg-white text-[#a17455] border-[#d6a97e] hover:bg-[#f5e9dc]"
                } transition`}
              >
                {page}
              </button>
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
      <main className="w-full px-6 py-10 mx-auto max-w-7xl min-h-[100vh]">
        {content}
      </main>
      <Footer />
    </div>
  );
};

export default OrderHistory;
