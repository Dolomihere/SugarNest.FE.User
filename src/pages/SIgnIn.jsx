import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../core/services/AuthService';

export default function SignInPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({ userNameOrEmail: JSON.parse(sessionStorage.getItem('email')) || '', password: '' });

  const loginMutation = useMutation({
    mutationFn: (formData) => authService.login(formData),
    onSuccess: (res) => {
      let token = res.data;

      if (isChecked) {
        localStorage.setItem('accessToken', token.accessToken);
        localStorage.setItem('refreshToken', token.refreshToken);
      }
      else {
        localStorage.setItem('accessToken', token.accessToken);
      }
      
      let path = localStorage.getItem('lastAccessPath');

      if (path) navigate(path);
      else navigate("/");
    },
    onError: (err) => {
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
      console.error(err);
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
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 dark:text-[#f5deb3] min-h-screen relative">
      <div className="relative flex flex-col justify-center flex-1 w-full max-w-md mx-auto dark:text-white/90">
      
        <Link to="/" className="inline-flex items-center mb-8 text-sm text-gray-700 dark:text-gray-400">← Quay về trang trang chủ</Link>

        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-inherit">Đăng nhập</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Nhập email và mật khẩu để đăng nhập</p>
        </div>

        {error && (
          <span className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 mb-4 rounded">{error}</span>
        )}

        <div className="grid grid-cols-1 gap-3 mb-5 sm:grid-cols-2 sm:gap-5">
          {/* <GoogleLoginButton returnUrl={returnUrl} /> */}
        </div>

        <div className="relative py-5 text-gray-500">

          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-400"></div>
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
              name="userNameOrEmail"
              value={form.userNameOrEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#E8D3BD] rounded-lg bg-[#FFFDF9] text-[#5C4033] focus:outline-none focus:ring-2 focus:ring-[#D9A16C]"
              placeholder="banhngot@sugarnest.vn"
            />
          </div>

          <div>
            <label className="block font-bold">Mật khẩu <span className="text-red-600">*</span></label>
            <div className="relative">

              <input
                type={!showPassword ? "password" : "text"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E8D3BD] rounded-lg bg-[#FFFDF9] text-[#5C4033] focus:outline-none focus:ring-2 focus:ring-[#D9A16C]"
                placeholder="Nhập mật khẩu"
                required
              />
              
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
              <i className="fa-regular fa-eye"></i>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
              <span className="text-sm">Ghi nhớ đăng nhập</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Quên mật khẩu?</Link>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Đăng nhập
          </button>

          <p className="text-center text-sm text-[#5C4033]">
            Chưa có tài khoản?{' '}
            <Link to="/auth/signup" className="text-[#A0522D] font-semibold underline hover:text-[#8B4513]">Đăng ký ngay</Link>
          </p>

        </div>
          
      </div>
    </div>
  );
}
