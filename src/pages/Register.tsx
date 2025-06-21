import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { HiArrowLeft } from 'react-icons/hi';
import AuthService from '../services/AuthService';

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [agree, setAgree] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agree) {
      setError('Bạn cần đồng ý với Điều khoản và Chính sách bảo mật.');
      return;
    }

    try {
      const response = await AuthService.register({
        fullName: `${form.lastName} ${form.firstName}`,
        email: form.email,
        password: form.password,
      });
      if (response.data?.isSuccess) {
        navigate('/login');
      } else {
        setError(response.data?.message || 'Đăng ký thất bại');
      }
    } catch {
      setError('Lỗi khi đăng ký. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="h-screen flex font-[Montserrat] bg-[#FFF9F4] overflow-hidden">
      {/* Left side */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-6">
        <div className="w-full max-w-md mb-3">
          <Link to="/" className="flex items-center text-[#5C4033] hover:underline text-sm">
            <HiArrowLeft className="mr-1 text-lg" />
            Quay về trang chủ
          </Link>
        </div>

        <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-[#F1D9C0] p-8">
          <h2 className="text-3xl font-bold text-[#5C4033] text-center mb-1">Đăng ký</h2>
          <p className="text-center text-[#8B5E3C] text-sm mb-5">Nhập thông tin bên dưới để tạo tài khoản mới!</p>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 mb-4 rounded">
              {error}
            </div>
          )}

          <div className="flex space-x-4 mb-4">
            <button className="w-full py-2 px-3 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition text-[#5C4033] text-[15px] font-medium">
              <FcGoogle className="mr-2 text-xl" />
              Đăng ký với Google
            </button>
            <button className="w-full py-2 px-3 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition text-[#5C4033] text-[15px] font-medium">
              <span className="mr-2 text-lg font-bold">X</span>
              Đăng ký với X
            </button>
          </div>

          <div className="text-center text-[#A67C52] mb-4 text-sm">hoặc</div>

          <form onSubmit={handleRegister} className="space-y-4 text-[15px]">
            <div className="flex space-x-2">
              <div className="w-1/2">
                <label className="block text-sm text-[#8B5E3C] mb-1">Họ *</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#E8D3BD] rounded-lg bg-[#FFFDF9] text-[#5C4033] focus:outline-none"
                  placeholder="Nguyễn"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm text-[#8B5E3C] mb-1">Tên *</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#E8D3BD] rounded-lg bg-[#FFFDF9] text-[#5C4033] focus:outline-none"
                  placeholder="Bánh Ngọt"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#8B5E3C] mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E8D3BD] rounded-lg bg-[#FFFDF9] text-[#5C4033]"
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
                className="w-full px-4 py-2 border border-[#E8D3BD] rounded-lg bg-[#FFFDF9] text-[#5C4033]"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
                className="mt-1"
                required
              />
              <p className="text-sm text-[#5C4033]">
                Bằng việc đăng ký, bạn đồng ý với{' '}
                <a href="#" className="text-[#A0522D] underline hover:text-[#8B4513]">Điều khoản</a> và{' '}
                <a href="#" className="text-[#A0522D] underline hover:text-[#8B4513]">Chính sách bảo mật</a> của chúng tôi.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D9A16C] hover:bg-[#C98B55] text-white font-semibold py-2 rounded-lg transition text-[15px]"
            >
              Đăng ký
            </button>
          </form>

          <p className="text-center text-sm text-[#5C4033] mt-5">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-[#A0522D] font-semibold underline hover:text-[#8B4513]">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="hidden md:block w-1/2 relative">
        <img
          src="/images/SignUp.png" 
          alt="Dessert Menu"
          className="w-full h-full object-cover"
        />
       
      </div>
    </div>
  );
}
