import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { flushSync } from "react-dom";
import { AuthService } from "../../services/AuthService";
import GoogleLoginButton from "../../components/buttons/GoogleLoginButton";
import EmojiPopperMultiPosition from "../../components/EmojiPopperMultiPosition";
import axios from "axios";

// Token storage keys (consistent with provided auth code)
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// Conditional logging for development
const log = process.env.NODE_ENV === "development" ? console.log : () => {};

export default function SignInForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code2fa, setCode2fa] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [requires2fa, setRequires2fa] = useState(false);
  const isMounted = useRef(true);

  // Cleanup to prevent navigation after component unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const signinWithGoogleV2 = async (authorizationCode) => {
    const tempClient = axios.create({
      baseURL: "https://sugarnest-api.io.vn/",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await tempClient.post("/auth/signin-google/v2", {
      authorizationCode,
      isCustomer: true,
    });
    const result = response.data;

    if (result?.isSuccess && result.data) {
      localStorage.setItem(ACCESS_TOKEN_KEY, result.data.accessToken);
      if (result.data?.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, result.data.refreshToken);
      }
      // storeTokens(result.data);
      return true;
    } else {
      const errMsg =
        result.message ||
        result.errors?.join(", ") ||
        "Đăng nhập không thành công. Vui lòng thử lại.";
      alert(errMsg);
      return false;
    }
  };

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const exchangeCode = async () => {
      const authorizationCode = code;
      const result = await signinWithGoogleV2(authorizationCode);
      if (result) {
        alert("Đăng nhập thành công");
        // alert(1);
        // setLogedIn(); // Set logged in state and navigate to home
        // await confirm({
        //   title: "Thông báo",
        //   message: "Đăng nhập thành công!",
        //   confirmText: "Xác nhận",
        //   confirmClassName: "",
        //   cancelText: "Thoát",
        // });

        navigate("/");
      } else {
        alert("Đăng nhập google thất bại")
        // await confirm({
        //   title: "Thông báo",
        //   message: "Đăng nhập thất bại!",
        //   confirmText: "Xác nhận",
        //   confirmClassName: "",
        //   cancelText: "Thoát",
        // });
        // logoutApp(); // Logout if signin failed
      }
      // else
      // alert(2);
    };
    exchangeCode();
  }, [searchParams]);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let result;
      if (requires2fa && code2fa) {
        result = await AuthService.login2fa(code2fa);
      } else {
        result = await AuthService.login({
          userNameOrEmail: username,
          password,
        });
      }

      log("Login result:", result);

      if (result.isSuccess) {
        if (result.data?.requires2fa) {
          setRequires2fa(true);
          setError("Vui lòng nhập mã 2FA được gửi qua email hoặc SMS");
          return;
        }
        if (result.data?.requiresVerification) {
          setError("Đang chuyển hướng đến trang xác thực...");
          setTimeout(() => {
            if (isMounted.current) {
              navigate(`/verify?email=${encodeURIComponent(username)}`);
            }
          }, 1000);
          return;
        }
        if (result.data?.accessToken) {
          localStorage.setItem(ACCESS_TOKEN_KEY, result.data.accessToken);
          if (result.data?.refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, result.data.refreshToken);
          }
        }
        flushSync(() => {
          setShowSuccess(true);
        });
        setTimeout(() => {
          if (isMounted.current) {
            log("Executing navigate to / (regular login)");
            navigate(returnUrl || "/");
          }
        }, 1500);
      } else {
        setError(result.message || "Đăng nhập thất bại");
        if (result.message?.includes("Yêu cầu xác thực tài khoản")) {
          setError("Đang chuyển hướng đến trang xác thực...");
          setTimeout(() => {
            if (isMounted.current) {
              navigate(`/verify?email=${encodeURIComponent(username)}`);
            }
          }, 1000);
        }
      }
    } catch (err) {
      log("Login error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Có lỗi xảy ra khi đăng nhập";
      setError(errorMsg);
      if (errorMsg.includes("2FA")) {
        setRequires2fa(true);
      } else if (errorMsg.includes("Yêu cầu xác thực tài khoản")) {
        setError("Đang chuyển hướng đến trang xác thực...");
        setTimeout(() => {
          if (isMounted.current) {
            navigate(`/verify?email=${encodeURIComponent(username)}`);
          }
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credential) => {
    if (!username) {
      setError(
        "Vui lòng nhập email hoặc tên tài khoản trước khi đăng nhập bằng Google"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await AuthService.loginGoogle({
        credential,
        userNameOrEmail: username,
        returnUrl,
      });
      log("Google login result:", result);

      if (result.isSuccess) {
        if (result.data?.requiresVerification) {
          const email = result.data?.email || username;
          setError("Đang chuyển hướng đến trang xác thực...");
          setTimeout(() => {
            if (isMounted.current) {
              navigate(`/verify?email=${encodeURIComponent(email)}`);
            }
          }, 1000);
          return;
        }
        if (result.data?.accessToken) {
          localStorage.setItem(ACCESS_TOKEN_KEY, result.data.accessToken);
          if (result.data?.refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, result.data.refreshToken);
          }
        }
        flushSync(() => {
          setShowSuccess(true);
        });
        setTimeout(() => {
          if (isMounted.current) {
            log("Executing navigate to / (Google login)");
            navigate(returnUrl || "/");
          }
        }, 1500);
      } else {
        setError(result.message || "Đăng nhập Google thất bại");
        if (result.message?.includes("Yêu cầu xác thực tài khoản")) {
          const email = result.data?.email || username;
          setError("Đang chuyển hướng đến trang xác thực...");
          setTimeout(() => {
            if (isMounted.current) {
              navigate(`/verify?email=${encodeURIComponent(email)}`);
            }
          }, 1000);
        }
      }
    } catch (err) {
      log("Google login error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Có lỗi xảy ra khi đăng nhập Google";
      setError(errorMsg);
      if (errorMsg.includes("Yêu cầu xác thực tài khoản")) {
        const email = err.response?.data?.email || username;
        setError("Đang chuyển hướng đến trang xác thực...");
        setTimeout(() => {
          if (isMounted.current) {
            navigate(`/verify?email=${encodeURIComponent(email)}`);
          }
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 dark:text-[#f5deb3] min-h-screen relative">
      <div className="absolute inset-0 bg-[url('/images/bg-milk-tea.jpg')] bg-cover bg-center opacity-10 dark:opacity-5 pointer-events-none z-0" />

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative bg-gradient-to-br from-[#fff8f1] to-[#fcead9] border border-[#f9c89b] text-[#5c4033] rounded-2xl px-8 py-6 shadow-2xl text-center max-w-sm w-full animate-fade-in-down">
            <div className="text-2xl font-semibold mb-2">
              🎉 Đăng nhập thành công!
            </div>
            <p className="text-sm text-[#8B5E3C] leading-relaxed">
              Chào mừng bạn đến với <strong>SugarNest</strong> 🍰 – nơi ngập
              tràn bánh ngọt và niềm vui!
            </p>
            <div className="mt-2">
              <EmojiPopperMultiPosition
                popupIcon={<span>🍰</span>}
                trigger="hover"
                count={6}
                duration={1200}
                zoneWidth={150}
                zoneHeight={200}
              >
                <span
                  onClick={() => {
                    if (isMounted.current) {
                      log("Manual navigate to / (emoji click)");
                      navigate("/");
                    }
                  }}
                  className="inline-block text-2xl cursor-pointer hover:scale-110 transition-transform duration-300"
                >
                  🍰
                </span>
              </EmojiPopperMultiPosition>
            </div>
          </div>
        </div>
      )}

      <div className="relative flex flex-col justify-center flex-1 w-full max-w-md mx-auto dark:text-white/90">
        <Link
          to="/"
          className="inline-flex items-center mb-8 text-sm text-gray-700 dark:text-gray-400"
        >
          ← Quay về trang chủ
        </Link>

        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-inherit">
            Đăng nhập
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Nhập email hoặc tên tài khoản và mật khẩu để đăng nhập
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-5 sm:grid-cols-2 sm:gap-5">
          <GoogleLoginButton
            onSuccess={handleGoogleLogin}
            loading={loading}
            returnUrl={returnUrl}
            disabled={!username || loading} // Disable if username is empty
          />
          <button
            disabled={loading}
            className="inline-flex items-center justify-center gap-3 py-3 text-sm text-gray-700 bg-gray-100 rounded-lg px-7 hover:bg-gray-200 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập X"}
          </button>
        </div>

        <div className="relative py-5 text-gray-500">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-5 bg-white dark:bg-gray-900 dark:text-gray-400">
              hoặc
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block font-bold">
              Tên tài khoản/Email <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="banhngot@sugarnest.vn"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-bold">
              Mật khẩu <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2 text-gray-500 dark:text-gray-400"
              >
                <i
                  className={`fa-regular fa-eye${showPassword ? "-slash" : ""}`}
                ></i>
              </span>
            </div>
          </div>

          {requires2fa && (
            <div>
              <label className="block font-bold">
                Mã 2FA <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập mã 2FA"
                className="w-full p-3 mt-1 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                value={code2fa}
                onChange={(e) => setCode2fa(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                disabled={loading}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Ghi nhớ đăng nhập
              </span>
            </label>
            <Link
              to="/request-reset-password"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>

          <p className="text-center text-sm text-[#5C4033] dark:text-gray-300">
            Chưa có tài khoản?{" "}
            <Link
              to="/signup"
              className="text-[#A0522D] font-semibold underline hover:text-[#8B4513] dark:text-blue-400 dark:hover:text-blue-500"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
