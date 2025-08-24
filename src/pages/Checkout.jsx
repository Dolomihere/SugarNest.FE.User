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
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const SetDeliveryAddress = (address, latitude, longitude)=> {

    setAddressFromMap(address);
    setLatitude(latitude);
    setLongitude(longitude);
  }
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
      // if (!addressFromMap) {
      //   setShippingFee(0);
      //   return;
      // }
      try {
        // let lat, lng;
        // const coordsMatch = addressFromMap.match(/^(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
        // if (coordsMatch) {
        //   lat = parseFloat(coordsMatch[1]);
        //   lng = parseFloat(coordsMatch[2]);
        // } else {
        //   const res = await fetch(
        //     `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressFromMap)}`

        //   );
        //   const data = await res.json();
        //   if (data.length > 0) {
        //     lat = parseFloat(data[0].lat);
        //     lng = parseFloat(data[0].lon);
        //   }
        // }
        // setCoordinates({ lat, lng });
        if (longitude && latitude) {
          const { shippingFee } = await OrderService.calculateShippingFee({ lat:latitude, lng:longitude, subTotal:subtotal });
          setShippingFee(shippingFee || 0);
        }
      } catch (err) {
        console.error("Lỗi tính phí ship:", err);
        setShippingFee(0);
      }
    };
    fetchShipping();
  }, [addressFromMap, longitude, latitude]);

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

    if (!cartItems || cartItems.length === 0) {
      console.warn("Cart is empty");
      setError("Giỏ hàng rỗng. Vui lòng thêm sản phẩm trước khi đặt hàng.");
      return;
    }

    console.log("cartItems:", JSON.stringify(cartItems, null, 2));
    console.log("selectedVouchers:", JSON.stringify(selectedVouchers, null, 2));
    console.log("userVouchers:", JSON.stringify(userVouchers, null, 2));
    console.log("guestCartId:", guestCartId);

    const voucherDiscountAmount = Object.values(productDiscounts).reduce(
      (sum, d) => sum + (d || 0),
      0
    );
    const orderTotal = subtotal + shippingFee - voucherDiscountAmount;

    const now = new Date();
    let validVoucher = null;
    if (Object.values(selectedVouchers).length > 0) {
      validVoucher = userVouchers.find((v) => {
        const selectedVoucher = Object.values(selectedVouchers).find(
          (sv) => sv?.voucherId === v.voucherId
        );
        if (!selectedVoucher) {
          console.warn("No selected voucher found for ID:", v.voucherId);
          return false;
        }

        const cartItem = cartItems.find(
          (item) =>
            item.productId && v.productId && item.productId.toString() === v.productId.toString()
        );
        if (!cartItem) {
          console.warn("No matching cart item found for productId:", v.productId);
          return false;
        }

        if (!v.isActive) {
          console.warn("Voucher is not active:", v.voucherId);
          return false;
        }

        const startTime = new Date(v.startTime);
        const endTime = new Date(v.endTime);
        if (now < startTime || now > endTime) {
          console.warn("Voucher is out of valid time range:", v.voucherId);
          return false;
        }

        if (cartItem.quantity < v.minQuantity || cartItem.quantity > v.maxQuantity) {
          console.warn("Invalid quantity for voucher:", v.voucherId);
          return false;
        }

        if (v.minPriceCondition && subtotal < v.minPriceCondition) {
          console.warn("Subtotal does not meet voucher's minPriceCondition:", v.minPriceCondition);
          setError(`Đơn hàng phải có giá trị tối thiểu ${formatCurrency(v.minPriceCondition)} để áp dụng voucher`);
          return false;
        }

        return true;
      });

      if (!validVoucher) {
        console.warn("Invalid voucher:", Object.values(selectedVouchers)[0]?.voucherId);
        setError("Voucher không hợp lệ hoặc không áp dụng cho sản phẩm này");
        return;
      }
    }

    const userVoucherId = validVoucher ? validVoucher.voucherId : null;

    // Lấy cartId nếu không có guestCartId
    let finalCartId = guestCartId || localStorage.getItem("cartId");
    if (!finalCartId && accessToken) {
      finalCartId = await OrderService.getUserCartId(accessToken);
      if (!finalCartId) {
        setError("Không thể lấy thông tin giỏ hàng. Vui lòng thử lại.");
        return;
      }
      localStorage.setItem("cartId", finalCartId); // Lưu cartId vào localStorage
    }

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
      longitude,
      latitude,
      paymentChannel: mapPaymentMethodToChannel(paymentMethod),
      orderItems: cartItems.map((item) => ({
        productId: item.productId || item.id,
        cartItemId: item.cartItemId, // Thêm cartItemId nếu có
        quantity: item.quantity,
        price: item.price || item.total / item.quantity,
        total: item.total,
      })),
      note: form.note || null,
      userVoucherId,
      cartId: finalCartId,
    };

    console.log("📦 Order data gửi lên:", JSON.stringify(orderData, null, 2));

    const res = await OrderService.createOrder(orderData, accessToken, finalCartId);
    console.log("📩 Response từ createOrder:", JSON.stringify(res, null, 2));

    const orderFromServer = res?.data || res;
    const orderId = orderFromServer.orderId || orderFromServer.id;

    if (!orderId) {
      throw new Error("Không nhận được orderId từ server. Response: " + JSON.stringify(res));
    }

    const fullOrderData = {
      ...orderFromServer,
      orderItems: orderData.orderItems,
      shippingFee: orderData.shippingFee,
      voucherDiscountAmount: orderData.voucherDiscountAmount,
      userVoucherId,
      selectedVouchers,
    };

    localStorage.setItem("lastOrderData", JSON.stringify(fullOrderData));
    await clearCartMutation.mutateAsync();

    navigate(`/order-confirmation/${orderId}`, { state: fullOrderData });
  } catch (err) {
    console.error("Order error:", err.response?.data || err.message);
    setError(err.response?.data?.message || err.message || "Lỗi khi đặt hàng");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] bg-[#fffaf3] text-gray-700">
      <Header />
      <main className="max-w-6xl px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="sticky order-1 top-8 h-fit lg:order-none">
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
            <div className="p-6 space-y-6 bg-white shadow-md rounded-2xl">
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
                        className="object-cover w-32 h-32 border rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold">{item.productName}</h3>

                        {/* Hiển thị số lượng dưới tên sản phẩm */}
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>

                        <div className="mt-2 font-bold text-primary">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                    </div>

                      {/* <VoucherSection
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
                      /> */}
                    </div>
                  );
                })
              )}
            </div>
            <DeliveryForm
              form={form}
              setForm={setForm}
              addressFromMap={addressFromMap}
              onAddressSelect={SetDeliveryAddress} // 👈 đổi tên cho rõ ràng
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              handleSubmit={handleSubmit}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;