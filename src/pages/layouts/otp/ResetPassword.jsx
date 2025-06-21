import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import AuthService from '../../../services/AuthService'

export function ResetPassword() {  
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', otp: '', newPassword: '' });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: AuthService.resetPassword,
    onSuccess: () => navigate('/login'),
    onError: () => setError('OTP không hợp lệ hoặc đã hết hạn.'),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return(
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h2 className="text-2xl font-bold text-amber-500 text-center mb-6">Đặt Lại Mật Khẩu</h2>

      {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="text"
          name="otp"
          value={form.otp}
          onChange={handleChange}
          placeholder="Mã OTP"
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="Mật khẩu mới"
          className="w-full p-3 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-amber-500 text-white py-3 rounded hover:bg-amber-700 transition"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
        </button>
      </form>
    </div>
  )
}
