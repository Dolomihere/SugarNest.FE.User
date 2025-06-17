import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import AuthService from '../services/AuthService'

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: AuthService.register,
    onSuccess: (res) => {
      console.log('Registration success:', res.data);
      navigate('/login');
    },
    onError: (err) => {
      setError(response.data?.message || 'Đăng nhập thất bại');
    }
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white p-8 rounded shadow"
      >

        <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">
          Đăng Ký
        </h2>

        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Họ và tên"
          className="w-full p-3 border rounded mb-4"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
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
          Đăng ký
        </button>

        <p className="mt-4 text-sm text-center">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-pink-600 underline">
            Đăng nhập
          </Link>
        </p>

      </form>
    </div>
  )
}
