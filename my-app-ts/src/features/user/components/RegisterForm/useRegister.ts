import { useState } from 'react';
import { getAuth } from 'firebase/auth';

export const useRegister = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  // ★エラーメッセージ用の箱を用意
  const [error, setError] = useState('');

  const registerUser = async () => {
    // 毎回リセット
    setError('');
    
    // ★フロントエンド側でのチェック (送信前に防ぐ)
    if (!name.trim()) {
      setError("名前を入力してください");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      const token = await user.getIdToken();
      
      const response = await fetch('https://hackathon-backend-80731441408.europe-west1.run.app/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        // ★バックエンドから返ってきたエラーメッセージ(400 Bad Request)を読む
        const errorText = await response.text();
        throw new Error(errorText || '登録に失敗しました');
      }

      const data = await response.json();
      alert(`登録成功！ ID: ${data.id}`);
      setName('');
      
    } catch (err: any) {
      console.error(err);
      // ★画面にエラーを表示する
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    registerUser,
    loading,
    error // ★返す
  };
};