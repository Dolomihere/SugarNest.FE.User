import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../../core/services/AuthService";
import GoogleLoginButton from "/src/components/buttons/GoogleLoginButton";

export default function SignInForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const result = await login({ userNameOrEmail: username, password });
    if (result) {
      navigate(returnUrl ?? "/");
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 dark:text-[#f5deb3] min-h-screen relative">
      <div className="absolute inset-0 bg-[url('/images/bg-milk-tea.jpg')] bg-cover bg-center opacity-10 dark:opacity-5 pointer-events-none z-0" />
      <div className="relative flex flex-col justify-center flex-1 w-full max-w-md mx-auto dark:text-white/90">
      <Link to="/" className="inline-flex items-center mb-8 text-sm text-gray-700 dark:text-gray-400">
                ← Quay về trang trang chủ
              </Link>
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-inherit">Đăng nhập</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Nhập email và mật khẩu để đăng nhập</p>
        </div>
        <div className="grid grid-cols-1 gap-3 mb-5 sm:grid-cols-2 sm:gap-5">
          <GoogleLoginButton returnUrl={returnUrl} />
          <button className="inline-flex items-center justify-center gap-3 py-3 text-sm text-gray-700 bg-gray-100 rounded-lg px-7 hover:bg-gray-200 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
            Đăng nhập X
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
        <div className="space-y-6">
          <div>
            <label className="block font-bold">Tên tài khoản <span className="text-red-600">*</span></label>
            <input
              type="text"
              placeholder="banhngot@sugarnest.vn"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-bold">Mật khẩu <span className="text-red-600">*</span></label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
              <i class="fa-regular fa-eye"></i>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
              <span className="text-sm">Ghi nhớ đăng nhập</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          <button
            onClick={handleLogin}
            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Đăng nhập
          </button>
          <p className="text-center text-sm text-[#5C4033]">
            Chưa có tài khoản?{' '}
            <Link to="/signup" className="text-[#A0522D] font-semibold underline hover:text-[#8B4513]">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}