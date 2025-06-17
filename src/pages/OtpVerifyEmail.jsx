import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import AuthService from '../services/AuthService'

export function OtpVerifyEmailPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', otp: '' });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: AuthService.verifyEmail,
    onSuccess: () => {
      console.log('✅ Email verified successfully!');
      navigate('/login');
    },
    onError: (error) => {
      setError("Mã otp không đúng hoặc hết hạn");
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">

        <h2 className="text-2xl font-bold text-pink-600 text-center mb-6">Xác Minh Email</h2>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded"
          required
        />

        <input
          type="text"
          name="otp"
          value={form.otp}
          onChange={handleChange}
          placeholder="Mã OTP"
          className="w-full p-3 mb-4 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-3 rounded hover:bg-pink-700 transition"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Đang xác minh...' : 'Xác Minh'}
        </button>

      </form>
    </div>
  )
}
