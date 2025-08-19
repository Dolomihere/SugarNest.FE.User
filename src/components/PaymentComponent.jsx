import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionService from "../services/TransactionService";

const PaymentForm = ({ order, formatCurrency, totalAmount }) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const orderId = order?.id || order?.orderId;

  const remainingAmount = isNaN(parseFloat(receivedAmount))
    ? 0
    : parseFloat(receivedAmount) - totalAmount;

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!orderId) {
      alert("Không tìm thấy Order ID, vui lòng thử lại!");
      return;
    }

    setIsSubmitting(true);
    try {
      if (paymentMethod === "cash") {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          navigate("/signin");
          return;
        }

        const parsedAmount = parseFloat(receivedAmount);
        if (!receivedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
          alert("Vui lòng nhập số tiền nhận hợp lệ (lớn hơn 0).");
          return;
        }
        if (parsedAmount < totalAmount) {
          alert("Số tiền nhận phải lớn hơn hoặc bằng tổng thanh toán.");
          return;
        }

        console.log("📤 Gửi thanh toán tiền mặt:", orderId, {
          recievedAmount: parsedAmount,
        });

        const res = await TransactionService.createCashTransaction(orderId, {
          recievedAmount: parsedAmount, // ✅ khớp backend
        });

        console.log("✅ Phản hồi từ API (Cash):", res);

        if (!res || !res.isSuccess) {
          throw new Error("Backend không trả về dữ liệu giao dịch hợp lệ!");
        }

        alert("Thanh toán tiền mặt thành công!");
        navigate("/order-success");
      } else {
        console.log("📤 Tạo giao dịch VNPAY:", orderId);
        const response = await TransactionService.createVnPayTransaction(orderId);
        console.log("✅ Phản hồi từ API (VNPAY):", response);

        const url = response?.data; // ✅ lấy đúng field
        if (!url) {
          throw new Error("Không nhận được URL thanh toán từ VnPay.");
        }

        window.location.href = url;
      }
    } catch (error) {
      console.error("❌ Lỗi khi xử lý thanh toán:", error);
      alert(
        `Đã có lỗi xảy ra khi xử lý thanh toán: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Phương thức thanh toán</h3>
      <form onSubmit={handlePayment}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Chọn phương thức:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded-md"
            disabled={isSubmitting}
          >
            <option value="cash">Tiền mặt</option>
            <option value="bank">Chuyển khoản</option>
          </select>
        </div>

        {paymentMethod === "cash" && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Tổng thanh toán:</label>
              <p className="text-lg">{formatCurrency(totalAmount)}</p>
            </div>
            <div>
              <label className="block mb-2 font-medium">Số tiền nhận:</label>
              <input
                type="number"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Nhập số tiền nhận"
                min="0"
                step="1000"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Số tiền còn lại:</label>
              <p className="text-lg">{formatCurrency(remainingAmount)}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="mt-4 w-full bg-[#a17455] text-white py-2 px-4 rounded-md hover:bg-[#8c5e42] transition disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Đang xử lý..."
            : paymentMethod === "cash"
            ? "Xác nhận thanh toán"
            : "Chuyển đến trang thanh toán"}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;