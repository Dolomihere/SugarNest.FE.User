import { publicApi } from "../configs/AxiosConfig";

export const AuthService = {
  register: async (formdata) => {
    const res = await publicApi.post('/auth/signup', formdata);
    return res.data;
  },

  login: async (formdata) => {
    const res = await publicApi.post('/auth/signin', formdata);
    return res.data;
  },

  // Google Sign In
  loginGoogle: async (credential) => {
    const res = await publicApi.post('/auth/signin-google/v2', { credential });
    return res.data;
  },

  // Google Sign Up
  registerGoogle: async (credential) => {
    const res = await publicApi.post('/auth/signup-google', { credential });
    return res.data;
  },

  // ✅ Verify Account (email + otp)
  verify: async ({ email, code }) => {
    const payload = { email, otp: code.toString().padStart(6, "0").trim() };
    console.log("Verify payload:", payload);
    const res = await publicApi.post("/auth/verify", payload);
    return res.data;
  },

  // Send Verification Code
  sendVerification: async (email) => {
    const payload = { email };
    console.log("📤 AuthService.sendVerification payload:", payload);
    const res = await publicApi.post('/auth/verify/send', payload);
    console.log("📥 AuthService.sendVerification response:", res.data);
    return res.data;
  },

  // Reset Password
  // Reset Password with OTP
  resetPasswordOtp: async ({ email, otp, newPassword }) => {
    const payload = { email, otp, newPassword };
    console.log("📤 AuthService.resetPasswordOtp payload:", payload);

    const res = await publicApi.post('/auth/reset-password', payload);

    console.log("📥 AuthService.resetPasswordOtp response:", res.data);

    return {
      success: res.data?.statusCode === 200 && res.data?.data === true,
      message: res.data?.message,
      ...res.data,
    };
  },


  // Send Password Reset Link
  sendResetPassword: async (email, resetPasswordUrl) => {
    const payload = { email, resetPasswordUrl };
    console.log("📤 AuthService.sendResetPassword payload:", payload);
    const res = await publicApi.post('/auth/reset-password/send', payload);
    console.log("📥 AuthService.sendResetPassword response:", res.data);
    return res.data;
  },

  // Refresh Token
  refreshToken: async (refreshToken) => {
    const res = await publicApi.post('/auth/refresh-token', { refreshToken });
    return res.data;
  },

  // 2FA Login
  login2fa: async (code) => {
    const res = await publicApi.post('/auth/signin2fa', { code });
    return res.data;
  },
};