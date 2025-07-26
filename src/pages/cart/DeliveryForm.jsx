import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LeafletMap from "./LeafletMap";
import UserService from "../../services/UserService";

const DeliveryForm = ({
  form,
  setForm,
  addressFromMap,
  setAddressFromMap,
  paymentMethod,
  setPaymentMethod,
  handleSubmit,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Lấy token từ localStorage hoặc sessionStorage giống như Header.jsx
  const token =
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

  // Hàm lấy thời gian hiện tại dưới dạng datetime-local
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // fix timezone offset
    return now.toISOString().slice(0, 16); // định dạng yyyy-MM-ddTHH:mm
  };

  // Fetch dữ liệu người dùng cá nhân
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["personalUser"],
    queryFn: () => UserService.getPersonalUser(token),
    enabled: !!token,
    onError: (err) => {
      console.error("Error fetching user data:", err);
    },
  });

  // Cập nhật form khi có dữ liệu
  useEffect(() => {
    if (userData && userData.data) {
      setForm((prev) => ({
        ...prev,
        name: userData.data.fullname || prev.name,
        phoneNumber: userData.data.phoneNumber || prev.phoneNumber,
        email: userData.data.email || prev.email,
      }));
      if (userData.data.address) {
        setAddressFromMap(userData.data.address);
      }
    }
  }, [userData, setForm, setAddressFromMap]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Error loading user data: {error.message}. Please try again.</div>;
  }

  if (!token) {
    return <div>Vui lòng đăng nhập để tiếp tục.</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-white shadow-md rounded-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-heading">Thông tin giao hàng</h2>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600"
          >
            Sửa thông tin giao hàng
          </button>
        )}
      </div>

      <form className="space-y-5 text-main" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 text-sm font-medium text-sub">Tên của bạn</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full p-3 border rounded-lg ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
            }`}
            placeholder="Nhập tên của bạn"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-sub">Điện thoại</label>
          <input
            type="tel"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full p-3 border rounded-lg ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
            }`}
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-sub">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full p-3 border rounded-lg ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
            }`}
            placeholder="Nhập email của bạn"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-sub">Chọn vị trí trên bản đồ</label>
          <LeafletMap onAddressSelect={setAddressFromMap} />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-sub">Địa chỉ chi tiết</label>
          <textarea
            value={addressFromMap}
            readOnly
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
            rows="3"
            placeholder="Địa chỉ tự động từ bản đồ"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-sub">Thời gian giao hàng</label>
          <input
            type="datetime-local"
            name="deliveryTime"
            value={form.deliveryTime}
            onChange={handleInputChange}
            min={getCurrentDateTime()}
            disabled={!isEditing}
            className={`w-full p-3 border rounded-lg ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
            }`}
            placeholder="Chọn thời gian giao hàng"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-sub">Ghi chú</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full p-3 border rounded-lg ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
            }`}
            rows="2"
            placeholder="Thêm ghi chú (tùy chọn)"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-sub">Phương thức thanh toán</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={handlePaymentMethodChange}
                disabled={!isEditing}
                className="mr-2"
              />
              Tiền mặt
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="bank_transfer"
                checked={paymentMethod === "bank_transfer"}
                onChange={handlePaymentMethodChange}
                disabled={!isEditing}
                className="mr-2"
              />
              Chuyển khoản
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isEditing}
          className={`w-full py-3 font-semibold text-white rounded-lg ${
            isEditing
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Gửi thông tin
        </button>
      </form>
    </div>
  );
};

export default DeliveryForm;
