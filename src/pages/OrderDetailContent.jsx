import React from "react";
import { publicApi } from "../configs/AxiosConfig"; // Import để lấy baseURL

const paymentChannels = {
  0: "Chưa thanh toán",
  1: "Thanh toán khi nhận hàng",
  2: "Thanh toán online",
};

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
  const normalizedStatus = status?.toString();
  return statusMap[normalizedStatus] || { label: "Không xác định", bg: "bg-gray-200", text: "text-gray-600" };
};

const OrderDetailContent = ({ order, formatCurrency, formatDate }) => {
  const statusDisplay = getStatusInVietnamese(order?.status);

  // Lấy baseURL từ axios config để prepend vào đường dẫn hình ảnh (giả sử hình ảnh là relative path từ server)
  const baseURL = publicApi.defaults.baseURL || '';

  // Đồng bộ và ưu tiên các trường dữ liệu có thể từ server
  const subTotal = order.subTotal || order.subtotal || order.totalAmount || 0;
  const shippingFee = order.shippingFee || order.shippingCost || order.shipping || order.shipFee || 0;
  const voucherDiscount = order.voucherDiscountAmount || order.voucherDiscount || order.discountAmount || order.discount || order.voucherAmount || order.discountVoucher || 0;
  const total = subTotal + shippingFee - voucherDiscount;

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-[800px] bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">

          {/* Thông tin người nhận */}
          <section>
            <h3 className="pb-2 mb-4 text-2xl font-semibold text-gray-800 border-b">
              Thông tin người nhận
            </h3>
            <div className="grid grid-cols-1 gap-2 text-gray-700">
              <p><strong>Mã đơn hàng:</strong> {order.orderId}</p>
              <p><strong>Tên:</strong> {order.recipientName || order.customerName || "-"}</p>
              <p><strong>SĐT:</strong> {order.recipientPhone || order.phoneNumber || "-"}</p>
              <p><strong>Email:</strong> {order.recipientEmail || order.email || "-"}</p>
              <p><strong>Địa chỉ:</strong> {order.address || "-"}</p>
            </div>
          </section>

          {/* Thông tin đơn hàng */}
          <section>
            <h3 className="pb-2 mb-4 text-2xl font-semibold text-gray-800 border-b">
              Thông tin đơn hàng
            </h3>
            <div className="grid grid-cols-1 gap-2 text-gray-700">
              <p><strong>Ngày tạo:</strong> {formatDate(order.createdAt)}</p>
              <p><strong>Thời gian giao:</strong> {formatDate(order.deliveryTime)}</p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span className={`${statusDisplay.text} font-medium`}>{statusDisplay.label}</span>
              </p>
              <p><strong>Ghi chú:</strong> {order.note || "Không có"}</p>
              <p><strong>Đã thanh toán:</strong> {order.isPaid ? "Có" : "Chưa"}</p>
              <p><strong>Phương thức thanh toán:</strong>{" "}
                {paymentChannels[order.paymentChannel] || order.paymentMethod || "Không rõ"}
              </p>
            </div>
          </section>

          {/* Danh sách sản phẩm */}
          <section>
            <h3 className="pb-2 mb-4 text-2xl font-semibold text-gray-800 border-b">
              Danh sách sản phẩm
            </h3>
            <ul className="divide-y divide-gray-200">
              {order.orderItems?.length > 0 ? order.orderItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 py-4">
                  <img
                    src={
                      item.imgs?
                        `${item.imgs[0]}` 
                        : "/images/placeholder.png"
                    }
                    alt={item.productName}
                    className="object-cover w-20 h-20 border rounded-md"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{item.productName}</div>
                    {item.orderItemOptions?.length > 0 && (
                      <p className="text-sm text-gray-500">
                        {item.orderItemOptions.map(o => o.optionValue).join(", ")}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-amber-600">
                    {formatCurrency(item.unitPrice * item.quantity || item.total)}
                  </p>
                </li>
              )) : <p className="text-gray-400">Chưa có sản phẩm</p>}
            </ul>
          </section>

        </div>

        {/* Tổng kết đơn hàng */}
        <div className="p-6 space-y-2 text-right text-gray-700 bg-white border-t border-gray-200">
          <p><strong>Tạm tính:</strong> {formatCurrency(subTotal)}</p>
          <p><strong>Phí vận chuyển:</strong> {formatCurrency(shippingFee)}</p>
          <p><strong>Giảm giá:</strong> {formatCurrency(voucherDiscount)}</p>
          <p className="text-xl font-bold text-gray-800">
            Tổng thanh toán: <span className="text-amber-600">{formatCurrency(total)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailContent;