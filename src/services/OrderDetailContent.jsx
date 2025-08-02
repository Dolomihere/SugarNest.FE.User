import React from "react";

const OrderDetailContent = ({ order, formatCurrency, formatDate }) => {
  const statusMap = {
    0: { label: "Đang xử lý", color: "text-yellow-600" },
    1: { label: "Đã hoàn tất", color: "text-green-600" },
    2: { label: "Đã hủy", color: "text-red-600" },
    Pending: { label: "Đang xử lý", color: "text-yellow-600" },
    Completed: { label: "Đã hoàn tất", color: "text-green-600" },
    Cancelled: { label: "Đã hủy", color: "text-red-600" },
  };

  const statusDisplay = statusMap[order?.status] || {
    label: "Không rõ",
    color: "text-gray-500",
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <section>
        <h3 className="text-xl font-semibold mb-2">Thông tin người nhận</h3>
        <p><strong>Tên:</strong> {order.recipientName}</p>
        <p><strong>SĐT:</strong> {order.recipientPhone}</p>
        <p><strong>Email:</strong> {order.recipientEmail}</p>
        <p><strong>Địa chỉ:</strong> {order.address}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-6 mb-2">Thông tin đơn hàng</h3>
        <p><strong>Ngày đặt:</strong> {formatDate(order.createdAt)}</p>
        <p><strong>Trạng thái:</strong> <span className={statusDisplay.color}>{statusDisplay.label}</span></p>
        <p><strong>Thời gian giao:</strong> {formatDate(order.deliveryTime)}</p>
        <p><strong>Ghi chú:</strong> {order.note || "Không có"}</p>
        <p><strong>Đã thanh toán:</strong> {order.isPaid ? "Có" : "Chưa"}</p>
        <p><strong>Phương thức thanh toán:</strong> {order.paymentChannel || order.paymentMethod || "Không rõ"}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-6 mb-2">Danh sách sản phẩm</h3>
        <ul className="divide-y">
          {order.orderItems?.map((item, index) => (
            <li key={index} className="py-4 flex items-center gap-4">
              <img
                src={item.imgs?.[0] || item.productImage || "/images/placeholder.png"}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                {item.cartItemOptions?.length > 0 && (
                  <p className="text-sm text-gray-500">
                    {item.cartItemOptions.map((opt) => opt.optionValue).join(", ")}
                  </p>
                )}
                <p className="text-sm text-gray-500">SL: {item.quantity}</p>
              </div>
              <p className="font-semibold text-amber-600">
                {formatCurrency(item.unitPrice * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t pt-4 space-y-1 text-right">
        <p><strong>Tạm tính:</strong> {formatCurrency(order.subTotal || order.subtotal)}</p>
        <p><strong>Phí vận chuyển:</strong> {formatCurrency(order.shippingFee)}</p>
        <p><strong>Giảm giá voucher:</strong> {formatCurrency(order.voucherDiscountAmount || order.discount)}</p>
        <p className="text-xl font-bold">
          Tổng thanh toán: <span className="text-amber-600">{formatCurrency(order.total)}</span>
        </p>
      </section>
    </div>
  );
};

export default OrderDetailContent;
