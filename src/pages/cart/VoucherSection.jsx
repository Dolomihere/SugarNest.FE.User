import React, { useState, useEffect, useMemo } from "react";
import { getCartItemKey } from "../../utils/cart";

const VoucherSection = ({
  product,
  userVouchers,
  selectedVoucher,
  setSelectedVoucher,
  setDiscountForProduct,
  formatCurrency,
}) => {
  const [voucherId, setVoucherId] = useState(selectedVoucher?.voucherId || "");

  useEffect(() => {
    if (voucherId) {
      const voucher = userVouchers.find((v) => v.voucherId === voucherId);
      if (voucher) {
        const discount = Math.min(
          product.unitPrice * product.quantity,
          voucher.percentValue
            ? (product.unitPrice * product.quantity * voucher.percentValue) / 100
            : voucher.hardValue || 0
        );
        setSelectedVoucher(getCartItemKey(product), voucher);
        setDiscountForProduct(getCartItemKey(product), discount);
      }
    } else {
      setSelectedVoucher(getCartItemKey(product), null);
      setDiscountForProduct(getCartItemKey(product), 0);
    }
  }, [voucherId]);

  return (
    <div className="mt-2">
      <select
        value={voucherId}
        onChange={(e) => setVoucherId(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      >
        <option value="">Chọn voucher</option>
        {userVouchers.map((v) => (
          <option key={v.voucherId} value={v.voucherId}>
            {v.name} - Giảm{" "}
            {v.percentValue
              ? v.percentValue + "%"
              : formatCurrency(v.hardValue || 0)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VoucherSection;

