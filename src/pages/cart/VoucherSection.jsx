import React, { useState, useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import VoucherService from "../../services/VoucherService";
import { publicApi } from "../../configs/AxiosConfig";
import { getCartItemKey } from "../../utils/cart";

const VoucherSection = ({
  product,
  userVouchers,
  selectedVoucher,
  setSelectedVoucher,
  setDiscountForProduct,
  formatCurrency,
  updateUserVouchers,
}) => {
  const [voucherId, setVoucherId] = useState(selectedVoucher?.voucherId || "");
  const [voucher, setVoucher] = useState(selectedVoucher || null);
  const [voucherCode, setVoucherCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const cartItemKey = getCartItemKey(product);

  const claimVoucherMutation = useMutation({
    mutationFn: async (itemVoucherId) => {
      const accessToken = localStorage.getItem("accessToken");
      const response = await publicApi.post(
        "/useritemvouchers",
        { itemVoucherId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return response.data.userItemVoucherId;
    },
    onSuccess: (userItemVoucherId, itemVoucherId) => {
      const selected = userVouchers.find((v) => v.voucherId === itemVoucherId);
      updateCartItemVoucherMutation.mutate({ userItemVoucherId, voucher: selected });
    },
    onError: (err) => {
      setCodeError(err.response?.data?.message || "Lỗi khi claim voucher");
    },
  });

  const updateCartItemVoucherMutation = useMutation({
    mutationFn: async ({ userItemVoucherId, voucher }) => {
      const response = await publicApi.patch(
        `/carts/items/${product.cartItemId}/voucher`,
        { UserItemVoucher: userItemVoucherId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );
      return { ...response.data, voucher };
    },
    onSuccess: ({ voucher }) => {
      const discountPerUnit = getVoucherValue(product.unitPrice, voucher);
      const totalDiscount = discountPerUnit * product.quantity;
      setSelectedVoucher(cartItemKey, voucher);
      setDiscountForProduct(cartItemKey, totalDiscount);
      console.log("Voucher applied:", voucher, "Discount:", totalDiscount);
    },
    onError: (err) => {
      setCodeError(err.response?.data?.message || "Lỗi khi áp dụng voucher");
    },
  });

  const applicableVouchers = useMemo(
    () =>
      userVouchers.filter(
        (v) =>
          v.productId === product.productId &&
          v.isActive &&
          new Date(v.startTime) <= new Date() &&
          new Date(v.endTime) >= new Date() &&
          v.minQuantity <= product.quantity &&
          v.maxQuantity >= product.quantity
      ),
    [userVouchers, product]
  );

  useEffect(() => {
    const found = userVouchers.find((v) => v.voucherId === voucherId);
    setVoucher(found || null);
  }, [voucherId, userVouchers]);

  const isVoucherValid = () => {
    if (!voucher) return false;
    if (voucher.productId && voucher.productId !== product.productId) return false;
    if (voucher.minQuantity > product.quantity || voucher.maxQuantity < product.quantity)
      return false;
    const now = new Date();
    if (voucher.startTime && new Date(voucher.startTime) > now) return false;
    if (voucher.endTime && new Date(voucher.endTime) < now) return false;
    return voucher.isActive;
  };

  const getVoucherValue = (unitPrice, voucher) => {
    if (!voucher || unitPrice <= 0) return 0;
    let discount = 0;
    if (voucher.percentValue && voucher.percentValue > 0) {
      discount = (unitPrice * voucher.percentValue) / 100;
    }
    if (voucher.hardValue && voucher.hardValue > 0) {
      discount = Math.max(discount, voucher.hardValue);
    }
    return Math.min(Math.round(discount), unitPrice);
  };

  const calculateProductTotal = (unitPrice, quantity, discountPerUnit) => {
    if (unitPrice <= 0) return 0;
    const total = (unitPrice - discountPerUnit) * quantity;
    return Math.max(Math.round(total * 100) / 100, 0);
  };

  const applyVoucher = () => {
    if (isVoucherValid()) {
      if (voucher.userItemVouchersCount === 0) {
        claimVoucherMutation.mutate(voucher.voucherId);
      } else {
        updateCartItemVoucherMutation.mutate({ userItemVoucherId: voucher.voucherId, voucher });
      }
    } else {
      setSelectedVoucher(cartItemKey, null);
      setDiscountForProduct(cartItemKey, 0);
      updateCartItemVoucherMutation.mutate({ userItemVoucherId: null, voucher: null });
    }
  };

  const handleApplyCode = async () => {
    setIsCheckingCode(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const sendingData = {
      }
      const response = await CartService.UpdateItemVoucher(voucherCode, accessToken);
      if (response?.productId === product.productId && response?.isActive) {
        setVoucher(response);
        setVoucherId(response.voucherId);
        setCodeError("");
        if (!userVouchers.find((v) => v.voucherId === response.voucherId)) {
          updateUserVouchers((prev) => [...prev, response]);
        }
      } else {
        setCodeError("Mã voucher không hợp lệ hoặc không áp dụng cho sản phẩm này");
      }
    } catch (err) {
      setCodeError(err.response?.data?.message || "Lỗi khi kiểm tra mã voucher");
    } finally {
      setIsCheckingCode(false);
    }
  };

  const handleClearVoucher = () => {
    setVoucherId("");
    setVoucher(null);
    setSelectedVoucher(cartItemKey, null);
    setDiscountForProduct(cartItemKey, 0);
    updateCartItemVoucherMutation.mutate({ userItemVoucherId: null, voucher: null });
  };

  useEffect(() => {
    applyVoucher();
  }, [voucher, product.quantity]);

  const getErrorMessage = () => {
    if (!voucher) return "";
    if (voucher.productId && voucher.productId !== product.productId)
      return "Voucher không áp dụng cho sản phẩm này";
    if (voucher.minQuantity > product.quantity)
      return `Số lượng tối thiểu để áp dụng voucher là ${voucher.minQuantity}`;
    if (voucher.maxQuantity < product.quantity)
      return `Số lượng tối đa để áp dụng voucher là ${voucher.maxQuantity}`;
    if (voucher.startTime && new Date(voucher.startTime) > new Date())
      return "Voucher chưa có hiệu lực";
    if (voucher.endTime && new Date(voucher.endTime) < new Date())
      return "Voucher đã hết hạn";
    if (!voucher.isActive) return "Voucher không hoạt động";
    return "";
  };

  return (
    <div className="voucher-section mt-2 p-4 bg-gray-100 rounded-lg">
      <label className="font-semibold">Chọn voucher cho sản phẩm: {product.productName}</label>
      {applicableVouchers.length === 0 ? (
        <p className="text-gray-500 mt-1">Không có voucher nào áp dụng cho sản phẩm này</p>
      ) : (
        <select
          className="border rounded p-1 mt-1 w-full"
          value={voucherId}
          onChange={(e) => setVoucherId(e.target.value)}
          disabled={product.unitPrice <= 0}
        >
          <option value="">Không áp dụng</option>
          {[...new Map(applicableVouchers.map((v) => [v.voucherId, v])).values()].map((v) => (
            <option key={`${v.voucherId}-${cartItemKey}`} value={v.voucherId}>
              {v.name} -{" "}
              {v.percentValue
                ? `${v.percentValue}% (Tối thiểu ${v.minQuantity}, Tối đa ${v.maxQuantity})`
                : `${formatCurrency(v.hardValue)} (Tối thiểu ${v.minQuantity}, Tối đa ${v.maxQuantity})`}
            </option>
          ))}
        </select>
      )}
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          placeholder="Nhập mã voucher"
          className="border rounded p-1 flex-1"
          disabled={isCheckingCode || product.unitPrice <= 0}
        />
        <button
          onClick={handleApplyCode}
          disabled={isCheckingCode || product.unitPrice <= 0}
          className={`px-3 py-1 ${isCheckingCode ? "bg-gray-400" : "bg-blue-600"} text-white rounded`}
        >
          {isCheckingCode ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                ></path>
              </svg>
              Đang kiểm tra...
            </span>
          ) : (
            "Áp dụng"
          )}
        </button>
        {voucher && (
          <button
            onClick={handleClearVoucher}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Xóa
          </button>
        )}
      </div>
      {codeError && <p className="text-red-600 mt-1">{codeError}</p>}
      {updateCartItemVoucherMutation.isError && (
        <p className="text-red-600 mt-1">
          {updateCartItemVoucherMutation.error?.response?.data?.message || "Lỗi khi áp dụng voucher"}
        </p>
      )}
      {claimVoucherMutation.isError && (
        <p className="text-red-600 mt-1">
          {claimVoucherMutation.error?.response?.data?.message || "Lỗi khi claim voucher"}
        </p>
      )}
      {product.unitPrice <= 0 && (
        <p className="text-red-600 mt-1">Giá sản phẩm không hợp lệ, không thể áp dụng voucher</p>
      )}
      {isVoucherValid() && voucher && product.quantity > 0 && product.unitPrice > 0 && (
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
        <p className="text-red-600 mt-1">{getErrorMessage()}</p>
      )}
    </div>
  );
};

export default VoucherSection;