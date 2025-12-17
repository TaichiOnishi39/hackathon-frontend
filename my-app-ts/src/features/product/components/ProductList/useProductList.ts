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

  // 商品取得
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

  // 商品削除ロジック
  const deleteProduct = async (productId: string) => {
    if (!window.confirm("本当にこの商品を削除しますか？")) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const response = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/products?id=${productId}`, {
        method: 'DELETE', // DELETEメソッド
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('削除に失敗しました');
      }

      // 成功したら、今のstateからその商品を消す（リロードしなくて済むのでサクサク動く）
      setProducts(prev => prev.filter(p => p.id !== productId));
      alert("商品を削除しました");

    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // 商品更新ロジック
  const updateProduct = async (id: string, name: string, description: string, price: number) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return false;
      const token = await user.getIdToken();

      const response = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/products?id=${id}`, {
        method: 'PUT', // PUTメソッド
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          price
        }),
      });

      if (!response.ok) {
        throw new Error('更新に失敗しました');
      }

      // 成功したら、一覧データ(products)の中身も書き換える
      setProducts(prev => prev.map(p => {
        if (p.id === id) {
          // 更新された新しい情報で上書き
          return { ...p, name, description, price };
        }
        return p;
      }));
      
      alert("商品を更新しました");
      return true; // 成功したことを呼び出し元に伝える

    } catch (err: any) {
      console.error(err);
      alert(err.message);
      return false;
    }
  };

  // 画面が表示されたときに1回だけ実行
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading, 
    error, 
    reload: fetchProducts,
    deleteProduct,
    updateProduct
 };
};