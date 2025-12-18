import { useEffect, useState } from 'react';
import { Product } from '../ProductList/useProductList'; // 型定義は再利用

export const useUserProductList = (userId: string | undefined) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUserProducts = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // ユーザーID指定で商品を取得するAPIを叩く
      const res = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/users/${userId}/products`);
      if (!res.ok) throw new Error('Failed to fetch user products');
      
      const data = await res.json();
      setProducts(data || []); // nullなら空配列
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProducts();
  }, [userId]);

  return { products, loading, error };
};