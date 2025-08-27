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

    const resetPasswordUrl = "https://app.sugarnest.io.vn/reset-password";

    try {
      const result = await AuthService.sendResetPassword(email, resetPasswordUrl);
      if (result?.statusCode === 200 && result?.data === true) {
        alert("Đã gửi mail để đổi mật khẩu. Hãy kiểm tra email của bạn");
        // navigate(`/reset-password?email=${encodeURIComponent(email)}`);
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
    <div className="flex flex-col flex-1 bg-gradient-to-b from-[#fff5f5] to-white dark:from-gray-900 dark:to-gray-800 dark:text-[#f5deb3] min-h-screen relative">
      <div className="absolute inset-0 bg-[url('/images/bg-milk-tea.jpg')] bg-cover bg-center opacity-20 dark:opacity-10 pointer-events-none z-0" />
      <div className="relative flex flex-col justify-center flex-1 w-full max-w-md mx-auto p-6">
        <h1 className="mb-4 text-3xl font-bold text-pink-600 dark:text-pink-400 text-center">Yêu cầu đặt lại mật khẩu</h1>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          Nhập email để nhận liên kết đặt lại
        </p>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-pink-100 dark:border-pink-900">
          <form onSubmit={handleRequestReset} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center">{error}</div>
            )}
            {infoMessage && (
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl text-center">{infoMessage}</div>
            )}

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="banhngot@sugarnest.vn"
                className="w-full p-3 mt-2 border border-pink-200 rounded-xl bg-pink-50 dark:bg-gray-700 dark:border-pink-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white bg-gradient-to-r from-pink-500 to-orange-400 rounded-xl hover:from-pink-600 hover:to-orange-500 disabled:opacity-70 transition duration-200"
            >
              {loading ? "Đang xử lý..." : "Gửi liên kết"}
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