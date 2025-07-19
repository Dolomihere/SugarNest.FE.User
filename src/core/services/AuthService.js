import AxiosInstance from "./AxiosInstance";
// import { LoginRequest } from "../models/Auth/AuthRequest";
// import { RegisterRequest } from "../models/Auth/RegisterRequest";
// import { TokenResponse } from "../models/Auth/TokenResponse";
// import { ApiResponse } from "../common/ApiResponse";
import axios from "axios";
import { useNavigate } from "react-router";

// === KEY để lưu token vào localStorage ===
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * Lưu access & refresh token vào localStorage
 */
const storeTokens = (tokenResponse) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokenResponse.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokenResponse.refreshToken);
};

/**
 * Xóa token khỏi localStorage
 */
const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const showTokens = () => {
  console.log(
    "access: " + getAccessToken() + ". refresh: " + getRefreshToken()
  );
};

/**
 * Lấy access token từ localStorage
 */
export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

/**
 * Lấy refresh token từ localStorage
 */
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

/**
 * Đăng nhập
 */
export const login = async (data) => {
  try {
    const response = await AxiosInstance.post("/auth/signin", data);
    const result = response.data;

    if (result?.isSuccess && result.data) {
      storeTokens(result.data);
      alert("Đăng nhập thành công");
      return true;
    }

    // Trường hợp response trả về nhưng không success
    const errMsg =
      result.message ||
      result.errors?.join(", ") ||
      "Đăng nhập không thành công. Vui lòng thử lại.";
    throw new Error(errMsg);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Nếu có response từ server
      if (error.response) {
        const status = error.response.status;
        alert(error.response.data.message);
        return false;

        // Nếu là 400 → sai tài khoản hoặc mật khẩu
        if (status === 400) {
          // return "Tài khoản không tồn tại hoặc sai mật khẩu";
        }

        // Các lỗi khác có response
        // return "Không thể đăng nhập";
        alert(error);
        return false;
      }

      // Lỗi có thể do network hoặc timeout
      // return "Không thể kết nối đến máy chủ";
    }

    // Lỗi không phải AxiosError
    // return "Lỗi không xác định khi đăng nhập.";
    alert(error);
    return false;
  }
};

/**
 * Đăng ký
 */
export const register = async (data) => {
  try {
    const response = await AxiosInstance.post("/auth/signup", data);
    if (response.data) {
      storeTokens(response.data);
      return true;
    }
  } catch (error) {
    console.error("Register failed:", error);
  }
  return false;
};

/**
 * Refresh token khi access token hết hạn
 */
export const refreshToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    // ❗️Dùng RawAxios, không dùng AxiosInstance để tránh interceptor
    const RawAxios = axios.create({
      baseURL: "https://sugarnest-api.io.vn/",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await RawAxios.post("/auth/refresh-token", {
      refreshToken,
    });

    if (response.data) {
      const result = response.data;
      if (result.data) {
        storeTokens(result.data);
        return result.data.accessToken;
      }
    }
  } catch (error) {
    console.error("Refresh token failed:", error);
  }
  return null;
};

/**
 * Đăng xuất
 */
export const logout = () => {
  clearTokens();
};

export const signinWithGoogle = async (idToken) => {
  const response = await AxiosInstance.post("/auth/signin-google", {
    idToken,
  });
  const result = response.data;

  if (result?.isSuccess && result.data) {
    storeTokens(result.data);
    alert("Đăng nhập thành công");
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

export const signinWithGoogleV2 = async (authorizationCode) => {
  const response = await AxiosInstance.post("/auth/signin-google/v2", {
    authorizationCode,
  });
  const result = response.data;

  if (result?.isSuccess && result.data) {
    storeTokens(result.data);
    alert("Đăng nhập thành công");
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
