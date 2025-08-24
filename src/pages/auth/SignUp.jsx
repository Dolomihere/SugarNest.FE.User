import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../services/AuthService";
import GoogleSignUpButton from "../../components/buttons/GoogleLoginButton";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // New state for success message

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "Customer",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess(""); // Clear success message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setLoading(false);
      return;
    }

    if (!isChecked) {
      setError("Bạn phải đồng ý với điều khoản");
      setLoading(false);
      return;
    }

    try {
      const fullname = `${formData.firstName} ${formData.lastName}`.trim();
      const result = await AuthService.register({
        fullname,
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: formData.role,
      });

      if (result.success) {
        await AuthService.sendVerification(formData.email);
        setSuccess("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");
        setTimeout(() => {
          navigate("/signin"); // Redirect after 2 seconds
        }, 2000);
      } else {
        setError(result.message || "Đăng ký thất bại");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async (credential) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await AuthService.registerGoogle(credential);

      if (result.success) {
        await AuthService.sendVerification(result.email || formData.email);
        setSuccess("Đăng ký Google thành công! Đang chuyển hướng đến trang đăng nhập...");
        setTimeout(() => {
          navigate("/signin"); // Redirect after 2 seconds
        }, 2000);
      } else {
        setError(result.message || "Đăng ký Google thất bại");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi đăng ký Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 dark:text-[#f5deb3] min-h-screen relative">
      <div className="absolute inset-0 bg-[url('/images/bg-milk-tea.jpg')] bg-cover bg-center opacity-10 dark:opacity-5 pointer-events-none z-0" />

      <div className="relative w-full max-w-md pt-10 mx-auto mb-8">
        <Link to="/signin" className="inline-flex items-center text-sm text-gray-700 dark:text-gray-400">
          ← Quay về trang đăng nhập
        </Link>
      </div>

      <div className="relative flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 text-2xl font-semibold">Đăng ký</h1>
        <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">Nhập thông tin để tạo tài khoản mới</p>

        <div className="grid grid-cols-1 gap-3 mb-5 sm:grid-cols-2 sm:gap-5">
          <GoogleSignUpButton onSuccess={handleGoogleSignUp} loading={loading} />
          <button
            disabled={loading}
            className="inline-flex items-center justify-center gap-3 py-3 text-sm text-gray-700 bg-gray-100 rounded-lg px-7 hover:bg-gray-200 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đăng ký X"}
          </button>
        </div>

        <div className="relative py-5 text-gray-500">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-400" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-5 bg-white dark:bg-gray-900 dark:text-gray-400">hoặc</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block font-bold">
                Họ <span className="text-red-600">*</span>
              </label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
                placeholder="Nguyễn"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block font-bold">
                Tên <span className="text-red-600">*</span>
              </label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
                placeholder="Bánh Ngọt"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block font-bold">
              Tên tài khoản <span className="text-red-600">*</span>
            </label>
            <input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
              placeholder="banhngot123"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-bold">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="banhngot@sugarnest.vn"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-bold">
              Số điện thoại <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              placeholder="0123456789"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-bold">
              Mật khẩu <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
                disabled={loading}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                <i className={`fa-regular fa-eye${showPassword ? "-slash" : ""}`}></i>
              </span>
            </div>
          </div>

          <div>
            <label className="block font-bold">
              Xác nhận mật khẩu <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showRePassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
                disabled={loading}
              />
              <span
                onClick={() => setShowRePassword(!showRePassword)}
                className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                <i className={`fa-regular fa-eye${showRePassword ? "-slash" : ""}`}></i>
              </span>
            </div>
          </div>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              disabled={loading}
            />
            <span className="text-sm">
              Bằng việc đăng ký, bạn đồng ý với{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">Điều khoản</span> và{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">Chính sách bảo mật</span> của chúng tôi.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <div className="mt-5 mb-12 text-center sm:text-start">
          <p className="text-sm text-gray-700">
            Đã có tài khoản? <Link to="/signin" className="text-blue-700 hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}