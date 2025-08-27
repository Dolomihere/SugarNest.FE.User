import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { AuthService } from "../../services/AuthService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";
  const otpFromQuery = searchParams.get("otp") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState(otpFromQuery);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    <div className="flex flex-col flex-1 bg-gradient-to-b from-[#fff5f5] to-white dark:from-gray-900 dark:to-gray-800 dark:text-[#f5deb3] min-h-screen relative">
      <div className="absolute inset-0 bg-[url('/images/bg-milk-tea.jpg')] bg-cover bg-center opacity-20 dark:opacity-10 pointer-events-none z-0" />
      <div className="relative flex flex-col justify-center flex-1 w-full max-w-md mx-auto p-6">
        <h1 className="mb-4 text-3xl font-bold text-pink-600 dark:text-pink-400 text-center">Đặt lại mật khẩu</h1>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          Vui lòng nhập email, mã OTP và mật khẩu mới
        </p>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-pink-100 dark:border-pink-900">
          <form onSubmit={handleResetPassword} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center">{error}</div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-center">
                Đặt lại mật khẩu thành công! Chuyển hướng đến trang đăng nhập...
              </div>
            )}

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full p-3 mt-2 border border-pink-200 rounded-xl bg-pink-50 dark:bg-gray-700 dark:border-pink-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300">
                Mã OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 mt-2 border border-pink-200 rounded-xl bg-pink-50 dark:bg-gray-700 dark:border-pink-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 mt-2 border border-pink-200 rounded-xl bg-pink-50 dark:bg-gray-700 dark:border-pink-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white bg-gradient-to-r from-pink-500 to-orange-400 rounded-xl hover:from-pink-600 hover:to-orange-500 disabled:opacity-70 transition duration-200"
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Quay lại{" "}
              <Link to="/signin" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}