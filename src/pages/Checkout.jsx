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
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [shippingFee, setShippingFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    deliveryTime: "",
    note: "",
    isBuyNow: "0",
    isBuyInShop: "0"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedVouchers, setSelectedVouchers] = useState({});
  const [productDiscounts, setProductDiscounts] = useState({});
  const [selectedOrderVoucher, setSelectedOrderVoucher] = useState(null);
  const [orderDiscount, setOrderDiscount] = useState(0);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  const { cartData, guestCartId: stateGuestCartId } = location.state || {};
  const guestCartId = stateGuestCartId || localStorage.getItem("guestCartId");
  const cartItems = cartData?.cartItems || [];
  const accessToken = localStorage.getItem("accessToken");
  const isLoggedIn = !!accessToken;

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const totalItemDiscount = Object.values(productDiscounts).reduce((sum, d) => sum + d, 0);
  const totalDiscount = totalItemDiscount + orderDiscount;
  const total = subtotal + shippingFee - totalDiscount;

  useEffect(() => {
    console.log("Subtotal:", subtotal, "Cart Items:", cartItems);
  }, [subtotal, cartItems]);

  // Lấy voucher toàn đơn
  const { data: orderVouchers = [], isLoading: isLoadingVouchers, error: voucherError } = useQuery({
    queryKey: ["orderVouchers", accessToken],
    queryFn: async () => {
      try {
        const data = await VoucherService.getOrderVouchers(accessToken);
        console.log("Order Vouchers from API:", JSON.stringify(data, null, 2));
        return data.map((v) => ({
          voucherId: v.userVoucherId || v.voucherId, // Use userVoucherId for uniqueness
          minPriceCondition: v.minPriceCondition,
          percentValue: v.percentValue,
          hardValue: v.hardValue,
          startTime: v.startTime,
          endTime: v.endTime,
          isUsed: v.isUsed,
        }));
      } catch (error) {
        console.error("Error fetching order vouchers:", error);
        throw new Error("Không thể tải danh sách voucher toàn đơn: " + (error.response?.data?.message || error.message));
      }
    },
    enabled: isLoggedIn,
  });

  useEffect(() => {
    if (voucherError) {
      console.error("Voucher fetch error:", voucherError);
      setError("Không thể tải voucher toàn đơn: " + voucherError.message);
    }
  }, [voucherError]);

  // Lấy voucher sản phẩm
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

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      for (const item of cartItems) {
        try {
          await CartService.deleteItem(item.cartItemId, accessToken);
        } catch (err) {
          console.error(`Không thể xóa sản phẩm ${item.cartItemId}:`, err);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        isLoggedIn ? ["userCart", accessToken] : ["guestCart", guestCartId]
      );
      if (!isLoggedIn && guestCartId) localStorage.removeItem("guestCartId");
    },
    onError: (err) => {
      setError(`Không thể xóa giỏ hàng: ${err.message}`);
    },
  });

  const handleAddressSelect = (address, lat, lng) => {
    console.log("Selected address:", { address, lat, lng });
    setAddressFromMap(address);
    setCoordinates({ lat, lng });
    setLatitude(lat);
    setLongitude(lng);
  };

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

  const handleSelectOrderVoucher = (voucher) => {
    console.log("=== Attempting to apply voucher ===");
    console.log("Selected voucher:", voucher);
    console.log("Current subtotal:", subtotal);

    if (!voucher) {
      setSelectedOrderVoucher(null);
      setOrderDiscount(0);
      console.log("No voucher selected. Discount set to 0.");
      return;
    }

    const isBelowMin = subtotal < voucher.minPriceCondition;
    const isAlreadyUsed = voucher.isUsed;
    const isExpired = new Date(voucher.endTime) < new Date();

    console.log(
      `Voucher conditions -> minPriceCondition: ${voucher.minPriceCondition}, isUsed: ${voucher.isUsed}, isExpired: ${isExpired}`
    );

    if (isBelowMin) {
      console.warn(
        `Voucher ${voucher.voucherId} not applied: subtotal ${subtotal} < minPriceCondition ${voucher.minPriceCondition}`
      );
      setError(`Voucher không áp dụng được: Tổng đơn hàng (${formatCurrency(subtotal)}) nhỏ hơn giá trị tối thiểu (${formatCurrency(voucher.minPriceCondition)})`);
      setSelectedOrderVoucher(null);
      setOrderDiscount(0);
      return;
    }

    if (isAlreadyUsed) {
      console.warn(`Voucher ${voucher.voucherId} not applied: voucher has already been used`);
      setError(`Voucher ${voucher.voucherId} không áp dụng được: Voucher đã được sử dụng`);
      setSelectedOrderVoucher(null);
      setOrderDiscount(0);
      return;
    }

    if (isExpired) {
      console.warn(`Voucher ${voucher.voucherId} not applied: voucher has expired`);
      setError(`Voucher ${voucher.voucherId} không áp dụng được: Voucher đã hết hạn`);
      setSelectedOrderVoucher(null);
      setOrderDiscount(0);
      return;
    }

    const discount = voucher.percentValue
      ? Math.round((subtotal * voucher.percentValue) / 100)
      : voucher.hardValue;

    setSelectedOrderVoucher(voucher);
    setOrderDiscount(discount);

    console.log(
      `Voucher ${voucher.voucherId} applied successfully. Discount: ${discount}`
    );
    console.log("Updated orderDiscount:", discount);
    console.log("Updated totalDiscount (including product discounts):", totalItemDiscount + discount);
  };

  const mapPaymentMethodToChannel = (method) => {
    switch (method) {
      case "cash":
        return 1;
      case "card":
        return 2;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const orderItemsPayload = cartItems.map((item) => {
        const cartItemKey = getCartItemKey(item);
        const selectedProductVoucher = selectedVouchers[cartItemKey];
        const discount = productDiscounts[cartItemKey] || 0;

        return {
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
          userItemVoucherId: selectedProductVoucher?.voucherId || null,
          discountAmount: discount,
        };
      });
    const voucherDiscountAmount = Object.values(productDiscounts).reduce(
      (sum, d) => sum + (d || 0),
      0
    );
    const orderTotal = subtotal + shippingFee - voucherDiscountAmount;

      const orderData = {
        Address: form.isBuyInShop == "0"? addressFromMap : null,
        CustomerName: form.name,
        PhoneNumber: form.phoneNumber,
        Email: form.email || null,
        DeliveryTime: form.isBuyNow == "0"? null : (form.deliveryTime ? new Date(form.deliveryTime).toISOString() : null),
        RecipientName: form.name || null,
        RecipientEmail: form.email || null,
        RecipientPhone: form.phoneNumber || null,
        Note: form.note || null,
        UserVoucher: selectedOrderVoucher?.voucherId || null,
        Latitude: form.isBuyInShop == "0"? (coordinates.lat || null) : null,
        Longitude: form.isBuyInShop == "0"? (coordinates.lng || null) : null,
      };


      const res = await OrderService.createOrder(orderData, accessToken, guestCartId);

      console.log("📩 Phản hồi từ createOrder:", JSON.stringify(res, null, 2));

      const orderFromServer = res?.data?.data || res?.data || res;
      const orderId = orderFromServer.orderId;

      if (!orderId) {
        throw new Error("Không nhận được orderId từ server. Phản hồi: " + JSON.stringify(res));
      }

      // Kiểm tra nếu voucher không được áp dụng
      if (selectedOrderVoucher && !orderFromServer.userVoucherId) {
        console.warn("Voucher không được áp dụng bởi backend:", selectedOrderVoucher.voucherId);
        setError("Voucher toàn đơn không được áp dụng. Vui lòng kiểm tra lại điều kiện voucher.");
      }

      const fullOrderData = {
        ...orderFromServer,
        orderItems: orderItemsPayload,
        shippingFee: orderFromServer.shippingFee || 0,
        userVoucherId: orderFromServer.userVoucherId || null,
        voucherDiscountAmount: orderFromServer.voucherDiscountAmount || 0,
        latitude: orderFromServer.latitude || null,
        longitude: orderFromServer.longitude || null,
      };

      localStorage.setItem("lastOrderData", JSON.stringify(fullOrderData));

      await clearCartMutation.mutateAsync();

      navigate(`/order-confirmation/${orderId}`, { state: fullOrderData });
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
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
              selectedOrderVoucher={selectedOrderVoucher}
              orderDiscount={orderDiscount}
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
                          <div>Số lượng: {item.quantity}</div>
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

            <div className="p-6 bg-white rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Voucher toàn đơn</h2>
              {isLoggedIn ? (
                <>
                  <button
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
                    onClick={() => setShowVoucherModal(true)}
                    disabled={isLoadingVouchers}
                  >
                    {isLoadingVouchers ? "Đang tải voucher..." : "Chọn voucher toàn đơn"}
                  </button>
                  {showVoucherModal && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                      <h3 className="font-semibold mb-2">Danh sách voucher khả dụng</h3>
                      {orderVouchers.length === 0 ? (
                        <p>Không có voucher toàn đơn nào khả dụng.</p>
                      ) : (
                        orderVouchers.map((voucher) => {
                          const eligible = !voucher.isUsed && subtotal >= voucher.minPriceCondition && new Date(voucher.endTime) >= new Date();
                          console.log(
                            `Voucher ${voucher.voucherId} eligible? ${eligible} | subtotal: ${subtotal} | minPriceCondition: ${voucher.minPriceCondition} | isUsed: ${voucher.isUsed} | expired: ${new Date(voucher.endTime) < new Date()}`
                          );

                          return (
                            <div
                              key={voucher.voucherId} // Use userVoucherId for unique key
                              className={`p-2 border-b cursor-pointer hover:bg-gray-200 ${
                                !eligible ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              onClick={() => eligible && handleSelectOrderVoucher(voucher)}
                            >
                              <p>
                                {voucher.percentValue
                                  ? `${voucher.percentValue}% (Đơn tối thiểu ${formatCurrency(voucher.minPriceCondition)})`
                                  : `${formatCurrency(voucher.hardValue)} (Đơn tối thiểu ${formatCurrency(voucher.minPriceCondition)})`}
                              </p>
                              <p className="text-sm text-gray-500">
                                Hết hạn: {new Date(voucher.endTime).toLocaleDateString()}
                              </p>
                            </div>
                          );
                        })
                      )}
                      <button
                        className="mt-2 text-red-600"
                        onClick={() => setShowVoucherModal(false)}
                      >
                        Đóng
                      </button>
                    </div>
                  )}
                  {selectedOrderVoucher && (
                    <div className="mt-4">
                      <p className="text-green-600">
                        Đã áp dụng voucher: {selectedOrderVoucher.percentValue
                          ? `${selectedOrderVoucher.percentValue}%`
                          : formatCurrency(selectedOrderVoucher.hardValue)}
                        {selectedOrderVoucher.minPriceCondition && ` (Đơn tối thiểu ${formatCurrency(selectedOrderVoucher.minPriceCondition)})`}
                      </p>
                      <p className="text-sm">Chiết khấu: {formatCurrency(orderDiscount)}</p>
                      <button
                        className="text-red-600 text-sm mt-2"
                        onClick={() => handleSelectOrderVoucher(null)}
                      >
                        Hủy voucher
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500">Vui lòng đăng nhập để sử dụng voucher toàn đơn.</p>
              )}
            </div>

            <DeliveryForm
              form={form}
              setForm={setForm}
              addressFromMap={addressFromMap}
              setAddressFromMap={setAddressFromMap}
              onAddressSelect={handleAddressSelect}
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