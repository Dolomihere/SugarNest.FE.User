import React, { useMemo, useEffect, useState } from "react";

export function VoucherSelect({ productId, productQuantity, list = [], onSelect }) {
  const now = new Date();
  // const [selectedId, setSelectedId] = useState("");

  // lọc voucher khả dụng
  // const availableVouchers = useMemo(() => {
  //   return list.filter((item) => {
  //     const start = new Date(item.startTime);
  //     const end = new Date(item.endTime);

  //     return (
  //       !item.isUsed &&
  //       item.productId === productId &&
  //       productQuantity >= item.minQuantity &&
  //       productQuantity <= item.maxQuantity &&
  //       now >= start &&
  //       now <= end
  //     );
  //   });
  // }, [list, productId, productQuantity]);

  // tìm voucher tốt nhất
  // const bestVoucher = useMemo(() => {
  //   if (availableVouchers.length === 0) return null;
  //   return availableVouchers.reduce((best, current) => {
  //     // Nếu current là % và best là số tiền -> chọn current
  //     if (current.percentValue > 0 && best.percentValue === 0) {
  //       return current;
  //     }
  //     // Nếu cả 2 đều % -> chọn % cao hơn
  //     if (current.percentValue > 0 && best.percentValue > 0) {
  //       return current.percentValue > best.percentValue ? current : best;
  //     }
  //     // Nếu cả 2 đều số tiền -> chọn giá trị lớn hơn
  //     if (current.hardValue > best.hardValue) {
  //       return current;
  //     }
  //     return best;
  //   });
  // }, [availableVouchers]);

  // auto chọn voucher tốt nhất khi render
  // useEffect(() => {
  //   if (bestVoucher) {
  //     setSelectedId(bestVoucher.itemVoucherId);
  //     if (onSelect) onSelect(bestVoucher);
  //   } else {
  //     setSelectedId("");
  //     if (onSelect) onSelect(null);
  //   }
  // }, [bestVoucher, onSelect]);

  const handleChange = (e) => {
    const value = e.target.value;
    // setSelectedId(value);
    if (onSelect) {
      // const selected = availableVouchers.find((v) => v.itemVoucherId === value);
      onSelect(e.target.value || null);
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor={`voucher-${productId}`}
        className="block mb-2 text-md font-medium text-gray-700"
      >
        Chọn voucher
      </label>
      <select
        id={`voucher-${productId}`}
        onChange={handleChange}
        // value={selectedId}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <option value="">
          {list.length > 0
            ? "-- Không dùng voucher --"
            : "-- Không có voucher khả dụng --"}
        </option>
        {list.map((item) => (
          <option key={item.userItemVoucherId} value={item.itemVoucherId}>
            {item.productName} -{" "}
            {item.percentValue > 0
              ? `${item.percentValue}%`
              : `${item.hardValue.toLocaleString()} đ`}
          </option>
        ))}
      </select>
    </div>
  );
}
