import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { FcGoogle } from 'react-icons/fc'
import { FaXTwitter } from 'react-icons/fa6'
import { HiArrowLeft } from 'react-icons/hi'
import { flushSync } from 'react-dom';

import { AuthService } from '../services/AuthService'

export function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userNameOrEmail: JSON.parse(sessionStorage.getItem('email')) || '',
    password: '',
  });
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (formData) => {
      const result = await AuthService.login(formData);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
   onSuccess: (token) => {
  if (remember) {
    localStorage.setItem('accessToken', token.accessToken);
    localStorage.setItem('refreshToken', token.refreshToken);
  } else {
    localStorage.setItem('accessToken', token.accessToken);
  }

  // Buộc React render ngay modal trước khi navigate
  flushSync(() => setShowSuccess(true));

  setTimeout(() => {
    const path = localStorage.getItem('lastAccessPath');
    navigate(path || '/');
  }, 2000);
},

    onError: (err) => {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();

    const { userNameOrEmail, password } = form;

    if (!userNameOrEmail || !password) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    setError('');
    loginMutation.mutate(form);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-dvh md:h-screen flex font-[Montserrat] bg-[#FFF9F4] relative">
      
      {/* Modal đăng nhập thành công */}
     {showSuccess && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          Đăng nhập thành công!
        </div>
      </div>
    )}


      {/* Form */}
      <div className={`flex flex-col flex-1 justify-center px-5 md:px-10 my-10 transition-all duration-300 ${showSuccess ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="flex flex-col gap-5 min-w-2/3 mx-auto bg-white rounded-xl shadow-md border border-[#F1D9C0] p-8">
          <Link to="/" className="flex text-[#5C4033] hover:underline text-sm">
            <HiArrowLeft className="mr-1 text-lg" />
            Quay về trang chủ
          </Link>

          <div>
            <h2 className="text-3xl font-bold text-[#5C4033] text-center mb-1">Đăng nhập</h2>
            <p className="text-center text-[#8B5E3C] text-sm mb-5">Nhập email hoặc tên người dùng và mật khẩu để đăng nhập</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button className="w-full py-2 px-3 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition text-[#5C4033] text-[15px] font-medium">
              <FcGoogle className="mr-2 text-xl" />
              Sign in with Google
            </button>

            <button className="w-full py-2 px-3 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition text-[#5C4033] text-[15px] font-medium">
              <FaXTwitter className="mr-2 text-xl" />
              Sign in with X
            </button>
          </div>

          <div className="text-center text-[#A67C52] text-sm">hoặc</div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 text-[15px]">
            <div>
              <label className="block text-sm text-[#8B5E3C] mb-1">Họ tên hoặc là Email</label>
              <input
                type="text"
                name="userNameOrEmail"
                value={form.userNameOrEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E8D3BD] rounded-lg bg-[#FFFDF9] text-[#5C4033] focus:outline-none focus:ring-2 focus:ring-[#D9A16C]"
                placeholder="banhngot@sugarnest.vn"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[#8B5E3C] mb-1">Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E8D3BD] rounded-lg bg-[#FFFDF9] text-[#5C4033] focus:outline-none focus:ring-2 focus:ring-[#D9A16C]"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <div className="flex justify-between text-sm">
              <label className="flex gap-2 text-[#5C4033]">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-[#D9A16C]"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-[#A0522D] hover:underline">Quên mật khẩu?</a>
            </div>

            <button
              type="submit"
              disabled={!form.userNameOrEmail || !form.password || loginMutation.isPending}
              className={`w-full bg-[#D9A16C] text-white font-semibold py-2 rounded-lg transition text-[15px] cursor-pointer ${
                (!form.userNameOrEmail || !form.password || loginMutation.isPending)
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-[#C98B55]'
              }`}
            >
              {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-sm text-[#5C4033]">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-[#A0522D] font-semibold underline hover:text-[#8B4513]">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>

      {/* Hình ảnh bên phải */}
      <div className={`hidden md:block w-1/2 transition-all duration-300 ${showSuccess ? 'blur-sm pointer-events-none' : ''}`}>
        <img
          src="/images/SignIn.png"
          alt="Bakery Promo"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-5 right-5">
          <button className="bg-white/80 text-[#5C4033] px-6 py-2 rounded-full font-semibold shadow-md hover:bg-white">
            ORDER NOW
          </button>
        </div>
      </div>
    </div>
  )
}
