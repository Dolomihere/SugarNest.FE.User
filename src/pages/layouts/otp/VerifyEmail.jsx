import { useState, useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

export function VerifyEmail(email) {
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
      return AuthService.verifyemail(formdata);
    },
    onError: (error, variables, context) => {
      setErrorMgs('Lỗi xác thực, thử lại lần sau');
    },
    onSuccess: (data, variables, context) => {
      goto('/login');
    }
  });

  const mutationResend = useMutation({
    mutationFn: (sendMail) => {
      return AuthService.resendverifyemail(sendMail);
    }
  });

  return(
    <div className="h-screen grid place-content-center">
      <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
        
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Xác nhận email</h1>
          <p className="text-[15px] text-slate-500">Nhập 6 mã số được gửi đến email của bạn</p>
        </header>

        {errorMgs && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded">
            {errorMgs}
          </div>
        )}

        <form onSubmit={handleSubmit} id="otp-form" className="mt-8">
          <div className="flex items-center justify-center gap-3">

            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                pattern="\d*"
                value={value}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(e, index)}
                ref={el => {inputsRef.current[index] = el;}}
                className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            ))}

          </div>

          <div className="max-w-[260px] mx-auto mt-4">

            <button 
              type="submit"
              disabled={mutationOtp.isPending}
              className={`w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150 cursor-pointer
              ${(mutationOtp.isPending)
                ? 'opacity-50 cursor-not-allowed'
                : ''
              }`}
            >
              Xác thực email
            </button>
            
          </div>
        </form>

        <div className="text-sm text-slate-500 mt-4">Chưa nhận được mã?{' '}
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
        </div>

      </div>
    </div>
  )
}
