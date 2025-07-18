import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import CartService from "../services/CartService";
import ProductService from "../services/ProductService";
import VoucherService from "../services/VoucherService";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";

export default function UserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [voucherInput, setVoucherInput] = useState("");

  // Get token and check login status
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  const isLoggedIn = token && token !== "undefined" && token !== "null";
  const guestCartId = localStorage.getItem("guestCartId");

  // Check if redirected from login
  const fromLogin = location.state?.fromLogin && guestCartId;
  const fromPath = location.state?.from || "/";

  // Fetch cart data (user or guest)
  const { data: cartData, isLoading, error, refetch } = useQuery({
    queryKey: isLoggedIn ? ["userCart", token] : ["guestCart", guestCartId],
    queryFn: async () => {
      try {
        if (isLoggedIn) {
          const response = await CartService.getUserCart(token);
          return response.data.data || { cartItems: [] };
        } else {
          if (!guestCartId || typeof guestCartId !== "string" || guestCartId.length === 0) {
            return { cartItems: [] };
          }
          const response = await CartService.getGuestCart(guestCartId);
          return response.data.data || { cartItems: [] };
        }
      } catch (err) {
        if (isLoggedIn && err.message.includes("Phiên đăng nhập hết hạn")) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          sessionStorage.removeItem("accessToken");
          navigate("/signin", { state: { from: location.pathname } });
          throw err;
        }
        return { cartItems: [] };
      }
    },
    enabled: isLoggedIn || (typeof guestCartId === "string" && guestCartId.length > 0),
  });

  // Mutation to fetch voucher by ID
  const fetchVoucherMutation = useMutation({
    mutationFn: (voucherId) => VoucherService.getVoucherById(voucherId, token),
    onSuccess: (response) => {
      const voucher = response.data.data;
      if (voucher && voucher.isActive && (!voucher.endTime || new Date(voucher.endTime) > new Date())) {
        setSelectedVoucher(voucher);
        setPromoMessage("");
      } else {
        setSelectedVoucher(null);
        setDiscount(0); // Reset discount on invalid voucher
        setPromoMessage("Mã voucher không hợp lệ hoặc đã hết hạn.");
      }
    },
    onError: (err) => {
      setSelectedVoucher(null);
      setDiscount(0); // Reset discount on error
      setPromoMessage(`Không tìm thấy voucher: ${err.message}`);
    },
  });

  // Merge guest cart with user cart after login
  const mergeCartMutation = useMutation({
    mutationFn: async () => {
      if (!guestCartId || typeof guestCartId !== "string" || guestCartId.length === 0) {
        return null;
      }
      const response = await CartService.mergeGuestCart(guestCartId, token);
      const userCartId = response.data.data.cartId;
      await CartService.deleteCart(guestCartId, token);
      return userCartId;
    },
    onSuccess: () => {
      localStorage.removeItem("guestCartId");
      queryClient.invalidateQueries(["userCart", token]);
      refetch();
      navigate(fromPath, { replace: true, state: {} });
    },
    onError: (err) => {
      console.error(`Không thể hợp nhất giỏ hàng: ${err.message}`);
      alert(`Lỗi khi hợp nhất giỏ hàng: ${err.message}`);
    },
  });

  useEffect(() => {
    if (isLoggedIn && fromLogin && guestCartId && typeof guestCartId === "string" && guestCartId.length > 0) {
      mergeCartMutation.mutate();
    }
  }, [isLoggedIn, fromLogin, guestCartId, mergeCartMutation]);

  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ["allProducts"],
    queryFn: () => ProductService.getAllProducts().then((res) => res.data.data),
    enabled: true,
  });

  // Mutation to update quantity
  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }) =>
      CartService.updateQuantity(cartItemId, quantity, token),
    onSuccess: () => refetch(),
    onError: (err) => alert(`Không thể cập nhật số lượng: ${err.message}`),
  });

  // Mutation to delete item
  const deleteItemMutation = useMutation({
    mutationFn: (cartItemId) => CartService.deleteItem(cartItemId, token),
    onSuccess: () => {
      queryClient.invalidateQueries(isLoggedIn ? ["userCart", token] : ["guestCart", guestCartId]);
      refetch();
      if (cartData?.cartItems?.length === 1) {
        window.location.reload();
      }
    },
    onError: (err) => alert(`Không thể xóa sản phẩm: ${err.message}`),
  });

  // Mutation to clear cart
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const cartItems = cartData?.cartItems || [];
      for (const item of cartItems) {
        await CartService.deleteItem(item.cartItemId, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(isLoggedIn ? ["userCart", token] : ["guestCart", guestCartId]);
      refetch();
      window.location.reload();
    },
    onError: (err) => alert(`Không thể xóa toàn bộ giỏ hàng: ${err.message}`),
  });

  // Get product image
  const getProductImage = (productId) => {
    const product = products.find((p) => p.productId === productId);
    return product?.imgs
      ? Array.isArray(product.imgs)
        ? product.imgs[0]
        : product.imgs
      : "/images/placeholder.png";
  };

  // Get product name
  const getProductName = (productId) => {
    const product = products.find((p) => p.productId === productId);
    return product?.name || "Sản phẩm";
  };

  // Handle quantity change
  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1 || !isLoggedIn) return;
    updateQuantityMutation.mutate({ cartItemId: itemId, quantity });
  };

  // Handle delete item
  const handleDelete = (itemId) => {
    if (!isLoggedIn) return;
    deleteItemMutation.mutate(itemId);
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (!isLoggedIn) return;
    clearCartMutation.mutate();
  };

  // Handle apply voucher
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

    const subtotal = cartData?.cartItems?.reduce((sum, item) => sum + item.total, 0) ?? 0;
    fetchVoucherMutation.mutate(voucherInput.trim());
  };

  // Apply voucher after fetching
  useEffect(() => {
    if (!selectedVoucher) {
      setDiscount(0);
      return;
    }

    const subtotal = cartData?.cartItems?.reduce((sum, item) => sum + item.total, 0) ?? 0;
    if (selectedVoucher.minPriceCondition && subtotal < selectedVoucher.minPriceCondition) {
      setSelectedVoucher(null); // Clear selected voucher
      setDiscount(0); // Ensure no discount is applied
      setPromoMessage(`Tổng đơn hàng phải đạt tối thiểu ${formatCurrency(selectedVoucher.minPriceCondition)} để sử dụng voucher này.`);
      return;
    }

    if (!selectedVoucher.isActive || (selectedVoucher.endTime && new Date(selectedVoucher.endTime) < new Date())) {
      setSelectedVoucher(null); // Clear selected voucher
      setDiscount(0); // Ensure no discount is applied
      setPromoMessage("Voucher đã hết hạn hoặc không hoạt động.");
      return;
    }

    let discountValue = 0;
    if (selectedVoucher.percentValue) {
      discountValue = selectedVoucher.percentValue / 100;
      setPromoMessage(`Áp dụng voucher ${selectedVoucher.name} thành công! Giảm ${selectedVoucher.percentValue}%.`);
    } else if (selectedVoucher.hardValue) {
      discountValue = selectedVoucher.hardValue / subtotal;
      setPromoMessage(`Áp dụng voucher ${selectedVoucher.name} thành công! Giảm ${formatCurrency(selectedVoucher.hardValue)}.`);
    }
    setDiscount(discountValue);
  }, [selectedVoucher, cartData]);

  // Calculate totals
  const subtotal = cartData?.cartItems?.reduce((sum, item) => sum + item.total, 0) ?? 0;
  const discountAmount = discount > 0 && selectedVoucher ? 
    (selectedVoucher.hardValue ? Math.min(selectedVoucher.hardValue, subtotal) : subtotal * discount) 
    : 0;
  const total = subtotal - discountAmount;

  // Format currency
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value) + " VND";

  // Redirect to login with state to return to current page
  const handleLoginRedirect = () => {
    navigate("/signin", { state: { from: location.pathname } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-gray-800">
      <Header />
      <main className="w-full max-w-7xl mx-auto px-4 pt-12 pb-24 min-h-[90vh] space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Giỏ hàng</h1>
          {cartData?.cartItems?.length > 0 && isLoggedIn && (
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600"
            >
              <FontAwesomeIcon icon={faTrashAlt} />
              Xóa tất cả
            </button>
          )}
        </div>

        {isLoading && (
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto border-t-2 border-b-2 rounded-full infinity-spin border-amber-600"></div>
            <p className="mt-4 text-lg text-gray-600">Đang tải giỏ hàng...</p>
          </div>
        )}
        {error && error.message.includes("Phiên đăng nhập hết hạn") && (
          <p className="text-center text-red-500">
            Lỗi khi tải giỏ hàng: {error.message}.{" "}
            <button
              className="underline text-amber-600"
              onClick={handleLoginRedirect}
            >
              Đăng nhập lại
            </button>
          </p>
        )}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          {cartData?.cartItems?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <img
                src="/images/Cart.png"
                alt="Giỏ hàng trống"
                className="w-40 mb-4 h-35"
              />
              <p className="mb-4 text-lg text-gray-600">
                Bạn chưa mua hàng, hãy mua hàng!
              </p>
              <button
                className="px-6 py-2 font-semibold text-white rounded bg-amber-600 hover:bg-amber-700"
                onClick={() => navigate("/products")}
              >
                MUA NGAY
              </button>
              {!isLoggedIn && (
                <button
                  className="px-6 py-2 mt-4 font-semibold text-white rounded bg-amber-600 hover:bg-amber-700"
                  onClick={handleLoginRedirect}
                >
                  Đăng nhập
                </button>
              )}
            </div>
          ) : (
            <table className="min-w-full border border-orange-400">
              <thead className="bg-orange-50">
                <tr className="text-sm font-medium text-left text-gray-600">
                  <th className="w-12 px-6 py-3">
                    <input type="checkbox" className="accent-amber-500" />
                  </th>
                  <th className="px-6 py-3">Sản phẩm</th>
                  <th className="px-6 py-3">Giá</th>
                  <th className="px-6 py-3">Số lượng</th>
                  <th className="px-6 py-3">Tổng</th>
                  <th className="px-6 py-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cartData?.cartItems?.map((item) => (
                  <tr
                    key={item.cartItemId}
                    className="transition duration-200 hover:bg-orange-50"
                  >
                    <td className="px-6 py-4">
                      <input type="checkbox" className="accent-amber-500" />
                    </td>
                    <td className="flex items-center gap-4 px-6 py-4">
                      <img
                        src={getProductImage(item.productId)}
                        alt={getProductName(item.productId)}
                        className="object-cover w-16 h-16 rounded"
                      />
                      <div>
                        <span className="font-medium">{item.productName}</span>
                        {item.cartItemOptions?.length > 0 && (
                          <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                            {item.cartItemOptions.map((opt) => (
                              <li key={opt.cartItemOptionId}>
                                {opt.optionValue || "Tùy chọn"}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-amber-600">
                      {formatCurrency(item.total / item.quantity)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.cartItemId, item.quantity - 1)
                          }
                          className="px-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                          disabled={!isLoggedIn}
                        >
                          -
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.cartItemId, item.quantity + 1)
                          }
                          className="px-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                          disabled={!isLoggedIn}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-amber-600">
                      {formatCurrency(item.total)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(item.cartItemId)}
                        className="text-red-500 hover:text-red-600"
                        disabled={!isLoggedIn}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {cartData?.cartItems?.length > 0 && (
          <div className="p-6 space-y-4 bg-white rounded-lg shadow-md">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Nhập mã voucher
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-amber-200"
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                  placeholder="Nhập ID voucher"
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
                    discount > 0 || selectedVoucher?.hardValue ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {promoMessage}
                </p>
              )}
            </div>

            <div className="pt-4 space-y-2 text-sm text-gray-700 border-t">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 || (selectedVoucher?.hardValue && selectedVoucher) ? (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-800">
                <span>Tổng thanh toán:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="text-sm text-right text-gray-600">
              Tổng cộng ({cartData?.cartItems?.length || 0} sản phẩm)
            </div>

            {isLoggedIn ? (
              <button
                onClick={() => navigate("/checkout")}
                className="flex items-center justify-center w-full mt-2 text-sm font-semibold text-white rounded bg-amber-600 hover:bg-amber-700 h-11"
              >
                Mua Hàng
              </button>
            ) : (
              <button
                onClick={handleLoginRedirect}
                className="flex items-center justify-center w-full mt-2 text-sm font-semibold text-white rounded bg-amber-600 hover:bg-amber-700 h-11"
              >
                Đăng nhập để tiếp tục
              </button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}