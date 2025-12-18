import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export interface ProductDetail {
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

export const useProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);

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
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      alert("購入しました！🎉");
      fetchProduct();

    } catch (err: any) {
      console.error(err);
      alert("購入に失敗しました: " + err.message);
    }
  };

  // 3. ★追加: 商品削除処理
  const deleteProduct = async () => {
    if (!id) return false;
    if (!window.confirm("本当にこの商品を削除しますか？（取り消せません）")) return false;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return false;
      const token = await user.getIdToken();

      const res = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/products?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("削除に失敗しました");
      
      alert("商品を削除しました");
      return true; // 成功

    } catch (err: any) {
      alert(err.message);
      return false;
    }
  };

  // 4. ★追加: 商品更新処理
  const updateProduct = async (name: string, description: string, price: number) => {
    if (!id) return false;
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return false;
      const token = await user.getIdToken();

      const res = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/products?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, price }),
      });

      if (!res.ok) throw new Error("更新に失敗しました");

      // 成功したらローカルのstateも更新
      setProduct(prev => prev ? { ...prev, name, description, price } : null);
      alert("更新しました");
      return true;

    } catch (err: any) {
      alert(err.message);
      return false;
    }
  };

  // いいね機能
  const fetchLikeStatus = async (user: any) => {
    if (!id || !user) return; 
    try {
      const token = await user.getIdToken();
      const res = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/products/${id}/like`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.liked);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = async () => {
    if (!id) return;
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert("ログインしてください");
        return;
      }
      const token = await user.getIdToken();

      const res = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/products/${id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.liked);
      } else {
        alert("いいねの変更に失敗しました");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProduct();
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) fetchLikeStatus(user);
      else setIsLiked(false);
    });
    return () => unsubscribe();
  }, [id]);

  return { 
    product, loading, error, 
    purchaseProduct, 
    isLiked, toggleLike,
    deleteProduct, updateProduct // ★追加
  };
};