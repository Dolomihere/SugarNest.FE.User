import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { FcGoogle } from 'react-icons/fc'
import { FaXTwitter } from 'react-icons/fa6'
import { HiArrowLeft } from 'react-icons/hi'

import { AuthService } from '../services/AuthService'

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'customer' });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');

  const registerMutation = useMutation({
    mutationFn: (formData) => AuthService.register(formData),
    onSuccess: () => {
      sessionStorage.setItem('email', JSON.stringify(form.email));
      navigate('/otp/verifyemail');
    },
    onError: (err) => {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
      console.error(err);
    },
  });

  const handleRegister = (e) => {
    e.preventDefault();
    const { username, email, password } = form;

    if (!username || !email || !password) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    if (!agree) {
      setError('Bạn phải đồng ý với Điều khoản và Chính sách bảo mật.');
      return;
    }

    setError('');
    registerMutation.mutate(form);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-dvh md:h-screen flex font-[Montserrat] bg-[#FFF9F4]">
      <div className="flex flex-col flex-1 justify-center px-5 md:px-10 my-10">
        <div className="flex flex-col gap-5 min-w-2/3 mx-auto bg-white rounded-xl shadow-md border border-[#F1D9C0] p-8">

          <Link to="/" className="flex text-[#5C4033] hover:underline text-sm">
            <HiArrowLeft className="mr-1 text-lg" />
            Quay về trang chủ
          </Link>

          <div>
            <h2 className="text-3xl font-bold text-[#5C4033] text-center mb-1">Đăng ký</h2>
            <p className="text-center text-[#8B5E3C] text-sm mb-5">
              Nhập thông tin để tạo tài khoản mới
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button className="w-full py-2 px-3 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition text-[#5C4033] text-[15px] font-medium">
              <FcGoogle className="mr-2 text-xl" />
              Sign up with Google
            </button>
            <button className="w-full py-2 px-3 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition text-[#5C4033] text-[15px] font-medium">
              <FaXTwitter className="mr-2 text-xl" />
              Sign up with X
            </button>
          </div>

          <div className="text-center text-[#A67C52] text-sm">hoặc</div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4 text-[15px]">
            <div>
              <label className="block text-sm text-[#8B5E3C] mb-1">Họ tên *</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E8D3BD] rounded-lg bg-[#FFFDF9] text-[#5C4033] focus:outline-none focus:ring-2 focus:ring-[#D9A16C]"
                placeholder="Nguyễn SweetCake"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[#8B5E3C] mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E8D3BD] rounded-lg bg-[#FFFDF9] text-[#5C4033] focus:outline-none focus:ring-2 focus:ring-[#D9A16C]"
                placeholder="banhngot@sugarnest.vn"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[#8B5E3C] mb-1">Mật khẩu *</label>
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

            <div className="flex gap-2 text-sm text-[#5C4033]">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
                className="accent-[#D9A16C]"
              />
              <span>
                Bằng việc đăng ký, bạn đồng ý với{' '}
                <a href="#" className="text-[#A0522D] underline hover:text-[#8B4513]">Điều khoản</a> và{' '}
                <a href="#" className="text-[#A0522D] underline hover:text-[#8B4513]">Chính sách bảo mật</a>.
              </span>
            </div>

            <button
              type="submit"
              disabled={!form.username || !form.email || !form.password || !agree || registerMutation.isPending}
              className={`w-full bg-[#D9A16C] text-white font-semibold py-2 rounded-lg transition text-[15px] cursor-pointer ${
                (!form.username || !form.email || !form.password || !agree || registerMutation.isPending)
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-[#C98B55]'
              }`}
            >
              {registerMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          <p className="text-center text-sm text-[#5C4033]">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-[#A0522D] font-semibold underline hover:text-[#8B4513]">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:block w-1/2 relative">
        <img
          src="/images/SignUp.png"
          alt="Sign Up Illustration"
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
