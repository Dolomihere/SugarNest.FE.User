import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CartService from "../services/CartService";
import OrderService from "../services/OrderService";
import VoucherService from "../services/VoucherService";
import OrderSummary from "./cart/OrderSummary";
import VoucherSection from "./cart/VoucherSection";
import DeliveryForm from "./cart/DeliveryForm";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [addressFromMap, setAddressFromMap] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [shippingFee, setShippingFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    deliveryTime: "",
    note: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [voucherInput, setVoucherInput] = useState("");

  const {
    cartData,
    subtotal: initialSubtotal,
    total: initialTotal,
    guestCartId,
  } = location.state || {};
  const cartItems = cartData?.cartItems || [];
  const accessToken = localStorage.getItem("accessToken");
  const isLoggedIn = !!accessToken;

  // Fetch user-specific vouchers
  const { data: userVouchers = [] } = useQuery({
    queryKey: ["userVouchers", accessToken],
    queryFn: () =>
      VoucherService.getUserVouchers(accessToken).then(
        (res) => res.data.data || []
      ),
    enabled: isLoggedIn,
  });

  // Format currency
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value) + " VND";

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      for (const item of cartItems) {
        try {
          await CartService.deleteItem(item.cartItemId, accessToken);
        } catch (err) {
          console.error(`Failed to delete item ${item.cartItemId}:`, err);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        isLoggedIn ? ["userCart", accessToken] : ["guestCart", guestCartId]
      );
      if (!isLoggedIn && guestCartId) {
        localStorage.removeItem("guestCartId");
      }
    },
    onError: (err) => {
      setError(
        `Không thể xóa giỏ hàng: ${err.message}. Đơn hàng vẫn được tạo thành công.`
      );
    },
  });

  // Calculate shipping fee based on address
  useEffect(() => {
    const fetchCoordinatesAndShippingFee = async () => {
      if (!addressFromMap) {
        setShippingFee(0);
        return;
      }

      try {
        // Check if addressFromMap contains coordinates
        const coordsMatch = addressFromMap.match(
          /^(-?\d+\.\d+),\s*(-?\d+\.\d+)/
        );
        let lat, lng;

        if (coordsMatch) {
          lat = parseFloat(coordsMatch[1]);
          lng = parseFloat(coordsMatch[2]);
        } else {
          // Fetch coordinates from Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              addressFromMap
            )}`
          );
          const data = await response.json();
          if (data && data.length > 0) {
            lat = parseFloat(data[0].lat);
            lng = parseFloat(data[0].lon);
          } else {
            throw new Error("Không thể tìm thấy tọa độ cho địa chỉ này");
          }
        }

        // Update coordinates
        setCoordinates({ lat, lng });

        // Calculate shipping fee
        if (lat && lng) {
          const response = await OrderService.calculateShippingFee({
            lat,
            lng,
          });
          setShippingFee(response.shippingFee || 0);
        } else {
          setShippingFee(0);
          setError("Không thể xác định tọa độ hợp lệ");
        }
      } catch (err) {
        console.error("Lỗi tính phí vận chuyển:", err);
        setShippingFee(0);
        setError("Không thể tính phí vận chuyển: " + err.message);
      }
    };

    fetchCoordinatesAndShippingFee();
  }, [addressFromMap]);

  // Calculate totals
  const subtotal =
    cartItems.reduce((sum, item) => sum + item.total, 0) ||
    initialSubtotal ||
    0;
  const tempTotal = subtotal + shippingFee;
  const discountAmount =
    discount > 0 && selectedVoucher
      ? selectedVoucher.hardValue
        ? Math.min(selectedVoucher.hardValue, tempTotal)
        : tempTotal * discount
      : 0;
  const total = tempTotal - discountAmount;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!form.name.trim()) {
      setError("Vui lòng nhập tên của bạn");
      setLoading(false);
      return;
    }
    if (!form.phoneNumber.trim()) {
      setError("Vui lòng nhập số điện thoại");
      setLoading(false);
      return;
    }
    if (!form.email.trim()) {
      setError("Vui lòng nhập email");
      setLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Email không hợp lệ");
      setLoading(false);
      return;
    }
    if (!addressFromMap.trim()) {
      setError("Vui lòng chọn địa chỉ giao hàng trên bản đồ");
      setLoading(false);
      return;
    }
    if (!form.deliveryTime) {
      setError("Vui lòng chọn thời gian giao hàng");
      setLoading(false);
      return;
    }
    if (!paymentMethod) {
      setError("Vui lòng chọn phương thức thanh toán");
      setLoading(false);
      return;
    }
    if (!isLoggedIn && !guestCartId) {
      setError("Vui lòng đăng nhập hoặc cung cấp giỏ hàng khách");
      setLoading(false);
      navigate("/signin", { state: { from: "/checkout" } });
      return;
    }
    if (cartItems.length === 0) {
      setError("Giỏ hàng của bạn đang trống");
      setLoading(false);
      return;
    }
    if (!coordinates.lat || !coordinates.lng) {
      setError("Vui lòng chọn vị trí hợp lệ trên bản đồ");
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        address: addressFromMap,
        longitude: coordinates.lng,
        latitude: coordinates.lat,
        deliveryTime: form.deliveryTime,
        customerName: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        recipientName: form.name,
        recipientEmail: form.email,
        recipientPhone: form.phoneNumber,
        note: form.note || null,
        userVoucher: selectedVoucher?.voucherId || null,
        cartItems: cartItems.map((item) => ({
          productId: item.productId.toString(),
          quantity: item.quantity,
        })),
      };

      const response = await OrderService.createOrder(
        orderData,
        accessToken,
        guestCartId
      );
      let orderId = null;

      if (response && response.data && response.data.orderId) {
        orderId = response.data.orderId;
      } else if (response && (response.orderId || response.id)) {
        orderId = response.orderId || response.id;
      } else {
        throw new Error("Không thể xác định ID đơn hàng từ phản hồi server");
      }

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
            ...orderData,
            subtotal,
            discount,
            shippingFee,
            total: total + shippingFee,
            paymentMethod,
            createdAt: new Date().toISOString(),
          },
        });
      } catch (emailError) {
        console.error("Lỗi gửi email:", emailError);
        setError("Đơn hàng đã được tạo nhưng không thể gửi email xác nhận.");
      }

      await clearCartMutation.mutateAsync();
      queryClient.invalidateQueries(["orderHistory", accessToken]);

      navigate("/order-confirmation", {
        state: {
          orderId,
          paymentStatus: paymentResponse.status,
          orderData: {
            ...orderData,
            subtotal,
            discount,
            shippingFee,
            total: total + shippingFee,
            paymentMethod,
            createdAt: new Date().toISOString(),
          },
          showSuccessMessage: "Đơn hàng đã được đặt thành công!",
          checkoutData: {
            cartData,
            selectedVoucher,
            discount,
            subtotal,
            total,
            guestCartId,
            form: { ...form, address: addressFromMap },
            paymentMethod,
            shippingFee,
            coordinates,
          },
        },
      });
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="sticky order-1 space-y-6 lg:col-span-1 lg:order-none top-8 h-fit">
            <OrderSummary
              cartItems={cartItems}
              selectedVoucher={selectedVoucher}
              discount={discount}
              subtotal={subtotal}
              total={total}
              discountAmount={discountAmount}
              shippingFee={shippingFee}
              formatCurrency={formatCurrency}
              handleSubmit={handleSubmit}
              error={error}
              loading={loading}
            />
            <div className="p-6 space-y-4 text-sm bg-white shadow-md rounded-2xl text-main">
              <div className="grid grid-cols-1 gap-2 font-semibold text-center text-yellow-700">
                <div>✔ Miễn phí vận chuyển đơn từ 300k hoặc dưới 5km</div>
                <div>✔ Giao hàng 2–3 ngày</div>
                <div>✔ Hỗ trợ hoàn 100%</div>
                <div>✔ Thanh toán khi nhận hoặc chuyển khoản</div>
              </div>
              <div className="pt-4 border-t">
                <h3 className="mb-2 text-base font-bold text-heading">
                  Hướng dẫn đặt hàng
                </h3>
                <ul className="pl-5 space-y-1 list-disc text-sub">
                  <li>Chọn sản phẩm và thêm vào giỏ</li>
                  <li>Điền đầy đủ thông tin giao hàng</li>
                  <li>
                    Nhấn <strong className="text-heading">Đặt mua ngay</strong>{" "}
                    để hoàn tất
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="space-y-6 lg:col-span-2">
            <div className="p-6 space-y-6 bg-white shadow-md rounded-2xl">
              <h2 className="text-xl font-semibold text-heading">
                Sản phẩm đã chọn
              </h2>
              <div className="overflow-x-auto">
                {cartItems.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    Không có sản phẩm nào trong giỏ hàng
                  </p>
                ) : (
                  cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-6 mb-6 md:flex-row"
                    >
                      <img
                        src={item.productImage || "/images/placeholder.png"}
                        alt={item.productName}
                        className="object-cover w-32 h-32 border rounded-lg"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-heading">
                          {item.productName}
                        </h3>
                        {item.cartItemOptions?.length > 0 && (
                          <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                            {item.cartItemOptions.map((opt) => (
                              <li key={opt.cartItemOptionId}>
                                {opt.optionValue || "Tùy chọn"}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="text-xl font-bold text-primary">
                            {formatCurrency(item.total / item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <DeliveryForm
              form={form}
              setForm={setForm}
              addressFromMap={addressFromMap}
              setAddressFromMap={setAddressFromMap}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              handleSubmit={handleSubmit}
            />
            <VoucherSection
              isLoggedIn={isLoggedIn}
              userVouchers={userVouchers}
              selectedVoucher={selectedVoucher}
              setSelectedVoucher={setSelectedVoucher}
              discount={discount}
              setDiscount={setDiscount}
              promoMessage={promoMessage}
              setPromoMessage={setPromoMessage}
              voucherInput={voucherInput}
              setVoucherInput={setVoucherInput}
              formatCurrency={formatCurrency}
              subtotal={subtotal}
            />
            {error && (
              <p className="mt-4 text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;