import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fffaf3] flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-lg">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-600 mb-6">
            Đơn hàng của bạn đã được ghi nhận. Cảm ơn bạn đã mua sắm tại cửa
            hàng của chúng tôi.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="bg-[#a17455] text-white px-6 py-2 rounded-lg hover:bg-[#8c5e42] transition"
            >
              Quay lại Trang chủ
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="border border-[#a17455] text-[#a17455] px-6 py-2 rounded-lg hover:bg-[#a17455] hover:text-white transition"
            >
              Xem đơn hàng
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
