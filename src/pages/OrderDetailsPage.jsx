// OrderDetailsPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import OrderService from "../services/OrderService";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import OrderDetailContent from "./OrderDetailContent";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const token = localStorage.getItem("accessToken");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orderDetail", orderId],
    queryFn: () => OrderService.getOrderById(orderId, token),
    enabled: !!orderId && !!token,
  });

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

  return (
    <div className="min-h-screen bg-[#fffaf3] text-gray-800">
      <Header />

      <main className="container max-w-5xl px-4 py-10 mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#a17455] mb-8">
          Chi tiết đơn hàng
        </h2>

        {isLoading && (
          <div className="animate-pulse text-center text-lg font-medium bg-white p-4 rounded-xl shadow">
            Đang tải dữ liệu...
          </div>
        )}

        {isError && (
          <div className="p-4 text-center text-red-500 bg-red-50 border border-red-200 rounded-xl">
            Lỗi: {error?.message || "Không thể tải dữ liệu."}
          </div>
        )}

        {data && (
          <OrderDetailContent
            order={data}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
