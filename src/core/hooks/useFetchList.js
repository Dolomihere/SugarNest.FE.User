// src/core/hooks/useFetchList.js
import { useEffect, useState } from "react";
import AxiosInstance from "../services/AxiosInstance";

const useFetchList = (path, query, config) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        setLoading(true);
        setResponse(null);
        const queryString = buildQueryString(query);

        const axiosResponse = await AxiosInstance.get(
          `${path}?${queryString}`,
          config
        );

        setResponse(axiosResponse.data ?? null);
      } catch (err) {
        setError(err?.message || "Failed to fetch");
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAPI();
  }, [path, query]); // Thêm query vào dependency array

  return { response, loading, error };
};

// Helper: buildQueryString
export const buildQueryString = (query) => {
  const params = {};

  for (const key in query) {
    const value = query[key];
    if (typeof value === "object" && value !== null) {
      for (const innerKey in value) {
        const innerValue = value[innerKey];
        if (
          innerValue !== "" &&
          innerValue !== null &&
          innerValue !== undefined
        ) {
          params[`${key}.${innerKey}`] = innerValue.toString();
        }
      }
    } else {
      if (value !== "" && value !== null && value !== undefined) {
        params[key] = value.toString();
      }
    }
  }

  return new URLSearchParams(params).toString();
};

export default useFetchList;
