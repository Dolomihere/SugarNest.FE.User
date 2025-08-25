import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LeafletMap from "./LeafletMap";
import UserService from "../../services/UserService";

const DeliveryForm = ({
  form,
  setForm,
  addressFromMap,
  onAddressSelect,
  handleSubmit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  // const [isBuyNow, setIsBuyNow] = useState("now");

  const token =
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // chuyển timezone về local ISO
    return now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  };

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ["personalUser"],
    queryFn: () => UserService.getPersonalUser(token),
    enabled: !!token,
    onError: (err) => {
      console.error("Lỗi khi lấy dữ liệu người dùng:", err);
    },
  });
  // Cập nhật form với dữ liệu người dùng
  useEffect(() => {
    if (userData && userData.data) {
      setForm((prev) => ({
        ...prev,
        name: userData.data.fullname || prev.name,
        phoneNumber: userData.data.phoneNumber || prev.phoneNumber,
        email: userData.data.email || prev.email,
      }));
      // if (userData.data.address) {
      //   setAddressFromMap(userData.data.address);
      // }
    }
  }, [userData, setForm]);

  // Lưu phoneNumber khi đang edit
  useEffect(() => {
    if (isEditing && form.phoneNumber && token) {
      localStorage.setItem("phoneNumber", form.phoneNumber);
    }
  }, [form.phoneNumber, isEditing, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!form.phoneNumber) {
      newErrors.phoneNumber = "Số điện thoại là bắt buộc";
    }
    if (!form.deliveryTime) {
      newErrors.deliveryTime = "Thời gian giao hàng là bắt buộc";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    handleSubmit(e);
  };

  if (isLoading) return <div>Loading user data...</div>;
  if (error)
    return (
      <div>Error loading user data: {error.message}. Please try again.</div>
    )

  // Xử lý lỗi khi fetch dữ liệu
  if (error) {
    return <div>Error loading user data: {error.message}. Please try again.</div>;
  }

  // Yêu cầu đăng nhập nếu không có token
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

      <form className="space-y-5 text-main" onSubmit={onSubmit}>
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
          <label className="block mb-1 text-sm font-medium text-sub">
            Điện thoại <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
            className={`w-full p-3 border rounded-lg ${
              !isEditing
                ? "bg-gray-100 cursor-not-allowed"
                : errors.phoneNumber
                ? "border-red-600"
                : "border-gray-300"
            }`}
            placeholder="Nhập số điện thoại"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
          )}
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

          <select
    name="isBuyInShop"
    value={form.isBuyInShop}
    onChange={handleInputChange}
    disabled={!isEditing}
    className={`w-full p-3 border rounded-lg ${
      !isEditing
        ? "bg-gray-100 cursor-not-allowed"
        : errors.orderType
        ? "border-red-600"
        : "border-gray-300"
    }`}
  >
    <option value="0">Giao Hàng đến địa chỉ</option>
    <option value="1">Nhận tại cửa hàng</option>
  </select>

{form.isBuyInShop == "0" && (
<div>
          <label className="block mb-1 text-sm font-medium text-sub">Chọn vị trí trên bản đồ</label>
          <LeafletMap onAddressSelect={onAddressSelect} />
        </div>
)}
        
{
  form.IsBuyInShop == "0" && (
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
  )
}
        

        <div>
  <label className="block mb-1 text-sm font-medium text-sub">
    Hình thức đặt hàng <span className="text-red-600">*</span>
  </label>
  <select
    name="isBuyNow"
    value={form.isBuyNow}
    onChange={handleInputChange}
    disabled={!isEditing}
    className={`w-full p-3 border rounded-lg ${
      !isEditing
        ? "bg-gray-100 cursor-not-allowed"
        : errors.orderType
        ? "border-red-600"
        : "border-gray-300"
    }`}
  >
    <option value="0">Mua ngay</option>
    <option value="1">Đặt trước</option>
  </select>
  {/* {errors.is && (
    <p className="mt-1 text-sm text-red-600">{errors.orderType}</p>
  )} */}
</div>
      {
        form.isBuyNow == "1" && (
<div>
            
          <label className="block mb-1 text-sm font-medium text-sub">
            Thời gian giao hàng <span className="text-red-600">*</span>
          </label>
          <input
            type="datetime-local"
            name="deliveryTime"
            value={form.deliveryTime || ""}
            onChange={handleInputChange}
            min={getCurrentDateTime()}
            required
            disabled={!isEditing}
            className={`w-full p-3 border rounded-lg ${
              !isEditing
                ? "bg-gray-100 cursor-not-allowed"
                : errors.deliveryTime
                ? "border-red-600"
                : "border-gray-300"
            }`}
            placeholder="Chọn thời gian giao hàng"
          />
          {errors.deliveryTime && (
            <p className="mt-1 text-sm text-red-600">{errors.deliveryTime}</p>
          )}
        </div>
        )
      }
       

        {/* Ghi chú */}
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
      </form>
    </div>
  );
};
export default DeliveryForm;