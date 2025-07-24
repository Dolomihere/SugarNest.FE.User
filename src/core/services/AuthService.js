import AxiosInstance from "./AxiosInstance";
import axios from "axios";

// === KEY để lưu token vào localStorage ===
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// Lưu token
const storeTokens = (tokenResponse) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokenResponse.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokenResponse.refreshToken);
};

// Xóa token
const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Trợ năng
export const showTokens = () => {
  console.log("access:", getAccessToken(), "refresh:", getRefreshToken());
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
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
      return { success: true, data: result.data };
    }

    const errMsg =
      result.message ||
      result.errors?.join(", ") ||
      "Đăng nhập không thành công. Vui lòng thử lại.";

    return { success: false, message: errMsg };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || "Lỗi máy chủ. Vui lòng thử lại.",
        };
      }
    }
    return { success: false, message: "Không thể kết nối tới máy chủ." };
  }
};

/**
 * Đăng ký
 */
export const register = async (data) => {
  try {
    const response = await AxiosInstance.post("/auth/signup", data);
    const result = response.data;

    if (result?.isSuccess && result.data) {
      storeTokens(result.data);
      return { success: true, data: result.data };
    }

    const errMsg =
      result.message ||
      result.errors?.join(", ") ||
      "Đăng ký không thành công. Vui lòng thử lại.";

    return { success: false, message: errMsg };
  } catch (error) {
    return { success: false, message: "Lỗi không xác định khi đăng ký." };
  }
};

/**
 * Làm mới access token bằng refresh token
 */
export const refreshToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    const RawAxios = axios.create({
      baseURL: "https://sugarnest-api.io.vn/",
      headers: { "Content-Type": "application/json" },
    });

    const response = await RawAxios.post("/auth/refresh-token", { refreshToken });
    const result = response.data;

    if (result?.isSuccess && result.data) {
      storeTokens(result.data);
      return result.data.accessToken;
    }

    return null;
  } catch (error) {
    console.error("Refresh token failed:", error);
    return null;
  }
};

/**
 * Đăng xuất
 */
export const logout = () => {
  clearTokens();
};

/**
 * Đăng nhập với Google v1
 */
export const signinWithGoogle = async (idToken) => {
  try {
    const response = await AxiosInstance.post("/auth/signin-google", { idToken });
    const result = response.data;

    if (result?.isSuccess && result.data) {
      storeTokens(result.data);
      return { success: true, data: result.data };
    }

    const errMsg =
      result.message ||
      result.errors?.join(", ") ||
      "Đăng nhập Google thất bại. Vui lòng thử lại.";
    return { success: false, message: errMsg };
  } catch (error) {
    return { success: false, message: "Lỗi kết nối khi đăng nhập với Google." };
  }
};

/**
 * Đăng nhập với Google v2 (OAuth)
 */
export const signinWithGoogleV2 = async (authorizationCode) => {
  try {
    const response = await AxiosInstance.post("/auth/signin-google/v2", {
      authorizationCode,
    });
    const result = response.data;

    if (result?.isSuccess && result.data) {
      storeTokens(result.data);
      return { success: true, data: result.data };
    }

    const errMsg =
      result.message ||
      result.errors?.join(", ") ||
      "Đăng nhập Google thất bại. Vui lòng thử lại.";
    return { success: false, message: errMsg };
  } catch (error) {
    return { success: false, message: "Lỗi kết nối khi đăng nhập với Google." };
  }
};
