import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

// 商品データの型（buyer_idを追加）
export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  description: string;
  user_id: string;
  user_name: string;
  image_url: string;
  buyer_id: string; // 売れていればIDが入る
  created_at: string;
}

export const useProductDetail = () => {
  const { id } = useParams<{ id: string }>(); // URLからIDを取得
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. 商品詳細を取得
  const fetchProduct = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/products/${id}`);
      if (!res.ok) throw new Error('商品が見つかりませんでした');
      const data = await res.json();
      setProduct(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. 購入処理
  const purchaseProduct = async () => {
    if (!id || !product) return;
    if (!window.confirm(`「${product.name}」を購入しますか？`)) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert("ログインしてください");
        return;
      }
      const token = await user.getIdToken();

      const res = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/products/${id}/purchase`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      alert("購入しました！🎉");
      // 画面をリロードして「売り切れ」表示にする
      fetchProduct();

    } catch (err: any) {
      console.error(err);
      alert("購入に失敗しました: " + err.message);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  return { product, loading, error, purchaseProduct };
};