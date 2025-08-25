import React, { useEffect, useState } from "react";
import { getCartItemKey } from "../../utils/cart";

const OrderSummary = ({
  cartItems,
  selectedVouchers,
  discounts = {},
  discountAmount,
  shippingFee,
  formatCurrency,
  handleSubmit,
  error,
  loading,
  selectedOrderVoucher,
  orderDiscount,
}) => {
 const isFreeShipping = shippingFee <= 0;

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

  // Tính tổng giảm giá và subtotal sau giảm giá sản phẩm
  let totalDiscount = 0;
  const productTotals = cartItems.map((item) => {
    const cartItemKey = getCartItemKey(item);
    const itemVoucher = selectedVouchers?.[cartItemKey] || null;
    const itemDiscount = discounts?.[cartItemKey] || getVoucherValue(item.unitPrice || item.price, itemVoucher);

    totalDiscount += itemDiscount ;

    return {
      ...item,
      discount: itemDiscount ,
      totalAfterDiscount: Math.max((item.total) * item.quantity - itemDiscount * item.quantity, 0),
      appliedVoucher: itemVoucher,
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

      {productTotals.map((item, idx) => (
        <div key={idx} className="pb-2 mb-2 text-sm border-b">
          <div className="flex justify-between">
            <span>{item.productName || "Sản phẩm không xác định"}</span>
            <span>{formatCurrency((item.finalUnitPrice + item.itemAdditionalPrice) * item.quantity)}</span>
          </div>
          {item.appliedVoucher && (
            <div className="flex justify-between text-green-600">
              <span>Giảm ({item.appliedVoucher.name || "Voucher"}):</span>
              <span>-{formatCurrency(item.discount)}</span>
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-between mt-2 text-sm">
        <span>Tạm tính:</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <div className="flex justify-between mt-2 text-sm">
        <span>Phí vận chuyển:</span>
        <span>{isFreeShipping ? "Miễn phí" : formatCurrency(shippingFee)}</span>
      </div>

      {discountAmount > 0 && (
        <div className="flex justify-between mt-2 text-sm text-green-600">
          <span>Tổng chiết khấu sản phẩm:</span>
          <span>-{formatCurrency(discountAmount)}</span>
        </div>
      )}

      {selectedOrderVoucher && (
        <div className="flex justify-between mt-2 text-sm text-green-600">
          <span>Chiết khấu toàn đơn:</span>
          <span>-{formatCurrency(orderDiscount)}</span>
        </div>
      )}

      <div className="flex justify-between mt-2 font-bold text-lg">
        <span>Tổng cộng:</span>
        <span>{formatCurrency(total)}</span>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className={`w-full text-center btn-primary ${loading || productTotals.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading || productTotals.length === 0}
      >
        {loading ? "Đang xử lý..." : "Đặt mua ngay"}
      </button>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};


export default OrderSummary;
