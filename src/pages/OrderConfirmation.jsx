import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import OrderService from "../services/OrderService";
import CartService from "../services/CartService";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    orderId,
    paymentStatus,
    orderData,
    showSuccessMessage,
    checkoutData
  } = location.state || {};

  const token = localStorage.getItem("accessToken");
  const isLoggedIn = !!token;

  const restoredCheckoutData = checkoutData || JSON.parse(localStorage.getItem("checkoutData")) || {};
  const {
    cartData,
    selectedVoucher,
    discount,
    subtotal,
    total,
    guestCartId,
    form,
    paymentMethod,
    shippingFee,
    coordinates,
  } = restoredCheckoutData;

  const cartItems = cartData?.cartItems || [];

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value) + " VND";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      for (const item of cartItems) {
        try {
          await CartService.deleteItem(item.cartItemId, token);
        } catch (err) {
          console.error(`Failed to delete item ${item.cartItemId}:`, err);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        isLoggedIn ? ["userCart", token] : ["guestCart", guestCartId]
      );
      if (!isLoggedIn && guestCartId) {
        localStorage.removeItem("guestCartId");
      }
    },
    onError: (err) => {
      setError(`Không thể xóa giỏ hàng: ${err.message}. Đơn hàng vẫn được tạo thành công.`);
    },
  });

  const handleConfirmOrder = async () => {
    if (!isLoggedIn) {
      localStorage.setItem("checkoutData", JSON.stringify(restoredCheckoutData));
      navigate("/signin", { state: { from: "/order-confirmation", checkoutData: restoredCheckoutData } });
      return;
    }

    if (!form || !cartItems.length) {
      setError("Dữ liệu đơn hàng không hợp lệ. Vui lòng quay lại giỏ hàng.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const orderDataToSend = {
        address: form.address,
        longitude: coordinates?.lng,
        latitude: coordinates?.lat,
        deliveryTime: form.deliveryTime,
        customerName: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        recipientName: form.name,
        recipientEmail: form.email,
        recipientPhone: form.phoneNumber,
        note: form.note,
        userVoucher: form.userVoucher,
        cartItems,
      };

      const response = await OrderService.createOrder(orderDataToSend, token, guestCartId);
      const createdOrder = response.data;
      const orderId = createdOrder.orderId;

      const paymentResponse = await OrderService.processPayment({
        orderId,
        amount: total + shippingFee,
      });

      if (paymentResponse.status !== "success") {
        setError("Thanh toán không thành công. Vui lòng thử lại.");
        setLoading(false);
        return;
      }

      try {
        await OrderService.sendOrderConfirmationEmail({
          email: form.email,
          orderId,
          orderData: {
            ...createdOrder,
            paymentMethod,
          },
        });
      } catch (emailError) {
        console.error("Lỗi gửi email:", emailError);
        setError("Đơn hàng đã được tạo nhưng không thể gửi email xác nhận.");
      }

      await clearCartMutation.mutateAsync();
      queryClient.invalidateQueries(["orderHistory", token]);

      navigate("/order-confirmation", {
        state: {
          orderId,
          paymentStatus: paymentResponse.status,
          orderData: {
            ...createdOrder,
            paymentMethod,
          },
          showSuccessMessage: "Đơn hàng đã được đặt thành công!",
          checkoutData: restoredCheckoutData,
        },
      });

      localStorage.removeItem("checkoutData");
    } catch (err) {
      console.error("Order error:", err);
      setError("Lỗi khi đặt hàng: " + (err.message || "Không xác định"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] text-gray-700 bg-[#fffaf3]">
      <Header />
      <main className="max-w-6xl px-4 py-8 mx-auto">
        <h2 className="mb-6 text-2xl font-semibold text-heading">Xác nhận đơn hàng</h2>
        {showSuccessMessage && (
          <p className="mb-4 text-sm text-green-600">{showSuccessMessage}</p>
        )}
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        {orderId ? (
          <div className="p-6 bg-white shadow-md rounded-2xl">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold text-heading">Đơn hàng #{orderId}</h3>
              <span
                className={`text-sm ${
                  paymentStatus === "success" ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {paymentStatus === "success" ? "Thanh toán thành công" : "Đang xử lý"}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>Ngày đặt:</strong> {formatDate(orderData.createdAt)}</p>
              <p><strong>Địa chỉ:</strong> {orderData.address}</p>
              <p><strong>Tên khách hàng:</strong> {orderData.customerName}</p>
              <p><strong>Email:</strong> {orderData.email}</p>
              <p><strong>Số điện thoại:</strong> {orderData.phoneNumber}</p>
              <p>
                <strong>Phương thức thanh toán:</strong>{" "}
                {orderData.paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}
              </p>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-sub">Chi tiết đơn hàng</h4>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                {orderData.orderItems?.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>
                      {item.productName}
                      {item.orderItemOptions?.length > 0 && (
                        <span>
                          {" "}({item.orderItemOptions.map(opt => opt.optionValue).join(", ")})
                        </span>
                      )}
                    </span>
                    <span>{formatCurrency(item.total)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <strong>Phí vận chuyển:</strong>{" "}
                {orderData.shippingFee > 0 ? formatCurrency(orderData.shippingFee) : "Miễn phí"}
              </p>
              {orderData.voucherDiscountAmount > 0 && (
                <p className="text-sm text-green-600">
                  <strong>Giảm giá:</strong> -{formatCurrency(orderData.voucherDiscountAmount)}
                </p>
              )}
              <p className="text-base font-bold text-amber-600">
                <strong>Tổng thanh toán:</strong> {formatCurrency(orderData.total)}
              </p>
            </div>
            <div className="mt-4 space-x-4">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 text-sm font-semibold text-white rounded bg-amber-600 hover:bg-amber-700"
              >
                Tiếp tục mua sắm
              </button>
              <button
                onClick={() => navigate("/order-history")}
                className="px-4 py-2 text-sm font-semibold border rounded text-amber-600 border-amber-600 hover:bg-amber-50"
              >
                Xem lịch sử đơn hàng
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-white shadow-md rounded-2xl">
            <h3 className="text-lg font-semibold text-heading">Xác nhận đơn hàng</h3>
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-600">Giỏ hàng trống</p>
            ) : (
              <>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-sub">Sản phẩm</h4>
                  <ul className="mt-2 space-y-2 text-sm text-gray-600">
                    {cartItems.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.productName}</span>
                        <span>{formatCurrency(item.total)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>Tên khách hàng:</strong> {form?.name || "Chưa nhập"}</p>
                  <p><strong>Email:</strong> {form?.email || "Chưa nhập"}</p>
                  <p><strong>Số điện thoại:</strong> {form?.phoneNumber || "Chưa nhập"}</p>
                  <p><strong>Địa chỉ:</strong> {form?.address || "Chưa nhập"}</p>
                  <p>
                    <strong>Phương thức thanh toán:</strong>{" "}
                    {paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}
                  </p>
                  <p>
                    <strong>Phí vận chuyển:</strong>{" "}
                    {shippingFee > 0 ? formatCurrency(shippingFee) : "Miễn phí"}
                  </p>
                  {discount > 0 && (
                    <p className="text-green-600">
                      <strong>Giảm giá:</strong> -{formatCurrency(discount)}
                    </p>
                  )}
                  <p className="text-base font-bold text-amber-600">
                    <strong>Tổng thanh toán:</strong> {formatCurrency(total + (shippingFee || 0))}
                  </p>
                </div>
                <div className="mt-4 space-x-4">
                  <button
                    onClick={handleConfirmOrder}
                    className="px-4 py-2 text-sm font-semibold text-white rounded bg-amber-600 hover:bg-amber-700"
                    disabled={loading || !form?.name || !form?.email || !form?.phoneNumber || !form?.address}
                  >
                    {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                  </button>
                  <button
                    onClick={() => navigate("/checkout", { state: restoredCheckoutData })}
                    className="px-4 py-2 text-sm font-semibold border rounded text-amber-600 border-amber-600 hover:bg-amber-50"
                  >
                    Quay lại chỉnh sửa
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
