import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../services/AuthService";

export default function RequestResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const navigate = useNavigate();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfoMessage("");

    if (!email.trim()) {
      setError("Vui lòng nhập email.");
      setLoading(false);
      return;
    }

    const resetPasswordUrl = "https://sugarnest-api.io.vn/auth/reset-password";

    try {
      const result = await AuthService.sendResetPassword(email, resetPasswordUrl);
     if (result?.statusCode === 200 && result?.data === true) {
    navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } else {
    setError(result?.message || "Gửi liên kết thất bại");
    }

    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 dark:text-[#f5deb3] min-h-screen relative">
      <div className="absolute inset-0 bg-[url('/images/bg-milk-tea.jpg')] bg-cover bg-center opacity-10 dark:opacity-5 pointer-events-none z-0" />

      <div className="relative flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 text-2xl font-semibold">Yêu cầu đặt lại mật khẩu</h1>
        <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
          Nhập email để nhận liên kết đặt lại
        </p>

        <form onSubmit={handleRequestReset} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>
          )}
          {infoMessage && (
            <div className="p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-md">{infoMessage}</div>
          )}

          <div>
            <label className="block font-bold">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              placeholder="banhngot@sugarnest.vn"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : "Gửi liên kết"}
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
