import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CartService from "../services/CartService";
import OrderService from "../services/OrderService";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";

const LeafletMap = ({ onAddressSelect }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const map = L.map(mapRef.current).setView([10.762622, 106.660172], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    const marker = L.marker([10.762622, 106.660172], { draggable: true }).addTo(map);
    markerRef.current = marker;
    fetchAddress(10.762622, 106.660172);

    marker.on("dragend", (e) => {
      const { lat, lng } = e.target.getLatLng();
      fetchAddress(lat, lng);
    });

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        const newMarker = L.marker([lat, lng], { draggable: true }).addTo(map);
        markerRef.current = newMarker;
        newMarker.on("dragend", (e) => {
          const { lat, lng } = e.target.getLatLng();
          fetchAddress(lat, lng);
        });
      }
      fetchAddress(lat, lng);
    });

    async function fetchAddress(lat, lng) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        onAddressSelect(data.display_name || `${lat}, ${lng}`);
      } catch (err) {
        console.error("Lỗi lấy địa chỉ:", err);
        onAddressSelect(`${lat}, ${lng}`);
      }
    }

    return () => map.remove();
  }, [onAddressSelect]);

  return (
    <>
      <div ref={mapRef} className="w-full h-64 border rounded-lg" />
      <p className="mt-2 text-sm text-gray-500">
        🔍 Bấm vào bản đồ hoặc kéo marker để chọn vị trí giao hàng.
      </p>
    </>
  );
};


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

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value) + " VND";

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

  useEffect(() => {
    if (addressFromMap) {
      const coordsMatch = addressFromMap.match(/^(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
      if (coordsMatch) {
        const lat = parseFloat(coordsMatch[1]);
        const lng = parseFloat(coordsMatch[2]);
        setCoordinates({ lat, lng });
        OrderService.calculateShippingFee({ lat, lng })
          .then(({ shippingFee }) => setShippingFee(shippingFee))
          .catch((err) => {
            console.error("Lỗi tính phí vận chuyển:", err);
            setShippingFee(0);
          });
      } else {
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            addressFromMap
          )}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data && data.length > 0) {
              const { lat, lon } = data[0];
              setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
              OrderService.calculateShippingFee({
                lat: parseFloat(lat),
                lng: parseFloat(lon),
              })
                .then(({ shippingFee }) => setShippingFee(shippingFee))
                .catch((err) => {
                  console.error("Lỗi tính phí vận chuyển:", err);
                  setShippingFee(0);
                });
            } else {
              setShippingFee(0);
            }
          })
          .catch((err) => {
            console.error("Lỗi lấy tọa độ từ địa chỉ:", err);
            setShippingFee(0);
          });
      }
    }
  }, [addressFromMap]);

  const subtotal =
    cartItems.reduce((sum, item) => sum + item.total, 0) ||
    initialSubtotal ||
    0;
  const discountAmount =
    discount > 0 && selectedVoucher
      ? selectedVoucher.hardValue
        ? Math.min(selectedVoucher.hardValue, subtotal)
        : subtotal * discount
      : 0;
  const total = subtotal - discountAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
        deliveryTime: form.deliveryTime || "2025-07-19T22:25:00Z",
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

            <div className="p-6 space-y-6 bg-white shadow-md rounded-2xl">
              <h2 className="text-xl font-semibold text-heading">Thông tin giao hàng</h2>
              <form className="space-y-5 text-main" onSubmit={handleSubmit}>
                <div>
                  <label className="block mb-1 text-sm font-medium text-sub">Tên của bạn</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Nhập tên của bạn"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-sub">Điện thoại</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-sub">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Nhập email của bạn"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-sub">Chọn vị trí trên bản đồ</label>
                  <LeafletMap onAddressSelect={setAddressFromMap} />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-sub">Địa chỉ chi tiết</label>
                  <textarea
                    value={addressFromMap}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    rows="3"
                    placeholder="Địa chỉ tự động từ bản đồ"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-sub">Thời gian giao hàng</label>
                  <input
                    type="datetime-local"
                    name="deliveryTime"
                    value={form.deliveryTime}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Chọn thời gian giao hàng"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-sub">Ghi chú</label>
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    rows="2"
                    placeholder="Thêm ghi chú (tùy chọn)"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-sub">Phương thức thanh toán</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={handlePaymentMethodChange}
                        className="mr-2"
                      />
                      Tiền mặt
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={paymentMethod === "bank_transfer"}
                        onChange={handlePaymentMethodChange}
                        className="mr-2"
                      />
                      Chuyển khoản
                    </label>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
