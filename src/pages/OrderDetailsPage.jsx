import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import OrderService from "../services/OrderService";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";

// Ánh xạ trạng thái đơn hàng sang tiếng Việt với màu sắc dễ thương
const getStatusInVietnamese = (status) => {
  const statusMap = {
    "-2": { label: "Đã trả hàng", bg: "bg-pink-100", text: "text-pink-600", border: "border-pink-300" },
    "-1": { label: "Đã hủy", bg: "bg-pink-100", text: "text-pink-600", border: "border-pink-300" },
    0: { label: "Đang chờ xác nhận", bg: "bg-yellow-100", text: "text-yellow-600", border: "border-yellow-300" },
    1: { label: "Đã xác nhận", bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-300" },
    2: { label: "Đang xử lý", bg: "bg-yellow-100", text: "text-yellow-600", border: "border-yellow-300" },
    3: { label: "Đang vận chuyển", bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-300" },
    4: { label: "Đã giao hàng", bg: "bg-green-100", text: "text-green-600", border: "border-green-300" },
  };
  const normalizedStatus = status?.toString();
  return statusMap[normalizedStatus] || {
    label: "Không xác định",
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-300",
  };
};

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const token = localStorage.getItem("accessToken");

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orderDetail", orderId],
    queryFn: () => OrderService.getOrderById(orderId, token),
    enabled: !!orderId && !!token,
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
    <div className="min-h-screen bg-[#fffaf3] text-gray-800">
      <Header />
      <main className="container max-w-4xl px-4 py-10 mx-auto sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-[#a17455] mb-8 tracking-wide">
          Chi tiết đơn hàng
        </h2>

        {isLoading && (
          <div className="text-center text-[#a17455] text-lg font-medium animate-pulse bg-[#fef7e8] p-4 rounded-2xl border border-[#eaded2]">
            Đang tải dữ liệu...
          </div>
        )}
        {isError && (
          <div className="p-4 text-lg font-medium text-center text-pink-600 border border-pink-200 bg-pink-50 rounded-2xl">
            Lỗi: {error.message}
          </div>
        )}

        {order && (
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 space-y-8 border border-[#eaded2]">
            {/* Thông tin người nhận */}
            <section>
              <h3 className="text-xl font-semibold text-[#a17455] mb-4">Thông tin người nhận</h3>
              <div className="border border-[#eaded2] rounded-2xl overflow-hidden bg-[#fffaf3]">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-[#eaded2]">
                    {[
                      { label: "Tên", value: order.recipientName || "Không có" },
                      { label: "Số điện thoại", value: order.recipientPhone || "Không có" },
                      { label: "Email", value: order.recipientEmail || "Không có" },
                      { label: "Địa chỉ", value: order.address || "Không có" },
                    ].map((item, index) => (
                      <tr key={index} className="hover:bg-[#fef7e8] transition-colors duration-200">
                        <td className="w-1/3 p-4 font-medium text-[#7b553c] bg-[#fef7e8]">{item.label}</td>
                        <td className="p-4 text-gray-700">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Thông tin đơn hàng */}
            <section>
              <h3 className="text-xl font-semibold text-[#a17455] mb-4">Thông tin đơn hàng</h3>
              <div className="border border-[#eaded2] rounded-2xl overflow-hidden bg-[#fffaf3]">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-[#eaded2]">
                    {[
                      { label: "Ngày đặt", value: formatDate(order.createdAt) },
                      { label: "Ngày giao hàng", value: formatDate(order.deliveryTime) },
                      {
                        label: "Trạng thái",
                        value: (
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusInVietnamese(order.status).bg} ${getStatusInVietnamese(order.status).text} border ${getStatusInVietnamese(order.status).border}`}
                          >
                            {getStatusInVietnamese(order.status).label}
                          </span>
                        ),
                      },
                      { label: "Ghi chú", value: order.note || "Không có" },
                      { label: "Đơn hàng tùy chỉnh", value: order.isCustomOrder ? "Có" : "Không" },
                      { label: "Đã thanh toán", value: order.isPaid ? "Có" : "Chưa" },
                    ].map((item, index) => (
                      <tr key={index} className="hover:bg-[#fef7e8] transition-colors duration-200">
                        <td className="w-1/3 p-4 font-medium text-[#7b553c] bg-[#fef7e8]">{item.label}</td>
                        <td className="p-4 text-gray-700">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Danh sách sản phẩm */}
            <section>
              <h3 className="text-xl font-semibold text-[#a17455] mb-4">Danh sách sản phẩm</h3>
              <div className="border border-[#eaded2] rounded-2xl overflow-hidden bg-[#fffaf3]">
                <ul className="divide-y divide-[#eaded2]">
                  {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                    order.orderItems.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-4 p-4 hover:bg-[#fef7e8] transition-colors duration-200"
                      >
                        <img
                          src={item.imgs?.[0] || "/images/placeholder.png"}
                          alt={item.productName || "Sản phẩm"}
                          className="w-16 h-16 object-cover rounded-lg border border-[#eaded2] shadow-sm"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-[#a17455] truncate">{item.productName || "Không có tên"}</p>
                          <p className="text-sm text-gray-600">Số lượng: {item.quantity || 0}</p>
                          <p className="text-sm text-gray-600">Đơn giá: {formatCurrency(item.unitPrice)}</p>
                        </div>
                        <p className="font-semibold text-[#d48d57]">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </p>
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-center text-gray-600">Không có sản phẩm trong đơn hàng</li>
                  )}
                </ul>
              </div>
            </section>

            {/* Tổng tiền */}
            <section className="border-t border-[#eaded2] pt-6 text-right space-y-3">
              {[
                { label: "Tạm tính", value: formatCurrency(order.subTotal) },
                { label: "Phí vận chuyển", value: formatCurrency(order.shippingFee) },
                { label: "Giảm giá", value: formatCurrency(order.voucherDiscountAmount) },
              ].map((item, index) => (
                <p key={index} className="text-sm">
                  <span className="font-medium text-[#7b553c]">{item.label}:</span>{" "}
                  <span className="text-gray-700">{item.value}</span>
                </p>
              ))}
              <p className="text-lg font-bold text-[#a17455]">
                Tổng thanh toán: <span className="text-[#d48d57]">{formatCurrency(order.total)}</span>
              </p>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetailsPage;