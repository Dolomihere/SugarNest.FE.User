import React from "react";
import { getCartItemKey } from "../../utils/cart";

const OrderSummary = ({
  cartItems,
  selectedVouchers,
  discounts = {},
  shippingFee,
  formatCurrency,
  handleSubmit,
  error,
  loading,
}) => {
  const isFreeShipping = shippingFee <= 0;

  // Hàm tính giá trị giảm
  const getVoucherValue = (unitPrice, voucher) => {
    if (!voucher) return 0;
    let discount = 0;

    if (voucher.percentValue && voucher.percentValue > 0) {
      discount = (unitPrice * voucher.percentValue) / 100;
    }
    if (voucher.hardValue && voucher.hardValue > 0) {
      discount = Math.max(discount, voucher.hardValue);
    }
    // Không giảm quá giá gốc
    return Math.min(discount, unitPrice);
  };

  // Tính tổng và giảm giá
  let totalDiscount = 0;
 const productTotals = cartItems.map((item) => {
  const cartItemKey = getCartItemKey(item);
  const itemDiscount = discounts?.[cartItemKey] || 0;
  totalDiscount += itemDiscount;

   return {
    ...item,
    discount: itemDiscount,
    totalAfterDiscount: Math.max(item.unitPrice * item.quantity - itemDiscount, 0),
    appliedVoucher: selectedVouchers?.[cartItemKey] || null,
  };
});

  const subtotal = productTotals.reduce(
    (sum, p) => sum + p.total,
    0
  );
  const total = subtotal + (isFreeShipping ? 0 : shippingFee);
  
  return (
    <div className="p-6 space-y-4 bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-semibold text-heading">Đơn hàng của bạn</h2>

      {productTotals.length === 0 ? (
        <p className="text-sm text-gray-600">Giỏ hàng trống</p>
      ) : (
        productTotals.map((item, index) => (
          <div key={index} className="pb-2 mb-2 text-sm border-b">
            <div className="flex justify-between">
              <span>{item.productName}</span>
              <span>{formatCurrency(item.total)}</span>
            </div>
            {item.appliedVoucher && (
              <div className="flex justify-between text-green-600">
                <span>Giảm ({item.appliedVoucher.name}):</span>
                <span>-{formatCurrency(item.discount)}</span>
              </div>
            )}
          </div>
        ))
      )}

      <div className="flex justify-between mt-2 text-sm">
        <span>Phí vận chuyển:</span>
        <span>{isFreeShipping ? "Miễn phí" : formatCurrency(shippingFee)}</span>
      </div>

      {totalDiscount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Tổng giảm giá:</span>
          <span>-{formatCurrency(totalDiscount)}</span>
        </div>
      )}

      <div className="flex justify-between pt-2 text-base font-bold border-t text-amber-600">
        <span>Tổng thanh toán:</span>
        <span>{formatCurrency(total)}</span>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full text-center btn-primary"
        disabled={loading || productTotals.length === 0}
      >
        {loading ? "Đang xử lý..." : "Đặt mua ngay"}
      </button>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default OrderSummary;
