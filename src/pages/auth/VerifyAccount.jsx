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

  // Kiểm tra email khi mount
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
        otp: `"${code}"`, // log nguyên bản để tránh mất số 0
      });

      const result = await AuthService.verify({ email: emailFromParams, code });

      console.log("✅ Verify response:", result);

      if (result.isSuccess || result.success) {
        setSuccess(true);
        setTimeout(() => {
          console.log("🎉 Verification successful, redirecting to /");
          navigate("/"); // ✅ Chuyển hướng về trang chủ
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
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 dark:text-[#f5deb3] min-h-screen relative">
      <div className="absolute inset-0 bg-[url('/images/bg-milk-tea.jpg')] bg-cover bg-center opacity-10 dark:opacity-5 pointer-events-none z-0" />
      
      <div className="relative flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 text-2xl font-semibold">Xác minh tài khoản</h1>
        <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
          Nhập mã xác minh được gửi đến email {emailFromParams || "không xác định"}
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
              Xác minh thành công! Chuyển hướng đến trang chủ...
            </div>
          )}

          <div>
            <label className="block font-bold">
              Mã xác minh <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập mã 6 chữ số"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={code}
              onChange={(e) => setCode(e.target.value.trim())}
              disabled={loading || success || !emailFromParams}
            />
          </div>

          <button
            type="submit"
            disabled={loading || success || !emailFromParams}
            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xác minh..." : "Xác minh"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={loading || success || !emailFromParams}
            className="w-full py-3 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10 disabled:opacity-50"
          >
            {loading ? "Đang gửi..." : "Gửi lại mã"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Quay lại <Link to="/signin" className="text-blue-700 hover:underline dark:text-blue-400">đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
