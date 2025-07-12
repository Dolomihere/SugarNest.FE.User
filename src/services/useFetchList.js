// path, query, config

import { useEffect, useState } from "react";
import AxiosInstance from "../configs/AxiosInstance";

const useFetchList = (
  path,
  query,
  config,
  reloadTrigger
) => {
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
        setError(err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };
    fetchAPI();
  }, [path, reloadTrigger]);
  // , JSON.stringify(query) use when you want to reload every time query is changed
  return { response, loading, error };
};

// helper
export const buildQueryString = (query) => {
  const params = {};

  for (const key in query) {
    const value = query[key];
    if (typeof value === 'object' && value !== null) {
      for (const innerKey in value) {
        const innerValue = value[innerKey];
        if (innerValue !== '' && innerValue !== null && innerValue !== undefined) {
          params[`${key}.${innerKey}`] = innerValue;
        }
      }
    } else {
      if (value !== '' && value !== null && value !== undefined) {
        params[key] = value;
      }
    }
  }

  return new URLSearchParams(params).toString();
};


export default useFetchList;
