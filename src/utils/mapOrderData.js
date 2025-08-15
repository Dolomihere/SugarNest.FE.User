// utils/mapOrderData.js
export const mapOrderData = (raw) => {
  if (!raw) return null;

  return {
    ...raw,
    // Log để kiểm tra xem API trả về gì
    __debug: console.log("Mapping order data:", raw),
    subTotal: Number(
      raw.subTotal ??
      raw.subtotal ??
      raw.items_total ??
      raw.totalPrice ??
      0
    ),
    shippingFee: Number(
      raw.shippingFee ??
      raw.ship_fee ??
      raw.ship_cost ??
      0
    ),
    voucherDiscountAmount: Number(
      raw.voucherDiscountAmount ??
      raw.discount ??
      raw.voucher_value ??
      0
    ),
  };
};
