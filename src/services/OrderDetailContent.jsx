import React from "react";

const OrderDetailContent = ({ order, formatCurrency, formatDate }) => {
  const statusMap = {
    0: { label: "Đang xử lý", color: "text-yellow-500" },
    1: { label: "Đã hoàn tất", color: "text-green-500" },
    2: { label: "Đã hủy", color: "text-red-500" },
    Pending: { label: "Đang xử lý", color: "text-yellow-500" },
    Completed: { label: "Đã hoàn tất", color: "text-green-500" },
    Cancelled: { label: "Đã hủy", color: "text-red-500" },
  };

  const statusDisplay = statusMap[order?.status] || {
    label: "Không rõ",
    color: "text-gray-400",
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-8 bg-gray-100">
      <div className="w-full max-w-[800px] h-[700px] bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Nội dung scroll */}
        <div className="flex-1 p-6 overflow-y-auto">
          <section className="mb-6">
            <h3 className="pb-2 mb-4 text-2xl font-semibold text-gray-800 border-b">
              Thông tin người nhận
            </h3>
            <div className="grid grid-cols-1 gap-3 text-gray-700">
              <p><strong className="font-medium">Tên:</strong> {order.recipientName}</p>
              <p><strong className="font-medium">SĐT:</strong> {order.recipientPhone}</p>
              <p><strong className="font-medium">Email:</strong> {order.recipientEmail}</p>
              <p><strong className="font-medium">Địa chỉ:</strong> {order.address}</p>
            </div>
          </section>

          {/* Thông tin đơn hàng */}
          <section className="mb-6">
            <h3 className="pb-2 mb-4 text-2xl font-semibold text-gray-800 border-b">
              Thông tin đơn hàng
            </h3>
            <div className="grid grid-cols-1 gap-3 text-gray-700">
              <p><strong className="font-medium">Ngày đặt:</strong> {formatDate(order.createdAt)}</p>
              <p>
                <strong className="font-medium">Trạng thái:</strong>{" "}
                <span className={`${statusDisplay.color} font-medium`}>
                  {statusDisplay.label}
                </span>
              </p>
              <p><strong className="font-medium">Thời gian giao:</strong> {formatDate(order.deliveryTime)}</p>
              <p><strong className="font-medium">Ghi chú:</strong> {order.note || "Không có"}</p>
              <p><strong className="font-medium">Đã thanh toán:</strong> {order.isPaid ? "Có" : "Chưa"}</p>
              <p>
                <strong className="font-medium">Phương thức thanh toán:</strong>{" "}
                {order.paymentChannel || order.paymentMethod || "Không rõ"}
              </p>
            </div>
          </section>

          {/* Danh sách sản phẩm */}
          <section className="mb-6">
            <h3 className="pb-2 mb-4 text-2xl font-semibold text-gray-800 border-b">
              Danh sách sản phẩm
            </h3>
            <ul className="divide-y divide-gray-200">
              {order.orderItems?.map((item, index) => (
                <li key={index} className="flex items-start gap-4 py-4">
                  <img
                    src={item.imgs?.[0] || item.productImage || "/images/placeholder.png"}
                    alt={item.productName}
                    className="object-cover w-20 h-20 border border-gray-200 rounded-md"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.productName}</p>
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
        </div>

        {/* Tổng kết đơn hàng */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="space-y-2 text-right text-gray-700">
            <p>
              <strong className="font-medium">Tạm tính:</strong>{" "}
              {formatCurrency(order.subTotal || order.subtotal)}
            </p>
            <p>
              <strong className="font-medium">Phí vận chuyển:</strong>{" "}
              {formatCurrency(order.shippingFee)}
            </p>
            <p>
              <strong className="font-medium">Giảm giá voucher:</strong>{" "}
              {formatCurrency(order.voucherDiscountAmount || order.discount)}
            </p>
            <p className="text-xl font-bold text-gray-800">
              Tổng thanh toán:{" "}
              <span className="text-amber-600">{formatCurrency(order.total)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailContent;
