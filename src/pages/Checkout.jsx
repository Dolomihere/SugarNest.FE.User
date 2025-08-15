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
import { getCartItemKey } from "../utils/cart";

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
  const [selectedVouchers, setSelectedVouchers] = useState({});
  const [productDiscounts, setProductDiscounts] = useState({});

  // Lấy giỏ hàng & guestCartId (ưu tiên state, fallback localStorage)
  const {
    cartData,
    guestCartId: stateGuestCartId,
  } = location.state || {};
  const guestCartId = stateGuestCartId || localStorage.getItem("guestCartId");
  const cartItems = cartData?.cartItems || [];

  const accessToken = localStorage.getItem("accessToken");
  const isLoggedIn = !!accessToken;

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const totalDiscount = Object.values(productDiscounts).reduce((sum, d) => sum + d, 0);
  const total = subtotal + shippingFee - totalDiscount;

  // Lấy voucher người dùng
  const { data: userVouchers = [] } = useQuery({
    queryKey: ["userVouchers", accessToken],
    queryFn: () =>
      VoucherService.getUserItemVouchers(accessToken).then((data) =>
        data.map((v) => ({
          voucherId: v.itemVoucherId,
          name: v.productName,
          percentValue: v.percentValue,
          hardValue: v.hardValue,
          ...v,
        }))
      ),
    enabled: isLoggedIn,
  });

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value) + " VND";

  // Xóa giỏ hàng
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
      setError(`Không thể xóa giỏ hàng: ${err.message}`);
    },
  });

  // Tính phí ship
  useEffect(() => {
    const fetchShipping = async () => {
      if (!addressFromMap) {
        setShippingFee(0);
        return;
      }
      try {
        let lat, lng;
        const coordsMatch = addressFromMap.match(/^(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
        if (coordsMatch) {
          lat = parseFloat(coordsMatch[1]);
          lng = parseFloat(coordsMatch[2]);
        } else {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressFromMap)}`
          );
          const data = await res.json();
          if (data.length > 0) {
            lat = parseFloat(data[0].lat);
            lng = parseFloat(data[0].lon);
          }
        }
        setCoordinates({ lat, lng });
        if (lat && lng) {
          const { shippingFee } = await OrderService.calculateShippingFee({ lat, lng });
          setShippingFee(shippingFee || 0);
        }
      } catch (err) {
        console.error("Lỗi tính phí ship:", err);
        setShippingFee(0);
      }
    };
    fetchShipping();
  }, [addressFromMap]);

  const handleSetDiscountForProduct = (cartItemKey, discount) => {
    setProductDiscounts((prev) => ({
      ...prev,
      [cartItemKey]: discount,
    }));
  };
const mapPaymentMethodToChannel = (method) => {
  switch (method) {
    case "cash":
      return 1; // giả sử 1 là thanh toán tiền mặt
    case "card":
      return 2; // giả sử 2 là thẻ, bạn chỉnh lại theo backend nếu khác
    default:
      return null;
  }
};
  // Submit đơn hàng
const handleSubmit = async () => {
  try {
    setLoading(true);

    const voucherDiscountAmount = Object.values(productDiscounts).reduce(
      (sum, d) => sum + (d || 0),
      0
    );
    const orderTotal = subtotal + shippingFee - voucherDiscountAmount;

    const orderData = {
      address: addressFromMap,
      customerName: form.name,
      phoneNumber: form.phoneNumber,
      email: form.email,
      deliveryTime: form.deliveryTime ? new Date(form.deliveryTime).toISOString() : null,
      shippingFee,
      subTotal: subtotal,
      total: orderTotal,
      voucherDiscountAmount,
      paymentChannel: mapPaymentMethodToChannel(paymentMethod),
      orderItems: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      note: form.note || null,
    };

    console.log("📦 Order data gửi lên:", orderData);

    const res = await OrderService.createOrder(orderData, accessToken, guestCartId);
    console.log("📩 Response từ createOrder:", res);

    const orderFromServer = res?.data || res;
    const orderId = orderFromServer.orderId || orderFromServer.id;

    if (!orderId) {
      throw new Error("Không nhận được orderId từ server. Response: " + JSON.stringify(res));
    }

    // Lưu dữ liệu order đầy đủ (bao gồm dữ liệu server trả về)
    const fullOrderData = {
      ...orderFromServer,
      orderItems: orderData.orderItems,
      shippingFee: orderData.shippingFee,
      voucherDiscountAmount: orderData.voucherDiscountAmount,
    };

    localStorage.setItem("lastOrderData", JSON.stringify(fullOrderData));
    await clearCartMutation.mutateAsync();

    navigate(`/order-confirmation/${orderId}`, { state: fullOrderData });
  } catch (err) {
    console.error("Order error:", err);
    setError(err.message || "Lỗi khi đặt hàng");
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] bg-[#fffaf3] text-gray-700">
      <Header />
      <main className="max-w-6xl px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="sticky top-8 order-1 h-fit lg:order-none">
            <OrderSummary
              cartItems={cartItems}
              selectedVouchers={selectedVouchers}
              discounts={productDiscounts}
              subtotal={subtotal}
              total={total}
              discountAmount={totalDiscount}
              shippingFee={shippingFee}
              formatCurrency={formatCurrency}
              handleSubmit={handleSubmit}
              error={error}
              loading={loading}
            />
          </div>
          <div className="space-y-6 lg:col-span-2">
            <div className="p-6 space-y-6 bg-white rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold">Sản phẩm đã chọn</h2>
              {cartItems.length === 0 ? (
                <p>Không có sản phẩm trong giỏ hàng</p>
              ) : (
                cartItems.map((item) => {
                  const cartItemKey = getCartItemKey(item);
                  return (
                    <div key={cartItemKey} className="mb-6">
                      <div className="flex gap-6">
                        <img
                          src={item.imgs || "/images/placeholder.png"}
                          alt={item.productName}
                          className="object-cover w-32 h-32 rounded-lg border"
                        />
                        <div>
                          <h3 className="font-semibold">{item.productName}</h3>
                          <div className="text-primary font-bold mt-2">
                            {formatCurrency(item.total / item.quantity)}
                          </div>
                        </div>
                      </div>
                      <VoucherSection
                        product={item}
                        userVouchers={userVouchers}
                        selectedVoucher={selectedVouchers[cartItemKey]}
                        setSelectedVoucher={(key, voucher) =>
                          setSelectedVouchers((prev) => ({
                            ...prev,
                            [key]: voucher,
                          }))
                        }
                        setDiscountForProduct={(key, discount) =>
                          handleSetDiscountForProduct(key, discount)
                        }
                        formatCurrency={formatCurrency}
                      />
                    </div>
                  );
                })
              )}
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
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
