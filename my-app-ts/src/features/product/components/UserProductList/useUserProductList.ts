import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { Product } from '../ProductList/useProductList';

export const useUserProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 引数で絞り込み条件を受け取るように変更
  const fetchUserProducts = async (userId: string, params?: { keyword?: string, sort?: string, status?: string, page?: number }) => {
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

      const page = params?.page || 1;
      url.searchParams.append('page', page.toString());

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
      setProducts(data.products || []);
      setTotal(data.total || 0);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!window.confirm("本当にこの商品を削除しますか？")) return;
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const response = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/products?id=${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('削除に失敗しました');

      // 削除成功したらリストから除外
      setProducts(prev => prev.filter(p => p.id !== productId));
      setTotal(prev => prev - 1);
      alert("商品を削除しました");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return { products, total, loading, error, fetchUserProducts, deleteProduct };
};