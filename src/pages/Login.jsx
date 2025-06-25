import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FaXTwitter } from 'react-icons/fa6'
import { HiArrowLeft } from 'react-icons/hi'

import AuthService from '../services/AuthService'

export function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ userNameOrEmail: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await AuthService.login(form);

      if (response.data?.isSuccess) {
        const { accessToken, refreshToken } = response.data.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        const lastVisited = localStorage.getItem('lastVisited') || '/';
        navigate(lastVisited);
        localStorage.removeItem('lastVisited');
      } else {
        setError(response.data?.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Lỗi khi đăng nhập. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="h-screen flex font-[Montserrat] bg-[#FFF9F4] overflow-hidden">
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-6 relative">

        <div className="w-full max-w-md mb-3">
          <Link to="/" className="flex items-center text-[#5C4033] hover:underline text-sm">
            <HiArrowLeft className="mr-1 text-lg" />
            Quay về trang chủ
          </Link>
        </div>

        {/* 📋 Form đăng nhập */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-[#F1D9C0] p-8">

          <h2 className="text-3xl font-bold text-[#5C4033] text-center mb-1">Đăng nhập</h2>
          <p className="text-center text-[#8B5E3C] text-sm mb-5">Nhập email và mật khẩu để đăng nhập</p>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 mb-4 rounded">
              {error}
            </div>
          )}

          {/* 🔗 Social buttons */}
          <div className="flex space-x-4 mb-4">

            <button className="w-full py-2 px-3 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition text-[#5C4033] text-[15px] font-medium">
              <FcGoogle className="mr-2 text-xl" />
              Sign in with Google
            </button>

            <button className="w-full py-2 px-3 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition text-[#5C4033] text-[15px] font-medium">
              <FaXTwitter className="mr-2 text-xl" />
              Sign in with X
            </button>

          </div>

          <div className="text-center text-[#A67C52] mb-4 text-sm">hoặc</div>

          {/* 📝 Form login */}
          <form onSubmit={handleLogin} className="space-y-5 text-[15px]">
            <div>
              <label className="block text-sm text-[#8B5E3C] mb-1">Email</label>
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-[#5C4033]">
                <input type="checkbox" className="accent-[#D9A16C]" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-[#A0522D] hover:underline">Quên mật khẩu?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D9A16C] hover:bg-[#C98B55] text-white font-semibold py-2 rounded-lg transition text-[15px]"
            >
              Đăng nhập
            </button>
          </form>

          <p className="text-center text-sm text-[#5C4033] mt-5">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-[#A0522D] font-semibold underline hover:text-[#8B4513]">
              Đăng ký ngay
            </Link>
          </p>

        </div>
      </div>

      {/* Right: Image */}
      <div className="hidden md:block w-1/2">

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
