import React from "react";

const OrderSummary = ({
  cartItems,
  selectedVoucher,
  discount,
  subtotal,
  discountAmount,
  total,
  shippingFee,
  formatCurrency,
  handleSubmit,
  error,
  loading,
}) => {
const isFreeShipping = shippingFee <= 0;


  return (
    <div className="p-6 space-y-4 bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-semibold text-heading">Đơn hàng của bạn</h2>
      {cartItems.length === 0 ? (
        <p className="text-sm text-gray-600">Giỏ hàng trống</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.productName}</span>
            <span>{formatCurrency(item.total)}</span>
          </div>
        ))
      )}
      <div className="flex justify-between mt-2 text-sm">
        <span>Phí vận chuyển:</span>
        <span>{shippingFee <= 0 ? "Miễn phí" : formatCurrency(shippingFee)}</span>
      </div>
      {discount > 0 || (selectedVoucher?.hardValue && selectedVoucher) ? (
        <div className="flex justify-between text-sm text-green-600">
          <span>Giảm giá ({selectedVoucher?.name || "Voucher"}):</span>
          <span>-{formatCurrency(discountAmount)}</span>
        </div>
      ) : null}
      <div className="flex justify-between pt-2 text-base font-bold border-t text-amber-600">
        <span>Tổng thanh toán:</span>
        <span>{formatCurrency(total)}</span>
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full text-center btn-primary"
        disabled={loading || cartItems.length === 0}
      >
        {loading ? "Đang xử lý..." : "Đặt mua ngay"}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default OrderSummary;
