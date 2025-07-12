import { useState } from "react";
import AxiosInstance from "../services/AxiosInstance";

export const useApiAction = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const trigger = async (path, method, data, config, isFormData = false) => {
    try {
      setLoading(true);
      setError(null);
      setResponse(null);

      let finalData = data;
      let headers = { ...(config?.headers || {}) };

      if (isFormData && data && typeof data === "object") {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => formData.append(key, v));
          } else if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });

        finalData = formData;
        headers["Content-Type"] = "multipart/form-data";
      }

      const axiosResponse = await AxiosInstance.request({
        url: path,
        method,
        data: finalData,
        headers,
        ...config,
      });

      setResponse(axiosResponse.data ?? null);
      return axiosResponse.data;
    } catch (err) {
      setError(err?.message || "API request failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { response, loading, error, trigger };
};
