import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import CartService from "../services/CartService";
import ProductService from "../services/ProductService";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function UserPage() {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => await
      CartService.getGuestCart("01B2E2DF-61DF-4B3F-BC98-6A31A6D726FC").then(
        (res) => res.data.data
      ),
  });

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await
      ProductService.getAllProducts().then((res) => res.data.data),
  });

  const mutateQuantity = useMutation({
    queryKey: ["quantity"],
    queryFn: async (cartItemId, quantity, cartId) => await 
      CartService.updateQuantity(cartItemId, quantity, cartId)
  });

  useEffect(() => {
    if (cartData && productsData) {
          console.log("Cart Items:", cartData.cartItems);
    console.log("Products:", productsData);
      const enrichedCartItems = cartData.cartItems.map((item) => {
        const matchedProduct = productsData.find(
          (product) => product.productId === item.productId
        );

        return {
          cartItemId: item.cartItemId,
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          itemAdditionalPrice: item.itemAdditionalPrice,
          total: (item.unitPrice + item.itemAdditionalPrice) * item.quantity,
          image: matchedProduct?.imgs?.[0],
          note: item.note,
          cartItemOptions: item.cartItemOptions,
        };
      });

      setCartItems(enrichedCartItems);
    }
  }, [cartData, productsData]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value) + " VND";

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

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

  const handleRemoveItem = (id) => {
    // implement delete logic with CartService.deleteItem(id)
    console.log("Delete item", id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-main">
      <Header />
      <main className="w-full max-w-7xl mx-auto px-4 pt-12 pb-24 min-h-[90vh] space-y-6">
        <div className="bg-white rounded-md shadow-md overflow-x-auto mb-12">
          {isLoading ? (
            <div className="p-8 text-center text-gray-600">Đang tải giỏ hàng...</div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <img
                src="images/Cart.png"
                alt="Giỏ hàng trống"
                className="w-40 h-35 mb-4"
              />
              <p className="text-gray-500 text-lg mb-4">Giỏ hàng của bạn còn trống</p>
              <button
                className="btn-primary text-white font-semibold px-6 py-2 rounded"
                onClick={() => (window.location.href = "/products")}
              >
                MUA NGAY
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm font-medium text-gray-600">
                  <th className="px-6 py-3 w-12">
                    <input type="checkbox" className="accent-amber-500" />
                  </th>
                  <th></th>
                  <th className="px-6 py-3">Sản phẩm</th>
                  <th className="px-6 py-3">Giá</th>
                  <th className="px-6 py-3">Số lượng</th>
                  <th className="px-6 py-3">Tổng</th>
                  <th className="px-6 py-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <tr
                    key={item.cartItemId}
                    className="hover:bg-orange-50 transition duration-200"
                  >
                    <td className="px-6 py-4">
                      <input type="checkbox" className="accent-amber-500" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-4 items-start">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-16 h-16 rounded object-cover border"
                        />  
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{item.productName}</span>
                        <span className="text-xs text-gray-500">{item.note}</span>
                        {item.cartItemOptions?.length > 0 && (
                          <ul className="text-xs text-gray-500 mt-1 list-disc ml-4">
                            {item.cartItemOptions.map((opt) => (
                              <li key={opt.cartItemOptionId}>
                                {opt.optionGroupName}: {opt.optionValue} (
                                +{formatCurrency(opt.optionAdditionalPrice)})
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-amber-600">
                      {formatCurrency(item.unitPrice + item.itemAdditionalPrice)}
                    </td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4 font-semibold text-yellow-700">
                      {formatCurrency(item.total)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleRemoveItem(item.cartItemId)}
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

        {cartItems.length > 0 && (
          <div className="bg-white rounded shadow p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-heading">
                Mã giảm giá
              </label>
              <div className="flex gap-2 flex-col sm:flex-row">
                <input
                  type="text"
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-[var(--btn-primary-bg)]"
                  placeholder="Nhập mã giảm giá"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button
                  onClick={handleApplyPromo}
                  className="btn-primary px-3 py-1.5 text-xs w-40 h-10"
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

            <div className="border-t pt-4 space-y-2 text-sm text-main">
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
              <div className="flex justify-between font-bold text-heading text-base">
                <span>Tổng thanh toán:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="text-right text-sm text-sub">
              Tổng cộng ({cartItems.length} Sản phẩm)
            </div>

            <button className="w-full mt-2 btn-primary h-11 flex items-center justify-center text-sm font-semibold">
              Mua Hàng
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
