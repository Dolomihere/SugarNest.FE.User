// OrderDetailContent.jsx
import React from "react";

const paymentChannels = {
  0: "Chưa thanh toán",
  1: "Thanh toán khi nhận hàng",
  2: "Thanh toán online",
};

const statusMap = {
  0: { label: "Đang xử lý", color: "text-yellow-500" },
  1: { label: "Đã hoàn tất", color: "text-green-500" },
  2: { label: "Đã hủy", color: "text-red-500" },
};

const OrderDetailContent = ({ order, formatCurrency, formatDate }) => {
  const statusDisplay = statusMap[order?.status] || {
    label: "Không có trạng thái",
    color: "text-gray-400",
  };

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-[800px] bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto space-y-6">

          {/* Thông tin người nhận */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Thông tin người nhận
            </h3>
            <div className="grid grid-cols-1 gap-2 text-gray-700">
              <p><strong>Tên:</strong> {order.recipientName || order.customerName || "-"}</p>
              <p><strong>SĐT:</strong> {order.recipientPhone || order.phoneNumber || "-"}</p>
              <p><strong>Email:</strong> {order.recipientEmail || order.email || "-"}</p>
              <p><strong>Địa chỉ:</strong> {order.address || "-"}</p>
            </div>
          </section>

          {/* Thông tin đơn hàng */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Thông tin đơn hàng
            </h3>
            <div className="grid grid-cols-1 gap-2 text-gray-700">
              <p><strong>Ngày tạo:</strong> {formatDate(order.createdAt)}</p>
              <p><strong>Thời gian giao:</strong> {formatDate(order.deliveryTime)}</p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span className={`${statusDisplay.color} font-medium`}>{statusDisplay.label}</span>
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
            <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Danh sách sản phẩm
            </h3>
            <ul className="divide-y divide-gray-200">
              {order.orderItems?.length > 0 ? order.orderItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 py-4">
                  <img
                    src={item.imgs?.[0] || item.productImage || "/images/placeholder.png"}
                    alt={item.productName}
                    className="object-cover w-20 h-20 border rounded-md"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.productName}</p>
                    {item.cartItemOptions?.length > 0 && (
                      <p className="text-sm text-gray-500">
                        {item.cartItemOptions.map(o => o.optionValue).join(", ")}
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
        <div className="p-6 bg-white border-t border-gray-200 text-right text-gray-700 space-y-2">
          <p><strong>Tạm tính:</strong> {formatCurrency(order.subTotal || order.subtotal || 0)}</p>
          <p><strong>Phí vận chuyển:</strong> {formatCurrency(order.shippingFee || 0)}</p>
          <p><strong>Giảm giá voucher:</strong> {formatCurrency(order.voucherDiscountAmount || order.discount || 0)}</p>
          <p className="text-xl font-bold text-gray-800">
            Tổng thanh toán: <span className="text-amber-600">{formatCurrency((order.subTotal || order.subtotal || 0) + (order.shippingFee || 0) - (order.voucherDiscountAmount || order.discount || 0))}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailContent;
