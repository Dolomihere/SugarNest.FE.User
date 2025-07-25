import React, { useEffect } from "react";
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

  const handleVoucherSelect = (voucherId) => {
    if (!isLoggedIn) {
      setDiscount(0);
      setPromoMessage("Vui lòng đăng nhập để sử dụng voucher!");
      return;
    }
    if (voucherId === "") {
      setSelectedVoucher(null);
      setDiscount(0);
      setPromoMessage("");
      return;
    }
    fetchVoucherMutation.mutate(voucherId);
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
    <div className="p-6 space-y-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-semibold text-heading">Mã giảm giá</h2>
      <div>
        <label className="block mb-1 text-sm font-medium text-sub">
          Chọn hoặc nhập mã voucher
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={selectedVoucher?.voucherId || ""}
            onChange={(e) => handleVoucherSelect(e.target.value)}
            disabled={!isLoggedIn}
          >
            <option value="">Chọn voucher</option>
            {userVouchers.map((voucher) => (
              <option key={voucher.voucherId} value={voucher.voucherId}>
                {voucher.name}{" "}
                {voucher.percentValue
                  ? `(${voucher.percentValue}% off)`
                  : voucher.hardValue
                  ? `(${formatCurrency(voucher.hardValue)} off)`
                  : ""}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={voucherInput}
            onChange={(e) => setVoucherInput(e.target.value)}
            placeholder="Nhập mã voucher"
            disabled={!isLoggedIn}
          />
          <button
            onClick={handleApplyVoucher}
            className="px-3 py-1.5 text-xs font-semibold text-white rounded bg-amber-600 hover:bg-amber-700 h-10"
            disabled={!isLoggedIn || !voucherInput.trim()}
          >
            Áp dụng
          </button>
        </div>
        {promoMessage && (
          <p
            className={`text-sm mt-1 ${
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
