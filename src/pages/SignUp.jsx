import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../core/services/AuthService';

export default function SignUpPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "Customer"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      sessionStorage.setItem('email', JSON.stringify(formData.email));
      navigate("/otp/verifyemail");
    },
    onError: (err) => {
      setError("Đăng ký thất bại. Vui lòng thử lại.");
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isChecked) {
      setError("Bạn phải đồng ý với Điều khoản và Chính sách bảo mật.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setError("");
    mutation.mutate({
      userName: formData.userName,
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
    });
  };

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 dark:text-[#f5deb3] min-h-screen relative">
      <div className="relative w-full max-w-md pt-10 mx-auto mb-8">
        <Link to="/signin" className="inline-flex items-center text-sm text-gray-700 dark:text-gray-400 ">← Quay về trang đăng nhập</Link>
      </div>

      <div className="relative flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 text-2xl font-semibold">Đăng ký</h1>
        <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">Nhập thông tin để tạo tài khoản mới</p>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 border border-red-300 rounded">{error}</div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>

          <div>
            <label className="block font-bold">Tên tài khoản <span className="text-red-600">*</span></label>
            <input
              ref={inputRef}
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
              placeholder="Account123"
            />
          </div>

          <div>
            <label className="block font-bold">Họ tên <span className="text-red-600">*</span></label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
              placeholder="Nguyễn Bánh Ngọt"
            />
          </div>

          <div>
            <label className="block font-bold">Email <span className="text-red-600">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="banhngot@sugarnest.vn"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block font-bold">Số điện thoại <span className="text-red-600">*</span></label>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block font-bold">Mật khẩu <span className="text-red-600">*</span></label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                <i className="fa-regular fa-eye"></i>
              </span>
            </div>
          </div>

          <div>
            <label className="block font-bold">Xác nhận mật khẩu <span className="text-red-600">*</span></label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showRePassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800"
              />
              <span
                onClick={() => setShowRePassword(!showRePassword)}
                className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                <i className="fa-regular fa-eye"></i>
              </span>
            </div>
          </div>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <span className="text-sm">
              Bằng việc đăng ký, bạn đồng ý với{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">Điều khoản</span> và{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">Chính sách bảo mật</span> của chúng tôi.
            </span>
          </label>

          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {mutation.isLoading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <div className="mt-5 mb-12 text-center sm:text-start">
          <p className="text-sm text-gray-700">
            Đã có tài khoản? <Link to="/auth/signin" className="text-blue-700 hover:underline">Đăng nhập</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
