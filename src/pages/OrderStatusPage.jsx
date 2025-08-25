import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import OrderService from "../services/OrderService";
import { publicApi } from "../configs/AxiosConfig";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";

const endpoint = "/orders";

export function OrderStatusPage() {
  const navigate = useNavigate();
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const statusCodeToKey = {
    "-2": "returned",
    "-1": "canceled",
    0: "pending",
    1: "confirmed",
    2: "processing",
    3: "inTransit",
    4: "delivered",
  };

  const statusMap = {
    returned: "Đã trả hàng",
    canceled: "Đã hủy",
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    processing: "Đang xử lý",
    inTransit: "Đang vận chuyển",
    delivered: "Đã giao",
    paid: "Đã thanh toán",
  };

  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["orderStatusSummary", token],
    queryFn: async () => {
      if (!token) return null;
      const res = await OrderService.getOrderStatusHistory(token);
      return res.data;
    },
    enabled: !!token,
  });

  const { data: ordersData, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["orderList", token],
    queryFn: async () => {
      if (!token) return null;

      const loadAllOrders = async () => {
        let pageIndex = 1;
        let allOrders = [];
        let hasMore = true;

        while (hasMore) {
          const response = await publicApi.get(`${endpoint}/mine`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              pageIndex,
              pageSize: 20,
            },
          });
          const responseData = response.data;
          allOrders = [...allOrders, ...responseData.data];
          hasMore = responseData.meta.itemCount === responseData.meta.pageSize;
          pageIndex++;
        }

        return allOrders;
      };

      return await loadAllOrders();
    },
    enabled: !!token,
  });

  const { data: statusHistory, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["orderStatusChanges", selectedOrderId, token],
    queryFn: async () => {
      if (!selectedOrderId || !token) return null;
      const res = await OrderService.getOrderStatusChanges(selectedOrderId, token);
      return res;
    },
    enabled: !!selectedOrderId && !!token,
  });

  useEffect(() => {
    if (!token) navigate("/signin");
  }, [token, navigate]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
      setSelectedOrderId(null);
    }
  };

  if (isSummaryLoading || isOrdersLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-lg font-semibold text-gray-700">
        Đang tải...
      </div>
    );

  if (!summaryData || !ordersData)
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="flex-1 container mx-auto p-6 md:p-8">
          <div className="text-center text-lg font-medium text-gray-600">Không có dữ liệu</div>
        </main>
        <Footer />
      </div>
    );

  const selectedOrder = ordersData.find((o) => o.orderId === selectedOrderId);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <Header />

      <main className="flex-1 container mx-auto p-6 md:p-10 lg:p-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-8 text-gray-900 tracking-tight">
          Tổng quan trạng thái đơn hàng
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Object.entries(summaryData).map(([key, value]) => (
            <div
              key={key}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
            >
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{statusMap[key] || key}</p>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 tracking-tight">Danh sách đơn hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ordersData.map((order) => {
            const statusKey = statusCodeToKey[order.status] || "unknown";
            let statusName = statusMap[statusKey] || "Không xác định";

            if (order.isPaid) {
              statusName += " + Đã thanh toán";
            } else {
              statusName += " + Chưa thanh toán";
            }

            if (order.isRefundedAfterFulfillment || order.isRefunded) {
              statusName += " + Đã hoàn tiền";
            }

            const statusChange = `Tạo đơn > ${statusName}`;

            return (
              <div
                key={order.orderId}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mr-4 flex items-center justify-center shadow-sm">
                    <img
                      src="/images/1.jpeg"
                      alt="User avatar"
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-gray-900">{order.customerName}</p>
                    <p className="text-sm text-gray-500">{order.email}</p>
                    <p className="text-sm text-gray-500">{order.phoneNumber}</p>
                  </div>
                </div>

                <p
                  className="text-blue-600 font-medium text-base mb-3 cursor-pointer hover:underline hover:text-blue-700 transition-colors"
                  onClick={() => {
                    setSelectedOrderId(order.orderId);
                    setShowModal(true);
                  }}
                >
                  {statusChange}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  Đơn hàng ID: <span className="font-medium">{order.orderId}</span>
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  Tổng tiền: <span className="font-medium">{order.total.toLocaleString()} VND</span>
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  Ngày tạo: <span className="font-medium">{new Date(order.createdAt).toLocaleString()}</span>
                </p>

                <span
                  className={`block text-center py-2 px-4 rounded-full font-semibold text-sm ${
                    order.isRefundedAfterFulfillment || order.isRefunded
                      ? "bg-blue-100 text-blue-800"
                      : order.isPaid
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.isRefundedAfterFulfillment || order.isRefunded
                    ? "ĐÃ HOÀN TIỀN"
                    : order.isPaid
                    ? "ĐÃ THANH TOÁN"
                    : "CHƯA THANH TOÁN"}
                </span>
              </div>
            );
          })}
        </div>
      </main>

      {showModal && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Lịch sử trạng thái</h2>
            {isHistoryLoading ? (
              <p className="text-center text-gray-600">Đang tải...</p>
            ) : (
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                {(() => {
                  let enhancedHistory = [];
                  const creationDate = new Date(selectedOrder.createdAt);
                  const creationTimestamp = creationDate.toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const creationChange = {
                    timestamp: creationTimestamp,
                    from: "Tạo đơn",
                    to: "Chờ xác nhận",
                    user: {
                      name: selectedOrder.customerName,
                      email: selectedOrder.email,
                      avatar: "/images/1.jpeg",
                    },
                  };
                  enhancedHistory.push(creationChange);

                  const systemUser = {
                    name: "Hệ thống",
                    email: "system@example.com",
                    avatar: "/images/1.jpeg",
                  };

                  if (!statusHistory || statusHistory.length === 0) {
                    const statusKey = statusCodeToKey[selectedOrder.status] || "unknown";
                    const currentStatus = statusMap[statusKey] || "Không xác định";
                    if (currentStatus !== "Chờ xác nhận") {
                      const changeDate = new Date(creationDate.getTime() + 60 * 1000);
                      const changeTimestamp = changeDate.toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      const currentChange = {
                        timestamp: changeTimestamp,
                        from: "Chờ xác nhận",
                        to: currentStatus,
                        user: systemUser,
                      };
                      enhancedHistory.push(currentChange);
                    }
                  } else {
                    enhancedHistory = enhancedHistory.concat(statusHistory);
                  }

                  enhancedHistory = enhancedHistory.reverse();

                  if (selectedOrder.isRefundedAfterFulfillment || selectedOrder.isRefunded) {
                    const lastChange = enhancedHistory[0] || { to: "Chờ xác nhận", user: systemUser };
                    const refundDate = new Date();
                    const refundTimestamp = refundDate.toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    const refundChange = {
                      timestamp: refundTimestamp,
                      from: lastChange.to,
                      to: "Đã hoàn tiền",
                      user: systemUser,
                    };
                    enhancedHistory.unshift(refundChange);
                  }

                  return enhancedHistory.map((change, index) => (
                    <div key={index} className="relative mb-8 pl-12">
                      <div className="absolute left-4 mt-1.5 w-8 flex justify-center">
                        <div className="h-3 w-3 bg-blue-600 rounded-full ring-2 ring-white"></div>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{change.timestamp}</p>
                      <span
                        className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-2 ${
                          change.to === "Đã hoàn tiền"
                            ? "bg-blue-100 text-blue-800"
                            : change.to === "Đã giao"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {change.from} &gt; {change.to}
                      </span>
                      <div className="flex items-center">
                        <img
                          src={change.user.avatar || "/images/1.jpeg"}
                          alt="User avatar"
                          className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-sm text-gray-900">{change.user.name}</p>
                          <p className="text-xs text-gray-500">{change.user.email}</p>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedOrderId(null);
              }}
              className="mt-6 w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}