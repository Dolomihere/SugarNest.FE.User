import { useState } from "react";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function UserPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Bánh Mì Bơ Tỏi",
      price: 30000,
      quantity: 2,
      image:
        "https://i.pinimg.com/736x/63/71/34/637134981c776d81936911f22bdb6f0a.jpg",
    },
    {
      id: 2,
      name: "Bánh Mousse Dâu",
      price: 45000,
      quantity: 1,
      image:
        "https://i.pinimg.com/736x/0b/1b/fe/0b1bfefb438f47708cb0c57538c355b4.jpg",
    },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value) + " VND";

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

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

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-main">
      <Header />

      <main className="w-full max-w-7xl mx-auto px-4 pt-12 pb-24 min-h-[90vh] space-y-6 ">
        {/* <h2 className="text-2xl font-bold text-center text-heading">Giỏ Hàng</h2> */}

        <div className="">
          <div className=" bg-white rounded-md shadow-md overflow-x-auto mb-12">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <img
                  src="images/Cart.png"
                  alt="Giỏ hàng trống"
                  className="w-40 h-35 mb-4"
                />
                <p className="text-gray-500 text-lg mb-4">
                  Giỏ hàng của bạn còn trống
                </p>
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
                      key={item.id}
                      className="hover:bg-orange-50 transition duration-200"
                    >
                      <td className="px-6 py-4">
                        <input type="checkbox" className="accent-amber-500" />
                      </td>
                      <td className="px-6 py-4 flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <span className="font-medium">{item.name}</span>
                      </td>
                      <td className="px-6 py-4 text-amber-600">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="px-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="px-2">{item.quantity}</span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="px-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-yellow-700">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
