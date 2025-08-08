import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import OrderService from "../services/OrderService";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";

const getStatusInVietnamese = (status) => {
  const statusMap = {
    "-2": { icon: "fa-rotate-left", label: "Đã trả hàng", bg: "bg-pink-100", text: "text-pink-600", border: "border-pink-300" },
    "-1": { icon: "fa-xmark", label: "Đã hủy", bg: "bg-pink-100", text: "text-pink-600", border: "border-pink-300" },
    0: { icon: "fa-clock", label: "Đang chờ xác nhận", bg: "bg-yellow-100", text: "text-yellow-600", border: "border-yellow-300" },
    1: { icon: "fa-check", label: "Đã xác nhận", bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-300" },
    2: { icon: "fa-hammer", label: "Đang xử lý", bg: "bg-yellow-100", text: "text-yellow-600", border: "border-yellow-300" },
    3: { icon: "fa-truck", label: "Đang vận chuyển", bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-300" },
    4: { icon: "fa-box", label: "Đã giao hàng", bg: "bg-green-100", text: "text-green-600", border: "border-green-300" },
  };
  const normalizedStatus = status?.toString();
  return statusMap[normalizedStatus] || {
    icon: "fa-question",
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

  const renderTable = (rows) => (
    <div className="border border-[#e2d8c5] rounded-xl overflow-hidden bg-[#fffefb]">
      <table className="w-full text-sm text-gray-700 font-light leading-relaxed tracking-wide">
        <tbody className="divide-y divide-[#f0e6d9]">
          {rows.map((item, index) => (
            <tr key={index} className="hover:bg-[#fef9f1] transition duration-200">
              <td className="w-1/3 p-4 font-medium text-[#7b553c] bg-[#fff7ec] border border-[#f0e6d9]">
                {item.label}
              </td>
              <td className="p-4 font-normal text-gray-800 border border-[#f0e6d9] bg-white">
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffaf3] text-gray-800">
      <Header />
      <main className="container max-w-4xl px-4 py-10 mx-auto sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-[#a17455] mb-8 tracking-wide">
          Chi tiết đơn hàng
        </h2>

        {isLoading && (
          <div className="animate-pulse text-center text-[#a17455] text-lg font-medium bg-[#fef7e8] p-4 rounded-2xl border border-[#eaded2]">
            <i className="fa-solid fa-spinner animate-spin mr-2"></i>Đang tải dữ liệu...
          </div>
        )}

        {isError && (
          <div className="p-4 text-lg font-medium text-center text-pink-600 border border-pink-200 bg-pink-50 rounded-2xl">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
            Lỗi: {error.message}
          </div>
        )}

        {order && (
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 space-y-10 border border-[#eaded2]">
            {/* Thông tin người nhận */}
            <section>
              <h3 className="text-xl font-semibold text-[#a17455] mb-4 flex items-center gap-2">
                <i className="fa-solid fa-user"></i> Thông tin người nhận
              </h3>
              {renderTable([
                { label: "Tên", value: order.recipientName || "Không có" },
                { label: "Số điện thoại", value: order.recipientPhone || "Không có" },
                { label: "Email", value: order.recipientEmail || "Không có" },
                { label: "Địa chỉ", value: order.address || "Không có" },
              ])}
            </section>

            {/* Thông tin đơn hàng */}
            <section>
              <h3 className="text-xl font-semibold text-[#a17455] mb-4 flex items-center gap-2">
                <i className="fa-solid fa-file-lines"></i> Thông tin đơn hàng
              </h3>
              {renderTable([
                { label: "Ngày đặt", value: formatDate(order.createdAt) },
                { label: "Ngày giao hàng", value: formatDate(order.deliveryTime) },
                {
                  label: "Trạng thái",
                  value: (
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusInVietnamese(order.status).bg} ${getStatusInVietnamese(order.status).text} border ${getStatusInVietnamese(order.status).border}`}
                    >
                      <i className={`fa-solid ${getStatusInVietnamese(order.status).icon}`}></i>
                      {getStatusInVietnamese(order.status).label}
                    </span>
                  ),
                },
                { label: "Ghi chú", value: order.note || "Không có" },
                { label: "Đơn hàng tùy chỉnh", value: order.isCustomOrder ? "Có" : "Không" },
                { label: "Đã thanh toán", value: order.isPaid ? "Có" : "Chưa" },
              ])}
            </section>

            {/* Danh sách sản phẩm */}
            <section>
              <h3 className="text-xl font-semibold text-[#a17455] mb-4 flex items-center gap-2">
                <i className="fa-solid fa-box-open"></i> Danh sách sản phẩm
              </h3>
              <div className="border border-[#e2d8c5] rounded-xl overflow-hidden bg-[#fffefb]">
                <ul className="divide-y divide-[#f0e6d9]">
                  {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                    order.orderItems.map((item, index) => (
                      <li
                        key={index}
                        className="flex flex-wrap md:flex-nowrap items-start gap-4 p-4 hover:bg-[#fef9f1] transition-transform duration-200"
                      >
                        <img
                          src={item.imgs?.[0] || "/images/placeholder.png"}
                          alt={item.productName || "Sản phẩm"}
                          className="w-16 h-16 object-cover rounded-lg border border-[#eaded2] shadow-sm transform hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-[50%]">
                          <p className="font-semibold text-[#a17455] truncate">{item.productName || "Không có tên"}</p>
                          <p className="text-sm text-gray-600">Số lượng: {item.quantity || 0}</p>
                          <p className="text-sm text-gray-600">Đơn giá: {formatCurrency(item.unitPrice)}</p>
                        </div>
                        <p className="font-semibold text-[#d48d57] text-right tabular-nums">
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
            <section className="border-t border-[#eaded2] pt-6 text-right space-y-3 text-sm leading-loose">
              {[
                { label: "Tạm tính", value: formatCurrency(order.subTotal) },
                { label: "Phí vận chuyển", value: formatCurrency(order.shippingFee) },
                { label: "Giảm giá", value: formatCurrency(order.voucherDiscountAmount) },
              ].map((item, index) => (
                <p key={index}>
                  <span className="font-medium text-[#7b553c]">{item.label}:</span>{" "}
                  <span className="text-gray-700 tabular-nums">{item.value}</span>
                </p>
              ))}
              <p className="text-lg font-bold text-[#a17455]">
                Tổng thanh toán: <span className="text-[#d48d57] tabular-nums">{formatCurrency(order.total)}</span>
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
