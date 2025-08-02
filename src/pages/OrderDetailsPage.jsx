import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import OrderService from "../services/OrderService";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";

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

  const mapOrderStatus = (statusCode) => {
    switch (statusCode) {
      case 0:
      case "Pending":
        return { label: "Đang xử lý", color: "text-yellow-600" };
      case 1:
      case "Completed":
        return { label: "Đã hoàn tất", color: "text-green-600" };
      case 2:
      case "Cancelled":
        return { label: "Đã hủy", color: "text-red-500" };
      default:
        return { label: "Không rõ", color: "text-gray-500" };
    }
  };

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
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] bg-[#fffaf3]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Chi tiết đơn hàng </h2>

        {isLoading && <p>Đang tải dữ liệu...</p>}
        {isError && <p className="text-red-600">Lỗi: {error.message}</p>}

        {order && (() => {
          const statusDisplay = mapOrderStatus(order.status);

          return (
            <div className="bg-white rounded-2xl shadow-md p-6 space-y-6 text-sm text-gray-800">
              {/* Thông tin người nhận */}
              <section>
                <h3 className="text-xl font-semibold mb-2">Thông tin người nhận</h3>
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="font-medium text-gray-700 p-3 w-1/3">Tên</td>
                      <td className="p-3">{order.recipientName}</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-700 p-3">Số điện thoại</td>
                      <td className="p-3">{order.recipientPhone}</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-700 p-3">Email</td>
                      <td className="p-3">{order.recipientEmail}</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-700 p-3">Địa chỉ</td>
                      <td className="p-3">{order.address}</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {/* Thông tin đơn hàng */}
              <section>
                <h3 className="text-xl font-semibold mb-2">Thông tin đơn hàng</h3>
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm mt-2">
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="font-medium text-gray-700 p-3 w-1/3">Ngày đặt</td>
                      <td className="p-3">{formatDate(order.createdAt)}</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-700 p-3">Trạng thái</td>
                      <td className={`p-3 ${statusDisplay.color}`}>{statusDisplay.label}</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-700 p-3">Ghi chú</td>
                      <td className="p-3">{order.note || "Không có"}</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-700 p-3">Đơn hàng tùy chỉnh</td>
                      <td className="p-3">{order.isCustomOrder ? "Có" : "Không"}</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-700 p-3">Đã thanh toán</td>
                      <td className="p-3">{order.isPaid ? "Có" : "Chưa"}</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {/* Danh sách sản phẩm */}
              <section>
                <h3 className="text-xl font-semibold mb-2">Danh sách sản phẩm</h3>
                <ul className="divide-y divide-gray-100">
                  {order.orderItems.map((item, index) => (
                    <li
                      key={item.productId || index}
                      className="py-4 flex items-center gap-4"
                    >
                      <img
                        src={item.imgs?.[0]}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                        <p className="text-sm text-gray-500">Đơn giá: {formatCurrency(item.unitPrice)}</p>
                      </div>
                      <p className="font-semibold text-amber-600">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Tổng tiền */}
              <section className="border-t pt-4 space-y-1 text-right">
                <p>
                  <span className="font-medium">Tạm tính:</span>{" "}
                  {formatCurrency(order.subTotal)}
                </p>
                <p>
                  <span className="font-medium">Phí vận chuyển:</span>{" "}
                  {formatCurrency(order.shippingFee)}
                </p>
                <p>
                  <span className="font-medium">Giảm giá voucher:</span>{" "}
                  {formatCurrency(order.voucherDiscountAmount)}
                </p>
                <p className="text-xl font-bold">
                  Tổng thanh toán:{" "}
                  <span className="text-amber-600">
                    {formatCurrency(order.total)}
                  </span>
                </p>
              </section>
            </div>
          );
        })()}
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
