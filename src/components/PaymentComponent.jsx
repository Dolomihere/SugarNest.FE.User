import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionService from "../services/TransactionService";
import { formatToVietnamTime } from "../helpers/dateTimeHelper";
import { getAccessToken } from "../core/services/AuthService";
import { isOrderCompleted } from "../helpers/orderValidChecker";

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
        // const token = localStorage.getItem("accessToken");
        // if (!token) {
        //   alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        //   navigate("/signin");
        //   return;
        // }
        // const parsedAmount = parseFloat(receivedAmount);
        // if (!receivedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
        //   alert("Vui lòng nhập số tiền nhận hợp lệ (lớn hơn 0).");
        //   return;
        // }
        // if (parsedAmount < totalAmount) {
        //   alert("Số tiền nhận phải lớn hơn hoặc bằng tổng thanh toán.");
        //   return;
        // }
        // console.log("📤 Gửi thanh toán tiền mặt:", orderId, {
        //   recievedAmount: parsedAmount,
        // });
        // const res = await TransactionService.createCashTransaction(orderId, {
        //   recievedAmount: parsedAmount, // ✅ khớp backend
        // });
        // console.log("✅ Phản hồi từ API (Cash):", res);
        // if (!res || !res.isSuccess) {
        //   throw new Error("Backend không trả về dữ liệu giao dịch hợp lệ!");
        // }
        // alert("Thanh toán tiền mặt thành công!");
        // navigate("/order-success");
      } else {
        console.log("📤 Tạo giao dịch VNPAY:", orderId);
        const token = localStorage.getItem("accessToken");
        const response = await TransactionService.createVnPayTransaction(
          orderId,
          token
        );
        console.log("✅ Phản hồi từ API (VNPAY):", response);

        const url = response?.data; // ✅ lấy đúng field
        if (!url) {
          // throw new Error("Không nhận được URL thanh toán từ VnPay.");
          alert("Không thể tạo giao dịch! Vui lòng thử lại sau ít phút.");
        } else {
          // window.location.href = url;
          window.open(url, "_blank", "noopener,noreferrer");
        }
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

  if (order.isPaid == true)
    return (
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md" disabled>
        <h3 className="text-xl font-semibold mb-4">Thanh toán</h3>
        <div className="font-[roboto]">
          Đơn hàng đã được thanh toán vào: {formatToVietnamTime(order.paidAt)}
        </div>
        <div className="mt-2  font-[roboto]">
          Hình thức:{" "}
          <span className="font-bold">
            {order.paymentChannel == 0 ? "Tiền mặt" : "Chuyển khoản VNPay"}
          </span>
        </div>

        {
          order.isRefundedAfterFulfillment == true && (
            <>
            <div className="mt-2">Đã hoàn {order.refundedAmount.toLocaleString()} vào {formatToVietnamTime(order.refundedAt)}</div>
            </>
          )
        }
      </div>
    );

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md" disabled>
      <h3 className="text-xl font-semibold mb-4">Thanh toán</h3>
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
            Nhân viên giao hàng sẽ nhận tiền sau khi giao hàng cho bạn
            {/* <div>
              <label className="block mb-2 font-medium">Tổng thanh toán:</label>
              <p className="text-lg">{formatCurrency(totalAmount)}</p>
            </div> */}
            {/* <div>
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
            </div> */}
            {/* <div>
              <label className="block mb-2 font-medium">Số tiền còn lại:</label>
              <p className="text-lg">{formatCurrency(remainingAmount)}</p>
            </div> */}
          </div>
        )}
        <div className="grid grid-cols-1   gap-4 mt-4">
          {/* Button Hủy đơn */}

          {/* Button Thanh toán */}
          {paymentMethod != "cash" && !isOrderCompleted(order) && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#a17455] text-white py-2 px-4 rounded-lg hover:bg-[#8c5e42] transition disabled:bg-gray-400"
            >
              {isSubmitting
                ? "Đang xử lý..."
                : paymentMethod === "cash"
                ? "Xác nhận thanh toán"
                : "Chuyển đến trang thanh toán"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
