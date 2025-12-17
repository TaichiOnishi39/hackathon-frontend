import { useState } from 'react';
import { getAuth } from 'firebase/auth';

export const useProductRegister = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(''); // 入力中は文字列として扱う
  const [description, setDescription] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const registerProduct = async () => {
    setError('');

    // バリデーション
    if (!name.trim()) {
      setError("商品名を入力してください");
      return;
    }
    if (!price || Number(price) <= 0) {
      setError("正しい価格を入力してください");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      const token = await user.getIdToken();

      // ★ GoのバックエンドURL (usersと同じドメイン)
      const response = await fetch('https://hackathon-backend-80731441408.europe-west1.run.app/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name,
          price: Number(price), // Go側は int なので数値に変換
          description: description
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '商品登録に失敗しました');
      }

      // 成功時の処理
      alert("商品を登録しました！");
      // フォームをクリア
      setName('');
      setPrice('');
      setDescription('');

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    name, setName,
    price, setPrice,
    description, setDescription,
    registerProduct,
    loading,
    error
  };
};