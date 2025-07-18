import { useEffect, useRef } from "react";
import { signinWithGoogle } from "../../core/services/AuthService";
import { useNavigate } from "react-router";

const GoogleLoginButton = ({ returnUrl }) => {
  const navigate = useNavigate();

  const hasPromptedRef = useRef(false); // ✅ đảm bảo giữ giá trị giữa các re-render

  useEffect(() => {}, []);

  const handleCredentialResponse = async (response) => {
    console.log(response);
    const credential = response.credential;
    const result = await signinWithGoogle(credential);
    if (result) {
      // navigate(returnUrl ?? "/");
    }
  };

  const handleSigninByGoogle = () => {
    const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&response_mode=query&scope=email%20profile&prompt=consent";
    const clientId = `client_id=1084075727869-8dl016bmprkgl9v3o1bcusvggmdp7l9o.apps.googleusercontent.com`;
    const redirectUri = `redirect_uri=${window.location.origin}/signin-google/v2`;

    window.location.href = (`${baseUrl}&${clientId}&${redirectUri}`);

    // googleLoginWindowRef = null;
    // googleLoginWindowRef = window.google.accounts.id.initialize({
    //   client_id:
    //     "1084075727869-8dl016bmprkgl9v3o1bcusvggmdp7l9o.apps.googleusercontent.com",
    //   callback: handleCredentialResponse,
    // });
    // if (window.google) {
    //   window.google.accounts.id.initialize({
    //     client_id: "1084075727869-8dl016bmprkgl9v3o1bcusvggmdp7l9o.apps.googleusercontent.com",
    //     callback: handleCredentialResponse,
    //   });
    // }

    // if (!window.google || hasPromptedRef.current) return;
    // if (hasPromptedRef.current) return;

    // hasPromptedRef.current = true;
    // window.google.accounts.id.prompt();

    // Cho phép đăng nhập lại sau 5s nếu cần
    setTimeout(() => {
      hasPromptedRef.current = false;
    }, 5000);
  };

  return (
    <>
      <button
        className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
        type="button"
        onClick={handleSigninByGoogle}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
            fill="#4285F4"
          />
          <path
            d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
            fill="#34A853"
          />
          <path
            d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
            fill="#FBBC05"
          />
          <path
            d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
            fill="#EB4335"
          />
        </svg>
        Đăng nhập Google
      </button>
      {/* <div id="googleButton" /> */}
    </>
  );
};

export default GoogleLoginButton;