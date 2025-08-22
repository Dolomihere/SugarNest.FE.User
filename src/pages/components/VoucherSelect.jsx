import React from "react";

export function VoucherSelect({ productId, productQuantity, list = [], onSelect }) {
  const handleChange = (e) => {
    const value = e.target.value;
    if (onSelect) {
      onSelect(value); // truyền value của option ra ngoài
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
        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        defaultValue=""
      >
        <option value="" disabled>
          -- Chọn voucher --
        </option>
        {list.map((item) => (
          <option key={item.itemVoucherId} value={item.itemVoucherId}>
            {item.productName + ` - ` + `${item.percentValue > 0? `${item.percentValue}%` : `${item.hardValue}vnđ`}`}
          </option>
        ))}
      </select>
    </div>
  );
}
