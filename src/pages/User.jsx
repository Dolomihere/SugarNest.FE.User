import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import CartService from "../services/CartService";
import ProductService from "../services/ProductService";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";

export default function UserPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");

  // Lấy token và kiểm tra đăng nhập
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  const isLoggedIn = token && token !== "undefined" && token !== "null";
  console.log("Token:", token);

  // Lấy dữ liệu giỏ hàng
  const { data: cartData, isLoading, error, refetch } = useQuery({
    queryKey: ["userCart", token || null],
    queryFn: async () => {
      try {
        if (isLoggedIn) {
          const response = await CartService.getUserCart(token);
          console.log("Cart data from server:", response.data.data);
          return response.data.data;
        } else {
          const localCart = JSON.parse(localStorage.getItem("local_cart") || "[]");
          console.log("Local cart:", localCart);
          return { cartItems: localCart };
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        if (err.message.includes("Phiên đăng nhập hết hạn")) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          sessionStorage.removeItem("accessToken");
          const localCart = JSON.parse(localStorage.getItem("local_cart") || "[]");
          return { cartItems: localCart };
        }
        throw new Error("Không thể tải dữ liệu giỏ hàng.");
      }
    },
    enabled: true,
  });

  // Lấy danh sách sản phẩm
  const { data: products = [] } = useQuery({
    queryKey: ["allProducts"],
    queryFn: () => ProductService.getAllProducts().then((res) => {
      console.log("Products data:", res.data.data);
      return res.data.data;
    }),
  });

  // Mutation để cập nhật số lượng
  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }) => {
      if (isLoggedIn) {
        return CartService.updateQuantity(cartItemId, quantity, token);
      } else {
        return Promise.resolve(updateLocalCartQuantity(cartItemId, quantity));
      }
    },
    onSuccess: () => refetch(),
    onError: (err) => alert(`Không thể cập nhật số lượng: ${err.message}`),
  });

  // Mutation để xóa sản phẩm
  const deleteItemMutation = useMutation({
    mutationFn: (cartItemId) => {
      if (isLoggedIn) {
        return CartService.deleteItem(cartItemId, token);
      } else {
        return Promise.resolve(deleteLocalCartItem(cartItemId));
      }
    },
    onSuccess: () => refetch(),
    onError: (err) => alert(`Không thể xóa sản phẩm: ${err.message}`),
  });

  // Cập nhật số lượng trong localStorage
  const updateLocalCartQuantity = (productId, quantity) => {
    const cart = JSON.parse(localStorage.getItem("local_cart") || "[]");
    const updatedCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    localStorage.setItem("local_cart", JSON.stringify(updatedCart));
    return updatedCart;
  };

  // Xóa sản phẩm trong localStorage
  const deleteLocalCartItem = (productId) => {
    const cart = JSON.parse(localStorage.getItem("local_cart") || "[]");
    const updatedCart = cart.filter((item) => item.productId !== productId);
    localStorage.setItem("local_cart", JSON.stringify(updatedCart));
    return updatedCart;
  };

  // Lấy ảnh sản phẩm
  const getProductImage = (productId) => {
    const product = products.find((p) => p.productId === productId);
    console.log(`Product for ID ${productId}:`, product);
    return product?.imgs
      ? Array.isArray(product.imgs)
        ? product.imgs[0]
        : product.imgs
      : "/images/placeholder.png";
  };

  // Lấy tên sản phẩm
  const getProductName = (productId) => {
    const product = products.find((p) => p.productId === productId);
    return product?.name || "Sản phẩm";
  };

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) return;
    updateQuantityMutation.mutate({ cartItemId: itemId, quantity });
  };

  // Xử lý xóa sản phẩm
  const handleDelete = (itemId) => {
    deleteItemMutation.mutate(itemId);
  };

  // Xử lý áp dụng mã giảm giá
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "GIAM10") {
      setDiscount(0.1);
      setPromoMessage("Áp dụng mã GIAM10 thành công! Giảm 10%.");
    } else {
      setDiscount(0);
      setPromoMessage("Mã không hợp lệ hoặc đã hết hạn.");
    }
  };

  // Tính toán tổng tiền
  const subtotal = cartData?.cartItems?.reduce(
    (sum, item) =>
      sum +
      (isLoggedIn
        ? item.total
        : item.quantity *
          (products.find((p) => p.productId === item.productId)?.unitPrice || 0)),
    0
  ) ?? 0;
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  // Định dạng tiền tệ
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value) + " VND";

  // Render
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-gray-800">
      <Header />
      <main className="w-full max-w-7xl mx-auto px-4 pt-12 pb-24 min-h-[90vh] space-y-6">
        {isLoading && <p className="text-center text-gray-600">Đang tải giỏ hàng...</p>}
        {error && (
          <p className="text-center text-red-500">
            Lỗi khi tải giỏ hàng: {error.message}.{" "}
            {error.message.includes("Phiên đăng nhập hết hạn") && (
              <button
                className="underline text-amber-600"
                onClick={() => navigate("/login")}
              >
                Đăng nhập lại
              </button>
            )}
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
              <p className="mb-4 text-lg text-gray-500">
                Giỏ hàng của bạn còn trống
              </p>
              <button
                className="px-6 py-2 font-semibold text-white rounded bg-amber-600 hover:bg-amber-700"
                onClick={() => navigate("/products")}
              >
                MUA NGAY
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
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
                    key={isLoggedIn ? item.cartItemId : item.productId}
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
                        <span className="font-medium">
                          {isLoggedIn ? item.productName : getProductName(item.productId)}
                        </span>
                        {(isLoggedIn ? item.cartItemOptions : item.productItemOptionModels)?.length > 0 && (
                          <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                            {(isLoggedIn ? item.cartItemOptions : item.productItemOptionModels).map((opt) => (
                              <li key={isLoggedIn ? opt.cartItemOptionId : opt.optionItemId}>
                                {opt.optionValue || "Tùy chọn"}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-amber-600">
                      {formatCurrency(
                        isLoggedIn
                          ? item.total / item.quantity
                          : products.find((p) => p.productId === item.productId)?.unitPrice || 0
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              isLoggedIn ? item.cartItemId : item.productId,
                              item.quantity - 1
                            )
                          }
                          className="px-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              isLoggedIn ? item.cartItemId : item.productId,
                              item.quantity + 1
                            )
                          }
                          className="px-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-amber-600">
                      {formatCurrency(
                        isLoggedIn
                          ? item.total
                          : item.quantity *
                              (products.find((p) => p.productId === item.productId)?.unitPrice || 0)
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          handleDelete(isLoggedIn ? item.cartItemId : item.productId)
                        }
                        className="text-red-500 hover:text-red-600"
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
                Mã giảm giá
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-amber-200"
                  placeholder="Nhập mã giảm giá"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-3 py-1.5 text-xs font-semibold text-white rounded bg-amber-600 hover:bg-amber-700 h-10"
                >
                  Áp dụng
                </button>
              </div>
              {promoMessage && (
                <p
                  className={`text-sm mt-1 ${
                    discount > 0 ? "text-green-600" : "text-red-500"
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
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
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

            <button
              onClick={() => navigate("/checkout")}
              className="flex items-center justify-center w-full mt-2 text-sm font-semibold text-white rounded bg-amber-600 hover:bg-amber-700 h-11"
            >
              Mua Hàng
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
