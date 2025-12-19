import { useState } from 'react';
import { getAuth } from 'firebase/auth';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  user_id: string;
  user_name: string;
  image_url: string;
  buyer_id: string;
  created_at: string;
  like_count: number;
  is_liked: boolean;
}

export const useUserProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 引数で絞り込み条件を受け取るように変更
  const fetchUserProducts = async (userId: string, params?: { keyword?: string, sort?: string, status?: string }) => {
    if (!userId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';

      // URLオブジェクトを作成
      const url = new URL(`https://hackathon-backend-80731441408.europe-west1.run.app/users/${userId}/products`);
      
      // パラメータがあればクエリに追加
      if (params) {
        // キーワード検索 (バックエンドが対応していれば動作します)
        if (params.keyword) url.searchParams.append('q', params.keyword);
        // 並び替え
        if (params.sort) url.searchParams.append('sort', params.sort);
        // ステータス絞り込み
        if (params.status) url.searchParams.append('status', params.status);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 
          'Authorization': token ? `Bearer ${token}` : '' 
        }
      });
      
      if (!response.ok) {
        throw new Error('商品リストの取得に失敗しました');
      }

      const data = await response.json();
      setProducts(data || []);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, fetchUserProducts };
};