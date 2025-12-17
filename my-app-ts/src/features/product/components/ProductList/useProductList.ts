import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

// バックエンドの model.Product に対応する型
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  user_id: string;
  user_name: string;
  created_at: string;
}

export const useProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      // 認証トークンを取得 (ログインしていれば)
      let token = '';
      if (user) {
        token = await user.getIdToken();
      }

      // ★ GETリクエスト (バックエンドの ProductSearchController が処理)
      const response = await fetch('https://hackathon-backend-80731441408.europe-west1.run.app/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 認証が必要な場合のためにトークンを付与
          'Authorization': token ? `Bearer ${token}` : ''
        },
      });

      if (!response.ok) {
        throw new Error('商品リストの取得に失敗しました');
      }

      const data = await response.json();
      setProducts(data || []); // nullなら空配列に
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 画面が表示されたときに1回だけ実行
  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, reload: fetchProducts };
};