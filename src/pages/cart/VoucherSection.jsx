import React, { useEffect, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import VoucherService from "../../services/VoucherService";

const VoucherSection = ({
  isLoggedIn,
  userVouchers,
  selectedVoucher,
  setSelectedVoucher,
  discount,
  setDiscount,
  promoMessage,
  setPromoMessage,
  voucherInput,
  setVoucherInput,
  formatCurrency,
  subtotal,
  cartItems,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredVouchers, setFilteredVouchers] = useState(userVouchers);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Lọc voucher theo input tìm kiếm
  useEffect(() => {
    if (voucherInput.trim()) {
      setFilteredVouchers(
        userVouchers.filter((voucher) =>
          voucher.productName.toLowerCase().includes(voucherInput.toLowerCase())
        )
      );
    } else {
      setFilteredVouchers(userVouchers);
    }
  }, [voucherInput, userVouchers]);

  // Đóng dropdown khi nhấp ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mutation để lấy voucher theo ID
  const fetchVoucherMutation = useMutation({
    mutationFn: (voucherId) =>
      VoucherService.getVoucherById(
        voucherId,
        localStorage.getItem("accessToken")
      ),
    onMutate: () => setIsLoading(true),
    onSuccess: (response) => {
      const voucher = response.data.data;
      if (
        voucher &&
        !voucher.isUsed &&
        (!voucher.endTime || new Date(voucher.endTime) > new Date()) &&
        (!voucher.minPriceCondition || subtotal >= voucher.minPriceCondition) &&
        (!voucher.productId ||
          cartItems.some((item) => item.productId === voucher.productId)) &&
        (!voucher.minQuantity ||
          cartItems.some(
            (item) =>
              item.productId === voucher.productId &&
              item.quantity >= voucher.minQuantity
          )) &&
        (!voucher.maxQuantity ||
          cartItems.some(
            (item) =>
              item.productId === voucher.productId &&
              item.quantity <= voucher.maxQuantity
          ))
      ) {
        setSelectedVoucher(voucher);
        setPromoMessage(
          `Áp dụng voucher ${voucher.productName} thành công! Giảm ${
            voucher.percentValue
              ? `${voucher.percentValue}%`
              : formatCurrency(voucher.hardValue)
          }.`
        );
        setVoucherInput(voucher.productName);
      } else {
        setSelectedVoucher(null);
        setDiscount(0);
        setPromoMessage(
          voucher
            ? "Voucher không hợp lệ: " +
              (voucher.isUsed
                ? "đã được sử dụng."
                : voucher.endTime && new Date(voucher.endTime) < new Date()
                ? "đã hết hạn."
                : voucher.minPriceCondition && subtotal < voucher.minPriceCondition
                ? `tổng đơn hàng phải đạt tối thiểu ${formatCurrency(
                    voucher.minPriceCondition
                  )}.`
                : voucher.minQuantity &&
                  !cartItems.some(
                    (item) =>
                      item.productId === voucher.productId &&
                      item.quantity >= voucher.minQuantity
                  )
                ? `số lượng sản phẩm phải đạt tối thiểu ${voucher.minQuantity}.`
                : voucher.maxQuantity &&
                  !cartItems.some(
                    (item) =>
                      item.productId === voucher.productId &&
                      item.quantity <= voucher.maxQuantity
                  )
                ? `số lượng sản phẩm không được vượt quá ${voucher.maxQuantity}.`
                : voucher.productId
                ? "không áp dụng cho sản phẩm trong giỏ hàng."
                : "không hợp lệ.")
            : "Mã voucher không tồn tại."
        );
      }
    },
    onError: (err) => {
      setSelectedVoucher(null);
      setDiscount(0);
      setPromoMessage(`Không tìm thấy voucher: ${err.message}`);
    },
    onSettled: () => setIsLoading(false),
  });

  // Xử lý chọn voucher từ dropdown
  const handleVoucherSelect = (voucher) => {
    if (!isLoggedIn) {
      setDiscount(0);
      setPromoMessage("Vui lòng đăng nhập để sử dụng voucher!");
      return;
    }

    if (
      !voucher.isUsed &&
      (!voucher.endTime || new Date(voucher.endTime) > new Date()) &&
      (!voucher.minPriceCondition || subtotal >= voucher.minPriceCondition) &&
      (!voucher.productId ||
        cartItems.some((item) => item.productId === voucher.productId)) &&
      (!voucher.minQuantity ||
        cartItems.some(
          (item) =>
            item.productId === voucher.productId &&
            item.quantity >= voucher.minQuantity
        )) &&
      (!voucher.maxQuantity ||
        cartItems.some(
          (item) =>
            item.productId === voucher.productId &&
            item.quantity <= voucher.maxQuantity
        ))
    ) {
      setSelectedVoucher(voucher);
      setVoucherInput(voucher.productName);
      setPromoMessage(
        `Áp dụng voucher ${voucher.productName} thành công! Giảm ${
          voucher.percentValue
            ? `${voucher.percentValue}%`
            : formatCurrency(voucher.hardValue)
        }.`
      );
    } else {
      setSelectedVoucher(null);
      setDiscount(0);
      setPromoMessage(
        voucher.isUsed
          ? "Voucher đã được sử dụng."
          : voucher.endTime && new Date(voucher.endTime) < new Date()
          ? "Voucher đã hết hạn."
          : voucher.minPriceCondition && subtotal < voucher.minPriceCondition
          ? `Tổng đơn hàng phải đạt tối thiểu ${formatCurrency(
              voucher.minPriceCondition
            )} để sử dụng voucher này.`
          : voucher.minQuantity &&
            !cartItems.some(
              (item) =>
                item.productId === voucher.productId &&
                item.quantity >= voucher.minQuantity
            )
          ? `Số lượng sản phẩm phải đạt tối thiểu ${voucher.minQuantity}.`
          : voucher.maxQuantity &&
            !cartItems.some(
              (item) =>
                item.productId === voucher.productId &&
                item.quantity <= voucher.maxQuantity
            )
          ? `Số lượng sản phẩm không được vượt quá ${voucher.maxQuantity}.`
          : voucher.productId
          ? "Voucher không áp dụng cho sản phẩm trong giỏ hàng."
          : "Voucher không hợp lệ."
      );
    }
    setIsDropdownOpen(false);
  };

  // Xử lý áp dụng voucher khi nhập mã
  const handleApplyVoucher = () => {
    if (!isLoggedIn) {
      setDiscount(0);
      setPromoMessage("Vui lòng đăng nhập để sử dụng voucher!");
      return;
    }
    if (!voucherInput.trim()) {
      setDiscount(0);
      setPromoMessage("Vui lòng nhập mã voucher!");
      return;
    }

    const matchedVoucher = userVouchers.find(
      (voucher) =>
        voucher.productName.toLowerCase() === voucherInput.trim().toLowerCase()
    );
    if (matchedVoucher) {
      handleVoucherSelect(matchedVoucher);
    } else {
      fetchVoucherMutation.mutate(voucherInput.trim());
    }
  };

  // Tính toán giảm giá
  useEffect(() => {
    if (!selectedVoucher) {
      setDiscount(0);
      return;
    }
    let discountValue = 0;
    if (selectedVoucher.percentValue) {
      discountValue = (selectedVoucher.percentValue / 100) * subtotal;
    } else if (selectedVoucher.hardValue) {
      discountValue = Math.min(selectedVoucher.hardValue, subtotal);
    }
    setDiscount(discountValue);
  }, [selectedVoucher, subtotal, setDiscount]);

  return (
    <div className="p-6 space-y-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
      <h2 className="text-xl font-bold text-gray-800">Mã giảm giá</h2>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-600">
          Nhập hoặc chọn mã voucher
        </label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1" ref={dropdownRef}>
            <input
              type="text"
              className="w-full p-3 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={voucherInput}
              onChange={(e) => {
                setVoucherInput(e.target.value);
                setIsDropdownOpen(true);
                setSelectedVoucher(null);
                setPromoMessage("");
              }}
              onFocus={() => isLoggedIn && setIsDropdownOpen(true)}
              placeholder="Nhập mã voucher hoặc chọn từ danh sách"
              disabled={!isLoggedIn || isLoading}
            />
            <svg
              className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 cursor-pointer right-3 top-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => isLoggedIn && setIsDropdownOpen(!isDropdownOpen)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
            {isDropdownOpen && isLoggedIn && (
              <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-60">
                {filteredVouchers.length > 0 ? (
                  filteredVouchers.map((voucher) => (
                    <div
                      key={voucher.userItemVoucherId}
                      className="p-3 text-sm text-gray-700 cursor-pointer hover:bg-amber-50"
                      onClick={() => handleVoucherSelect(voucher)}
                    >
                      {voucher.productName}{" "}
                      {voucher.percentValue
                        ? `(${voucher.percentValue}% off)`
                        : voucher.hardValue
                        ? `(${formatCurrency(voucher.hardValue)} off)`
                        : ""}
                      {voucher.endTime && (
                        <span className="text-xs text-gray-500">
                          {" - Hết hạn: "}
                          {new Date(voucher.endTime).toLocaleDateString("vi-VN")}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-500">
                    Không tìm thấy voucher phù hợp.
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={handleApplyVoucher}
            className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!isLoggedIn || !voucherInput.trim() || isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Áp dụng"}
          </button>
        </div>
        {promoMessage && (
          <p
            className={`text-sm mt-2 ${
              discount > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {promoMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default VoucherSection;