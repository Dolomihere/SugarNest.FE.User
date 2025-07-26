import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import CartService from "../services/CartService";
import ProductService from "../services/ProductService";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";

export default function UserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Get token and check login status
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");
  const isLoggedIn = token && token !== "undefined" && token !== "null";
  const guestCartId = localStorage.getItem("guestCartId");

  // Check if redirected from login
  const fromLogin = location.state?.fromLogin && guestCartId;
  const fromPath = location.state?.from || "/";

  // Fetch cart data (user or guest)
  const {
    data: cartData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: isLoggedIn ? ["userCart", token] : ["guestCart", guestCartId],
    queryFn: async () => {
      try {
        if (isLoggedIn) {
          const response = await CartService.getUserCart(token);
          return response.data.data || { cartItems: [] };
        } else {
          if (
            !guestCartId ||
            typeof guestCartId !== "string" ||
            guestCartId.length === 0
          ) {
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
    enabled:
      isLoggedIn || (typeof guestCartId === "string" && guestCartId.length > 0),
  });

  // Merge guest cart with user cart after login
  const mergeCartMutation = useMutation({
    mutationFn: async () => {
      if (
        !guestCartId ||
        typeof guestCartId !== "string" ||
        guestCartId.length === 0
      ) {
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
    if (
      isLoggedIn &&
      fromLogin &&
      guestCartId &&
      typeof guestCartId === "string" &&
      guestCartId.length > 0
    ) {
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
      queryClient.invalidateQueries(
        isLoggedIn ? ["userCart", token] : ["guestCart", guestCartId]
      );
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
      queryClient.invalidateQueries(
        isLoggedIn ? ["userCart", token] : ["guestCart", guestCartId]
      );
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

  // Redirect to login with state to return to current page
  const handleLoginRedirect = () => {
    navigate("/signin", { state: { from: location.pathname } });
  };

  // Navigate to checkout with cart data
  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate("/signin", { state: { from: "/checkout" } });
      return;
    }
    const subtotal =
      cartData?.cartItems?.reduce((sum, item) => sum + item.total, 0) ?? 0;
    const total = subtotal; // No discount applied here
    navigate("/checkout", {
      state: {
        cartData,
        subtotal,
        total,
        guestCartId: isLoggedIn ? null : guestCartId,
      },
    });
  };

  // Format currency
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value) + " VND";

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-gradient-to-b from-amber-50 to-white">
      <Header />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 min-h-[90vh] space-y-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">Giỏ Hàng Của Bạn</h1>
          {cartData?.cartItems?.length > 0 && isLoggedIn && (
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-300 ease-in-out transform bg-red-600 rounded-lg shadow hover:bg-red-700 hover:scale-105"
            >
              <FontAwesomeIcon icon={faTrashAlt} />
              Xóa Tất Cả
            </button>
          )}
        </div>

        {isLoading && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto border-4 rounded-full border-t-amber-600 border-b-amber-600 animate-spin"></div>
            <p className="mt-6 text-lg font-medium text-gray-600">Đang tải giỏ hàng...</p>
          </div>
        )}
        {error && error.message.includes("Phiên đăng nhập hết hạn") && (
          <p className="font-medium text-center text-red-600">
            Lỗi khi tải giỏ hàng: {error.message}.{" "}
            <button
              className="underline transition-colors duration-200 text-amber-600 hover:text-amber-700"
              onClick={handleLoginRedirect}
            >
              Đăng nhập lại
            </button>
          </p>
        )}
        <div className="overflow-x-auto bg-white border border-gray-100 shadow-lg rounded-xl">
          {cartData?.cartItems?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <img
                src="/images/Cart.png"
                alt="Giỏ hàng trống"
                className="w-48 mb-6 transition-transform duration-300 transform hover:scale-105"
              />
              <p className="mb-6 text-xl font-medium text-gray-600">Giỏ hàng của bạn đang trống!</p>
              <button
                className="px-8 py-3 font-semibold text-white transition-all duration-300 ease-in-out transform rounded-lg shadow-md bg-amber-600 hover:bg-amber-700 hover:scale-105"
                onClick={() => navigate("/products")}
              >
                Khám Phá Sản Phẩm
              </button>
              {!isLoggedIn && (
                <button
                  className="px-8 py-3 mt-4 font-semibold text-white transition-all duration-300 ease-in-out transform bg-gray-600 rounded-lg shadow-md hover:bg-gray-700 hover:scale-105"
                  onClick={handleLoginRedirect}
                >
                  Đăng Nhập
                </button>
              )}
            </div>
          ) : (
            <table className="min-w-full border-separate border-spacing-0">
              <thead className="bg-amber-50">
                <tr className="text-sm font-semibold text-gray-700">
                  <th className="w-12 px-6 py-4 rounded-tl-xl">
                    <input type="checkbox" className="accent-amber-600" />
                  </th>
                  <th className="px-6 py-4 text-left">Sản Phẩm</th>
                  <th className="px-6 py-4 text-left">Giá</th>
                  <th className="px-6 py-4 text-left">Số Lượng</th>
                  <th className="px-6 py-4 text-left">Tổng</th>
                  <th className="px-6 py-4 text-center rounded-tr-xl">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cartData?.cartItems?.map((item) => (
                  <tr
                    key={item.cartItemId}
                    className="transition duration-300 hover:bg-amber-50"
                  >
                    <td className="px-6 py-4">
                      <input type="checkbox" className="accent-amber-600" />
                    </td>
                    <td className="flex items-center gap-4 px-6 py-4">
                      <div className="overflow-hidden rounded-lg shadow-sm">
                        <img
                          src={getProductImage(item.productId)}
                          alt={getProductName(item.productId)}
                          className="object-cover w-20 h-20 transition-transform duration-300 transform hover:scale-110"
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">{item.productName}</span>
                        {item.cartItemOptions?.length > 0 && (
                          <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                            {item.cartItemOptions.map((opt) => (
                              <li key={opt.cartItemOptionId}>
                                {opt.optionValue || "Tùy chọn"}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-amber-600">
                      {formatCurrency(item.total / item.quantity)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg w-fit">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.cartItemId,
                              item.quantity - 1
                            )
                          }
                          className="px-3 py-1 text-gray-700 transition-colors duration-200 bg-white rounded-lg shadow-sm hover:bg-gray-200"
                          disabled={!isLoggedIn}
                        >
                          -
                        </button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.cartItemId,
                              item.quantity + 1
                            )
                          }
                          className="px-3 py-1 text-gray-700 transition-colors duration-200 bg-white rounded-lg shadow-sm hover:bg-gray-200"
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
                        className="text-red-500 transition-colors duration-200 hover:text-red-600"
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
          <div className="p-6 space-y-6 bg-white border border-gray-100 shadow-lg rounded-xl">
            <div className="pt-4 space-y-3 text-sm text-gray-700 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="font-medium">Tạm tính:</span>
                <span>
                  {formatCurrency(
                    cartData?.cartItems?.reduce(
                      (sum, item) => sum + item.total,
                      0
                    ) ?? 0
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-800">
                <span>Tổng thanh toán:</span>
                <span className="text-amber-600">
                  {formatCurrency(
                    cartData?.cartItems?.reduce(
                      (sum, item) => sum + item.total,
                      0
                    ) ?? 0
                  )}
                </span>
              </div>
            </div>

            <div className="text-sm font-medium text-right text-gray-600">
              Tổng cộng ({cartData?.cartItems?.length || 0} sản phẩm)
            </div>

            {isLoggedIn ? (
              <button
                onClick={handleCheckout}
                className="w-full py-3 text-base font-semibold text-white transition-all duration-300 ease-in-out transform rounded-lg shadow-md bg-amber-600 hover:bg-amber-700 hover:scale-105"
              >
                Thanh Toán Ngay
              </button>
            ) : (
              <button
                onClick={handleLoginRedirect}
                className="w-full py-3 text-base font-semibold text-white transition-all duration-300 ease-in-out transform bg-gray-600 rounded-lg shadow-md hover:bg-gray-700 hover:scale-105"
              >
                Đăng Nhập Để Tiếp Tục
              </button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}