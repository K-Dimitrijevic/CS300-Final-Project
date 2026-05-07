import { useCallback, useState } from "react";
import { fetchPublicDataset } from "../services/apiService";

const useFetchDataset = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchPublicDataset();
      setData(response);
    } catch (err) {
      setError(err?.message || "Unable to load the public dataset.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refetch: loadData };
};

export default useFetchDataset;
