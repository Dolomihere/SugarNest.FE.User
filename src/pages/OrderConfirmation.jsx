import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import OrderService from "../services/OrderService";
import TransactionService from "../services/TransactionService";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import OrderDetailContent from "./OrderDetailContent";
import PaymentForm from "../components/PaymentComponent";

/**
 * Component thanh toán
 */


const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId } = useParams();
  const navigate = useNavigate();

  const stateData = location.state;
  const localData = localStorage.getItem("lastOrderData");
  const initialData = stateData || (localData ? JSON.parse(localData) : null);

  const [orderData, setOrderData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value || 0) + " VND";

  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateTotal = (order) => {
    if (!order) return 0;
    const subTotal = order.subTotal || order.subtotal || order.totalAmount || 0;
    const shippingFee =
      order.shippingFee ||
      order.shippingCost ||
      order.shipping ||
      order.shipFee ||
      0;
    const voucherDiscount =
      order.voucherDiscountAmount ||
      order.voucherDiscount ||
      order.discountAmount ||
      order.discount ||
      order.voucherAmount ||
      order.discountVoucher ||
      0;
    return subTotal + shippingFee - voucherDiscount;
  };

  useEffect(() => {
    if (!initialData && orderId) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const res = await OrderService.getOrderById(orderId);
          const data = res.data;
          const normalizedData = { ...data, id: data.id || data.orderId };

          console.log("✅ OrderData từ API:", normalizedData);

          setOrderData(normalizedData);
          localStorage.setItem("lastOrderData", JSON.stringify(normalizedData));
        } catch (error) {
          console.error("❌ Lỗi khi tải đơn hàng:", error);
          setError(
            `Không thể tải thông tin đơn hàng: ${
              error.response?.data?.message || error.message
            }`
          );
          navigate("/error");
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [initialData, orderId, navigate]);

  return (
    <div className="min-h-screen bg-[#fffaf3] text-gray-800">
      <Header />

      <main className="container max-w-5xl px-4 py-10 mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#a17455] mb-8">
          Xác nhận đơn hàng
        </h2>

        {loading && (
          <div className="text-lg text-center text-gray-500">Đang tải...</div>
        )}

        {error && <div className="text-lg text-center text-red-500">{error}</div>}

        {orderData && (
          <>
            <OrderDetailContent
              order={orderData}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
            <PaymentForm
              order={orderData}
              formatCurrency={formatCurrency}
              totalAmount={calculateTotal(orderData)}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
