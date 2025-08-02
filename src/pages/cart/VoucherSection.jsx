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
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const fetchVoucherMutation = useMutation({
    mutationFn: (voucherId) =>
      VoucherService.getVoucherById(
        voucherId,
        localStorage.getItem("accessToken")
      ),
    onSuccess: (response) => {
      const voucher = response.data.data;
      if (
        voucher &&
        voucher.isActive &&
        (!voucher.endTime || new Date(voucher.endTime) > new Date())
      ) {
        setSelectedVoucher(voucher);
        setPromoMessage("");
        setVoucherInput(voucher.name);
      } else {
        setSelectedVoucher(null);
        setDiscount(0);
        setPromoMessage("Mã voucher không hợp lệ hoặc đã hết hạn.");
      }
    },
    onError: (err) => {
      setSelectedVoucher(null);
      setDiscount(0);
      setPromoMessage(`Không tìm thấy voucher: ${err.message}`);
    },
  });

  const handleVoucherSelect = (voucher) => {
    if (!isLoggedIn) {
      setDiscount(0);
      setPromoMessage("Vui lòng đăng nhập để sử dụng voucher!");
      return;
    }
    fetchVoucherMutation.mutate(voucher.voucherId);
    setIsDropdownOpen(false);
  };

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
    fetchVoucherMutation.mutate(voucherInput.trim());
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (!selectedVoucher) {
      setDiscount(0);
      return;
    }
    if (
      selectedVoucher.minPriceCondition &&
      subtotal < selectedVoucher.minPriceCondition
    ) {
      setSelectedVoucher(null);
      setDiscount(0);
      setPromoMessage(
        `Tổng đơn hàng phải đạt tối thiểu ${formatCurrency(
          selectedVoucher.minPriceCondition
        )} để sử dụng voucher này.`
      );
      return;
    }
    if (
      !selectedVoucher.isActive ||
      (selectedVoucher.endTime &&
        new Date(selectedVoucher.endTime) < new Date())
    ) {
      setSelectedVoucher(null);
      setDiscount(0);
      setPromoMessage("Voucher đã hết hạn hoặc không hoạt động.");
      return;
    }
    let discountValue = 0;
    if (selectedVoucher.percentValue) {
      discountValue = selectedVoucher.percentValue / 100;
      setPromoMessage(
        `Áp dụng voucher ${selectedVoucher.name} thành công! Giảm ${selectedVoucher.percentValue}%.`
      );
    } else if (selectedVoucher.hardValue) {
      discountValue = selectedVoucher.hardValue / subtotal;
      setPromoMessage(
        `Áp dụng voucher ${
          selectedVoucher.name
        } thành công! Giảm ${formatCurrency(selectedVoucher.hardValue)}.`
      );
    }
    setDiscount(discountValue);
  }, [selectedVoucher, subtotal, formatCurrency, setDiscount, setPromoMessage]);

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
                setSelectedVoucher(null); // Xóa voucher đã chọn khi nhập thủ công
              }}
              onFocus={() => isLoggedIn && setIsDropdownOpen(true)}
              placeholder="Nhập mã voucher hoặc chọn từ danh sách"
              disabled={!isLoggedIn}
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
            {isDropdownOpen && isLoggedIn && userVouchers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-60">
                {userVouchers.map((voucher) => (
                  <div
                    key={voucher.voucherId}
                    className="p-3 text-sm text-gray-700 cursor-pointer hover:bg-amber-50"
                    onClick={() => handleVoucherSelect(voucher)}
                  >
                    {voucher.name}{" "}
                    {voucher.percentValue
                      ? `(${voucher.percentValue}% off)`
                      : voucher.hardValue
                      ? `(${formatCurrency(voucher.hardValue)} off)`
                      : ""}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleApplyVoucher}
            className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!isLoggedIn || !voucherInput.trim()}
          >
            Áp dụng
          </button>
        </div>
        {promoMessage && (
          <p
            className={`text-sm mt-2 ${
              discount > 0 || selectedVoucher?.hardValue
                ? "text-green-600"
                : "text-red-500"
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