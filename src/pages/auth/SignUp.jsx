import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const 
[showRePassword, setShowRePassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 dark:text-[#f5deb3] min-h-screen relative">
      <div className="absolute inset-0 bg-[url('/images/bg-milk-tea.jpg')] bg-cover bg-center opacity-10 dark:opacity-5 pointer-events-none z-0" />
      <div className="relative w-full max-w-md pt-10 mx-auto mb-8">
        <Link to="/signin" className="inline-flex items-center text-sm text-gray-700 dark:text-gray-400 ">
          ← Quay về trang đăng nhập
        </Link>
      </div>
      <div className="relative flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 text-2xl font-semibold">Đăng ký</h1>
        <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">Nhập thông tin để tạo tài khoản mới</p>

        <div className="grid grid-cols-1 gap-3 mb-5 sm:grid-cols-2 sm:gap-5">
          <button className="inline-flex items-center justify-center gap-3 py-3 text-sm text-gray-700 bg-gray-100 rounded-lg px-7 hover:bg-gray-200 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
            Đăng nhập Google
          </button>
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

        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block font-bold">Họ <span className="text-red-600">*</span></label>
              <input className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800" placeholder="Nguyễn" />
            </div>
            <div>
              <label className="block font-bold">Tên <span className="text-red-600">*</span></label>
              <input className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800" placeholder="Bánh Ngọt" />
            </div>
          </div>

          <div>
            <label className="block font-bold">Email <span className="text-red-600">*</span></label>
            <input type="email" placeholder="banhngot@sugarnest.vn" className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800" />
          </div>

          <div>
            <label className="block font-bold">Mật khẩu <span className="text-red-600">*</span></label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800" />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                <i class="fa-regular fa-eye"></i>
              </span>
            </div>
          </div>

          <div>
            <label className="block font-bold">Xác nhận mật khẩu <span className="text-red-600">*</span></label>
            <div className="relative">
              <input type={showRePassword ? "text" : "password"} className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800" />
              <span
                onClick={() => setShowRePassword(!showRePassword)}
                className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                <i class="fa-regular fa-eye"></i>
              </span>
            </div>
          </div>

          <label className="flex items-start gap-3">
            <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
            <span className="text-sm">
              Bằng việc đăng ký, bạn đồng ý với <span className="text-blue-600 cursor-pointer hover:underline">Điều khoản</span> và <span className="text-blue-600 cursor-pointer hover:underline">Chính sách bảo mật</span> của chúng tôi.
            </span>
          </label>

          <button className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Đăng ký
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
