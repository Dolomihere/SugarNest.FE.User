import { privateApi } from "../configs/AxiosConfig";

const ImageService = {
  uploadImage: async (file, token) => {
    try {
      if (!file || !(file instanceof File)) {
        throw new Error("Không có file hợp lệ được chọn.");
      }

      const formData = new FormData();
      formData.append("file", file);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const response = await privateApi.post("/testing/image", formData, {
        headers,
      });
      if (response.data && (response.data.url || response.data.imageUrl)) {
        const imageUrl = response.data.url || response.data.imageUrl;
        return { url: imageUrl };
      } else {
        throw new Error("Phản hồi từ server không chứa URL ảnh.");
      }
    } catch (error) {
      console.error(
        "Upload image error:",
        error.response?.data || error.message,
        "Status:",
        error.response?.status,
        "URL:",
        error.config?.url,
        "Detailed Errors:",
        error.response?.data?.errors
      );
      throw (
        error.response?.data?.message ||
        error.message ||
        "Lỗi kết nối hoặc tải ảnh thất bại."
      );
    }
  },
};

export default ImageService;
