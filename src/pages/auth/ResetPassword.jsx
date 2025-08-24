import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { AuthService } from "../../services/AuthService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Nếu email không tồn tại (người dùng vào trực tiếp link) → redirect về request
  if (!email) {
    navigate("/reset-password/request");
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !otp.trim() || !newPassword.trim()) {
      setError("Vui lòng điền đầy đủ email, OTP và mật khẩu mới");
      return;
    }

    setLoading(true);

    try {
    const result = await AuthService.resetPasswordOtp({ email, otp, newPassword });
    console.log("resetPasswordOtp result:", result);

    if (result?.statusCode === 200 && result?.data === true) {
      setSuccess(true);
      setTimeout(() => navigate("/signin"), 3000);
    } else {
      setError(result.message || "Đặt lại mật khẩu thất bại");
    }
  } catch (err) {
    console.error("resetPasswordOtp error:", err);
    setError(err.response?.data?.message || "Có lỗi xảy ra");
  }

  };

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 dark:text-[#f5deb3] min-h-screen relative">
      <div className="absolute inset-0 bg-[url('/images/bg-milk-tea.jpg')] bg-cover bg-center opacity-10 dark:opacity-5 pointer-events-none z-0" />
      <div className="relative flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 text-2xl font-semibold">Đặt lại mật khẩu</h1>
        <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
          Vui lòng nhập email, mã OTP và mật khẩu mới
        </p>

        <form onSubmit={handleResetPassword} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>
          )}
          {success && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
              Đặt lại mật khẩu thành công! Chuyển hướng đến trang đăng nhập...
            </div>
          )}

          <div>
            <label className="block font-bold">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-bold">Mã OTP <span className="text-red-600">*</span></label>
            <input
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
              required
            />
          </div>

          <div>
            <label className="block font-bold">Mật khẩu mới <span className="text-red-600">*</span></label>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-sm text-gray-700">
            Quay lại{" "}
            <Link to="/signin" className="text-blue-700 hover:underline">
              đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
