import { useCallback, useState } from "react";
import axiosInstance from "./useAxios";

const useFetchQuery = (
  url,
  method = "GET",
  initialData = null,
  config = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const fetchData = useCallback(
    async (data = initialData) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axiosInstance({
          url,
          method,
          data,
          ...config,
        });
        if (res.data.success) {
          setResponse(res.data);
          setIsLoading(false);
        }
      } catch (err) {
        setError(err?.response?.data?.message || err);
        setIsLoading(false);
      }
    },
    [url, method, initialData, config]
  );

  return { response, error, isLoading, refetch: fetchData };
};

export default useFetchQuery;
