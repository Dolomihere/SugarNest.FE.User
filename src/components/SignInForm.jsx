import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { login, showTokens } from "../core/services/AuthService";
import CustomButton from "../ui/button/CusomButton";
import GoogleLoginButton from "../buttons/GoogleLoginButton";

export default function SignInForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [passowrd, setPassword] = useState("");

  const handleLogin = async () => {
    const result = await login({
      userNameOrEmail: username,
      password: passowrd,
    });
    if (result) {
      navigate(returnUrl ?? "/");
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-[#ffffff] dark:bg-gray-900 dark:text-[#f5deb3] min-h-screen relative">
      <div className="absolute inset-0 bg-[url('/images/bg-milk-tea.jpg')] bg-cover bg-center opacity-10 dark:opacity-5 pointer-events-none z-0" />
      <div className="relative flex flex-col justify-center flex-1 w-full max-w-md mx-auto dark:text-white/90">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 dark:text-inherit text-title-sm sm:text-title-md">
            Đăng nhập
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Nhập email và mật khẩu để đăng nhập
          </p>
        </div>

        <div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
            <GoogleLoginButton returnUrl={returnUrl}></GoogleLoginButton>
            <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
              <svg
                width="21"
                className="fill-current"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z" />
              </svg>
              Đăng nhập X
            </button>
          </div>

          <div className="relative py-5 text-gray-500">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-400" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-5 bg-white dark:bg-gray-900 dark:text-gray-400">
                hoặc
              </span>
            </div>
          </div>

          <form>
            <div className="space-y-6">
              <div>
                <Label className="font-bold">
                  Tên tài khoản
                  <span className="text-red-600 ms-0.5">*</span>
                </Label>
                <Input
                  placeholder="banhngot@sugarnest.vn"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <Label className="font-bold">
                  Mật khẩu
                  <span className="text-red-600 ms-0.5">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={passowrd}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="text-sm text-[#5C4033] dark:text-gray-400">
                    Ghi nhớ đăng nhập
                  </span>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-700 dark:text-blue-400 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <div>
                <CustomButton
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                  type="button"
                  onClick={handleLogin}
                >
                  Đăng nhập
                </CustomButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}