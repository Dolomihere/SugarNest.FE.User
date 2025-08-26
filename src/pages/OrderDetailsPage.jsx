import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderService from "../services/OrderService";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import PaymentForm from "../components/PaymentComponent";
import ToastMessage from "../components/ToastMessage";
import { isOrderCompleted } from "../helpers/orderValidChecker";
import ViewOrderStatusHistoryModal from "../components/modals/ViewOrderStatusHistoryModal";

// ==========================
// Modal hủy đơn
// ==========================
const CancelOrderModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState("Người dùng hủy đơn");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Nhập lý do hủy đơn
        </h3>
        <textarea
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
            onClick={() => onConfirm(reason)}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================
// Dữ liệu chính
// ==========================
const paymentChannels = {
  0: "Chưa thanh toán",
  1: "Thanh toán khi nhận hàng",
  2: "Thanh toán online",
};

const getStatusInVietnamese = (status) => {
  const statusMap = {
    "-2": { label: "Đã trả hàng", color: "text-red-600" },
    "-1": { label: "Đã hủy", color: "text-red-600" },
    0: { label: "Chờ xác nhận", color: "text-yellow-600" },
    1: { label: "Đã xác nhận", color: "text-blue-600" },
    2: { label: "Đang xử lý", color: "text-yellow-600" },
    3: { label: "Đang vận chuyển", color: "text-blue-600" },
    4: { label: "Đã giao hàng", color: "text-green-600" },
  };
  return (
    statusMap[status?.toString()] || {
      label: "Không xác định",
      color: "text-gray-600",
    }
  );
};

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const accessToken = localStorage.getItem("accessToken");

  const [modals, setModals] = useState({
    historyModal: false,
  });
  const openModal = (key) => setModals((prev) => ({ ...prev, [key]: true }));
  const closeModal = (key) => setModals((prev) => ({ ...prev, [key]: false }));

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value || 0) + " VND";

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Hàm hủy đơn từ modal
  const handleCancelOrder = async (reason) => {
    if (!orderId) return;
    try {
      setCancelling(true);
      await OrderService.cancelOrder(orderId, reason, accessToken);

      setToast({ message: "Đã hủy đơn hàng thành công!", type: "success" });

      // Lấy lại dữ liệu đơn hàng
      const res = await OrderService.getOrderById(orderId, accessToken);
      setOrderData(res || {});
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Hủy đơn thất bại",
        type: "error",
      });
    } finally {
      setCancelling(false);
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await OrderService.getOrderById(orderId, accessToken);
        setOrderData(res || {});
        setSubTotal(res?.subTotal || res?.subtotal || res?.totalAmount || 0);
        setShippingFee(
          res?.shippingFee ||
            res?.shippingCost ||
            res?.shipping ||
            res?.shipFee ||
            0
        );
        setVoucherDiscount(
          res?.voucherDiscountAmount ||
            res?.voucherDiscount ||
            res?.discountAmount ||
            res?.discount ||
            res?.voucherAmount ||
            res?.discountVoucher ||
            0
        );
        setTotal(res?.total || 0);
        setPointDiscount(res?.pointDiscountAmount || 0);
      } catch (err) {
        setError(err.message || "Không thể tải thông tin đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, accessToken]);

  // Tính toán tổng tiền
  const [subTotal, setSubTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [pointDiscount, setPointDiscount] = useState(0);

  if (loading) return <p className="text-center py-10">Đang tải đơn hàng...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-[#fffaf3] text-gray-800">
      <Header />
      <main className="container max-w-5xl px-4 py-10 mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#a17455] mb-8">
          Chi tiết đơn hàng
        </h2>

        {/* Thông tin người nhận + nút hủy */}
        <section className="bg-white rounded-2xl shadow-md overflow-hidden mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-[#a17455]">
              Thông tin người nhận
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => openModal("historyModal")}
                disabled={cancelling}
                className="py-1 px-3 rounded-md border bg-blue-500 text-white font-medium hover:bg-blue-600 transition disabled:bg-gray-400 text-sm"
              >
                Xem lịch sử
              </button>
              {!isOrderCompleted(orderData) && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={cancelling}
                  className="py-1 px-3 rounded-md border border-red-500 bg-red-500 text-white font-medium hover:bg-red-600 transition disabled:bg-gray-400 text-sm"
                >
                  {cancelling ? "Đang hủy..." : "Hủy đơn"}
                </button>
              )}
            </div>
          </div>

          <table className="w-full text-sm">
            <tbody className="divide-y divide-[#f5e9dc]">
              <tr>
                <td className="py-2 font-medium !w-[20%]">Mã đơn hàng</td>
                <td>{orderData?.orderId || "-"}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Tên</td>
                <td>{orderData?.recipientName || "-"}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">SĐT</td>
                <td>{orderData?.recipientPhone || "-"}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Email</td>
                <td>{orderData?.recipientEmail || "-"}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Thông tin đơn hàng */}
        <section className="bg-white rounded-2xl shadow-md overflow-hidden mb-6 p-6">
          <h3 className="text-xl font-semibold text-[#a17455] mb-4">
            Thông tin đơn hàng
          </h3>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-[#f5e9dc]">
              <tr className="">
                <td className="py-2 font-medium !w-[20%]">Ngày tạo</td>
                <td>
                  {orderData?.createdAt ? formatDate(orderData.createdAt) : "-"}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Thời gian giao hàng</td>
                <td>
                  {orderData?.deliveryTime
                    ? formatDate(orderData.deliveryTime)
                    : "Mua ngay"}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Điểm điểm giao hàng</td>
                <td>
                  {orderData?.address ? orderData.address : "Nhận tại của hàng"}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Trạng thái</td>
                <td className={getStatusInVietnamese(orderData?.status).color}>
                  {getStatusInVietnamese(orderData?.status).label}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Ghi chú</td>
                <td>{orderData?.note || "Không có"}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Trạng thái thanh toán</td>
                <td>
                  {orderData?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  {orderData.isRefundedAfterFulfillment == true && (
                    <span className="ms-2 text-yellow-600 font-bold">
                      (Đã hoàn tiền -{" "}
                      {orderData.refundedAmount.toLocaleString()})
                    </span>
                  )}
                </td>
              </tr>
              {orderData?.isPaid == true ? (
                <tr>
                  <td className="py-2 font-medium">Phương thức thanh toán</td>
                  <td>
                    {orderData.paymentChannel == 0
                      ? "Tiền mặt"
                      : "Chuyển khoản VNPay"}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="py-2 font-medium">Phương thức thanh toán</td>
                  <td>Tiền mặt</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Danh sách sản phẩm */}
        <section className="bg-white rounded-2xl shadow-md overflow-hidden mb-6 p-6">
          <h3 className="text-xl font-semibold text-[#a17455] mb-4">
            Danh sách sản phẩm
          </h3>
          <table className="w-full text-sm border border-[#f5e9dc] rounded-lg">
            <thead className="bg-[#f5e9dc] text-[#a17455]">
              <tr>
                <th className="p-3 text-left">Sản phẩm</th>
                <th className="p-3 text-center">Đơn giá</th>
                <th className="p-3 text-center">Số lượng</th>
                <th className="p-3 text-right">Giá</th>
              </tr>
            </thead>
            <tbody className=" border border-[#f5e9dc] ">
              {orderData?.orderItems?.length > 0 ? (
                orderData.orderItems.map((item, idx) => (
                  <tr key={idx} className="border-t border-[#f5e9dc]">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={item?.imgs?.[0] || "/images/placeholder.png"}
                        className="w-14 h-14 rounded-md object-cover border"
                        alt={item?.productName}
                      />
                      <div>
                        <p className="font-medium">{item?.productName}</p>
                        {item?.orderItemOptions?.length > 0 && (
                          <div className="text-[12px] text-gray-600 dark:text-gray-300">
                                  {item.orderItemOptions.map((itemoption) => (
                                    <li>{itemoption.optionValue}</li>
                                  ))}
                                </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      {(
                        item?.finalUnitPrice + item?.itemAdditionalPrice
                      ).toLocaleString() || 0}
                    </td>
                    <td className="p-3 text-center">{item?.quantity || 0}</td>
                    <td className="p-3 text-right text-[#a17455] font-semibold">
                      {((item?.finalUnitPrice + item?.itemAdditionalPrice )* item?.quantity || 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-gray-400 py-4">
                    Chưa có sản phẩm
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Tổng kết đơn hàng */}
        <section className="bg-white rounded-2xl shadow-md overflow-hidden mb-6 p-6">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-[#f5e9dc]">
              <tr>
                <td className="py-2 font-medium">Tạm tính</td>
                <td className="text-right">{subTotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Phí vận chuyển</td>
                <td className="text-right">{shippingFee.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Giảm giá đơn</td>
                <td className="text-right">
                  {voucherDiscount.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Giảm giá (điểm)</td>
                <td className="text-right">
                  {pointDiscount ? pointDiscount.toLocaleString() : 0}
                </td>
              </tr>

              <tr>
                <td className="py-3 font-bold text-lg text-[#a17455]">
                  Tổng thanh toán
                </td>
                <td className="py-3 text-right font-bold text-lg text-[#a17455]">
                  {total.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <PaymentForm
          order={orderData}
          formatCurrency={formatCurrency}
          totalAmount={total}
        />
      </main>
      <Footer />

      {/* Modal hủy đơn */}
      <CancelOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCancelOrder}
      />

      {/* Toast thông báo */}
      {toast.message && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />
      )}

      <ViewOrderStatusHistoryModal
        history={orderData.orderStatusHistories}
        isOpen={modals.historyModal}
        onClose={() => closeModal("historyModal")}
      ></ViewOrderStatusHistoryModal>
    </div>
  );
};

export default OrderDetailsPage;
