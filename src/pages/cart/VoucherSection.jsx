import React, { useState, useEffect } from "react";
import { getCartItemKey } from "../../utils/cart"; // thêm import

const VoucherSection = ({
  product,
  userVouchers,
  selectedVoucher,
  setSelectedVoucher,
  setDiscountForProduct,
  formatCurrency
}) => {
  const [voucherId, setVoucherId] = useState(selectedVoucher?.voucherId || "");
  const [voucher, setVoucher] = useState(selectedVoucher || null);

  const cartItemKey = getCartItemKey(product); // dùng key thống nhất


  // Đóng dropdown khi nhấp ra ngoài
  useEffect(() => {
    const found = userVouchers.find(v => v.voucherId === voucherId);
    if (found) {
      setVoucher(found);
    } else {
      setVoucher(null);
    }
  }, [voucherId, userVouchers]);

  const isVoucherValid = () => {
    if (!voucher) return false;
    if (voucher.productId && voucher.productId !== product.productId) {
      return false;

   
    }
    if (
      voucher.minQuantity > product.quantity ||
      voucher.maxQuantity < product.quantity
    ) {
      return false;
    }
    return true;
  };

  const getVoucherValue = (unitPrice, voucher) => {
    if (!voucher) return 0;

    let discount = 0;
    if (voucher.percentValue && voucher.percentValue > 0) {
      discount = (unitPrice * voucher.percentValue) / 100;
    }
    if (voucher.hardValue && voucher.hardValue > 0) {
      discount = Math.max(discount, voucher.hardValue);
    }
    discount = Math.min(discount, unitPrice);
    return Math.round(discount);
  };

  const calculateProductTotal = (unitPrice, quantity, discountPerUnit) => {
    const total = (unitPrice - discountPerUnit) * quantity;
    return Math.max(Math.round(total * 100) / 100, 0);
  };

  const applyVoucher = () => {
    if (isVoucherValid()) {
      const discountPerUnit = getVoucherValue(product.unitPrice, voucher);
      const totalDiscount = discountPerUnit * product.quantity;
      setSelectedVoucher(cartItemKey, voucher); // truyền kèm key
      setDiscountForProduct(cartItemKey, totalDiscount);
    } else {
      setSelectedVoucher(cartItemKey, null);
      setDiscountForProduct(cartItemKey, 0);
    }
  };

  useEffect(() => {
    applyVoucher();
  }, [voucher, product.quantity]);

  return (
    <div className="voucher-section mt-2">
      <label>Chọn voucher cho sản phẩm:</label>
      <select
        className="border rounded p-1 ml-2"
        value={voucherId}
        onChange={(e) => setVoucherId(e.target.value)}
      >
        <option value="">Không áp dụng</option>
       {[...new Map(
          userVouchers
            .filter(v => v.productId === product.productId)
            .map(v => [v.voucherId, v]) // voucherId làm key trong Map → loại trùng
        ).values()].map(v => (
          <option 
            key={`${v.voucherId}-${cartItemKey}`} 
            value={v.voucherId}

          >
            {v.name} -{" "}
            {v.percentValue
              ? `${v.percentValue}%`
              : `${formatCurrency(v.hardValue)}`}
          </option>
        ))}

      </select>

      {isVoucherValid() && voucher && (
        <p className="text-green-600 mt-1">
          Giảm:{" "}
          {formatCurrency(getVoucherValue(product.unitPrice, voucher) * product.quantity)} (
          Tổng còn:{" "}
          {formatCurrency(
            calculateProductTotal(
              product.unitPrice,
              product.quantity,
              getVoucherValue(product.unitPrice, voucher)
            )
          )}
          )
        </p>
      )}

      {!isVoucherValid() && voucher && (
        <p className="text-red-600 mt-1">
          Voucher không hợp lệ với số lượng hiện tại
        </p>
      )}
    </div>
  );
};

export default VoucherSection;
