import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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

        navigate('/');
      } else {
        setError(response.data?.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Lỗi khi đăng nhập. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded shadow"
      >

        <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">
          Đăng Nhập
        </h2>

        <input
          type="text"
          name="userNameOrEmail"
          value={form.userNameOrEmail}
          onChange={handleChange}
          placeholder="Nhập tên hoặc email"
          className="w-full p-3 border rounded mb-4"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Mật khẩu"
          className="w-full p-3 border rounded mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-pink-600 text-white p-3 rounded hover:bg-pink-700 transition"
        >
          Đăng nhập
        </button>

        <p className="mt-4 text-sm text-center">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-pink-600 underline">
            Đăng ký
          </Link>
        </p>

      </form>
    </div>
  )
}
