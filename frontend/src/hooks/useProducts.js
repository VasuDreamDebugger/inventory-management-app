import { useEffect, useState } from 'react';
import productsApi from '../api/productsApi';

function useProducts(initialParams = {}) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [params, setParams] = useState(initialParams);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const response = await productsApi.getProducts(params);
        if (isMounted) {
          setData(response.data || []);
          setPagination(response.pagination);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load products');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [params, version]);

  const refresh = () => setVersion((prev) => prev + 1);

  return {
    data,
    pagination,
    params,
    setParams,
    loading,
    error,
    refresh,
  };
}

export default useProducts;

