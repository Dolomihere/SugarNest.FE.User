import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../core/services/AuthService';

export default function Enable2fa() {
  const email = JSON.parse(sessionStorage.getItem('email')) ?? '';
  const goto = useNavigate();

  const [errorMgs, setErrorMgs] = useState('');

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {

    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      otp: otp.join(''),
      email: email
    }
    mutationOtp.mutate(data);
  };

  const resendCode = () => {
    mutationResend.mutate(email);
  }

  const mutationOtp = useMutation({
    mutationFn: (formdata) => {
      return authService.on2fa(formdata);
    },
    onError: (error, variables, context) => {
      setErrorMgs('Lỗi xác thực, thử lại lần sau');
    },
    onSuccess: (data, variables, context) => {
      goto('/login');
    }
  });

  // const mutationResend = useMutation({
  //   mutationFn: (sendMail) => {
  //     return AuthService.resendverifyemail(sendMail);
  //   }
  // });

  return(
    <div className="h-screen grid place-content-center">
      <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
        
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Bật kích hoạt xác thực 2 bước</h1>
          <p className="text-[15px] text-slate-500">Nhập 6 mã số được gửi đến email của bạn</p>
        </header>

        {errorMgs && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded">{errorMgs}</div>
        )}

        {/* <div className="text-sm text-slate-500 mt-4">Chưa nhận được mã?{' '}
          <button
            type="button"
            disabled={mutationResend.isPending}
            onClick={() => resendCode()}
            className={`font-medium text-indigo-500 hover:text-indigo-600 cursor-pointer
            ${(mutationOtp.isPending)
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            Gửi lại mã
          </button>
        </div> */}

      </div>
    </div>
  );
}
