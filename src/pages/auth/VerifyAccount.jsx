import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthService } from "../../services/AuthService";

export default function VerifyAccount() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromParams = searchParams.get("email");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log("📧 Email from searchParams:", emailFromParams);
    if (!emailFromParams) {
      setError("Email không được cung cấp. Vui lòng quay lại trang đăng nhập.");
    }
  }, [emailFromParams]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code || !emailFromParams) {
      setError("Vui lòng nhập mã xác minh và đảm bảo email hợp lệ");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("🚀 Verify attempt:", {
        email: emailFromParams,
        otp: `"${code}"`,
      });

      const result = await AuthService.verify({ email: emailFromParams, code });

      console.log("✅ Verify response:", result);

      if (result.isSuccess || result.success) {
        setSuccess(true);
        setTimeout(() => {
          console.log("🎉 Xấc thực thành công. Chuyển hướng đến trang đăng nhập...");
          navigate("/signin");
        }, 2000);
      } else {
        setError(result.message || "Xác minh thất bại");
      }
    } catch (err) {
      console.error("❌ Verify error:", err);
      console.log("Error response data:", err.response?.data);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.title ||
        "Có lỗi xảy ra khi xác minh";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!emailFromParams) {
      setError("Email không hợp lệ để gửi lại mã");
      return;
    }

    setLoading(true);
    setError("");
    try {
      console.log("🔄 Resend verification for email:", emailFromParams);
      const result = await AuthService.sendVerification(emailFromParams);
      console.log("📩 Resend response:", result);
      setError("Mã xác minh đã được gửi lại. Vui lòng kiểm tra email.");
    } catch (err) {
      console.error("❌ Resend error:", err);
      console.log("Error response data:", err.response?.data);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.title ||
        "Gửi lại mã thất bại";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-b from-[#fff5f5] to-white dark:from-gray-900 dark:to-gray-800 dark:text-[#f5deb3] min-h-screen relative">
      <div className="absolute inset-0 bg-[url('/images/bg-milk-tea.jpg')] bg-cover bg-center opacity-20 dark:opacity-10 pointer-events-none z-0" />
      <div className="relative flex flex-col justify-center flex-1 w-full max-w-md mx-auto p-6">
        <h1 className="mb-4 text-3xl font-bold text-pink-600 dark:text-pink-400 text-center">Xác minh tài khoản</h1>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          Nhập mã xác minh được gửi đến email {emailFromParams || "không xác định"}
        </p>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-pink-100 dark:border-pink-900">
          <form onSubmit={handleVerify} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center">{error}</div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-center">
                Xác minh thành công! Chuyển hướng đến trang chủ...
              </div>
            )}

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300">
                Mã xác minh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập mã 6 chữ số"
                className="w-full p-3 mt-2 border border-pink-200 rounded-xl bg-pink-50 dark:bg-gray-700 dark:border-pink-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={code}
                onChange={(e) => setCode(e.target.value.trim())}
                disabled={loading || success || !emailFromParams}
              />
            </div>

            <button
              type="submit"
              disabled={loading || success || !emailFromParams}
              className="w-full py-3 font-semibold text-white bg-gradient-to-r from-pink-500 to-orange-400 rounded-xl hover:from-pink-600 hover:to-orange-500 disabled:opacity-70 transition duration-200"
            >
              {loading ? "Đang xác minh..." : "Xác minh"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={loading || success || !emailFromParams}
              className="w-full py-3 text-sm text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/20 disabled:opacity-50"
            >
              {loading ? "Đang gửi..." : "Gửi lại mã"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Quay lại <Link to="/signin" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}