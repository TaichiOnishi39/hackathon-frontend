import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { RegisterForm } from '../../features/user/components/RegisterForm';
import { ProductRegisterForm } from '../../features/product/components/ProductRegisterForm';
import { Button } from '../../components/ui/Button';

// ★ インターフェース (Goから返ってくるJSONの型定義)
interface UserData {
  id: string; // ULID
  name: string;
  firebase_uid: string;
}

export const DashboardPage = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // エラー表示用

  // ★ 画面が表示されたらデータを取ってくる処理
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        
        // 1. Goで作ったAPIを叩く
        const res = await fetch('https://hackathon-backend-80731441408.europe-west1.run.app/users/me', {
          method: 'GET',
          headers: {
            // トークンをヘッダーに含める
            'Authorization': `Bearer ${token}` 
          }
        });

        if (res.ok) {
          // 2. 成功したらJSONを解析し、名前をセット
          const data: UserData = await res.json();
          setUserName(data.name); 
        } else if (res.status === 404) {
          // 3. ユーザーがDBにまだ登録されていない場合
          setUserName(null); 
        } else {
          // 4. その他のAPIエラー (500など)
          const errorText = await res.text();
          setError(`データの取得に失敗しました: ${errorText}`);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("ネットワークエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // 依存配列が空なので、マウント時(画面表示時)に1回だけ実行される

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* ... ヘッダーとログアウトボタン ... */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Dashboard</h2>
        <Button onClick={handleLogout} style={{ backgroundColor: '#666' }}>
          ログアウト
        </Button>
      </header>

      <main>
        {/* 名前表示エリア */}
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
          {loading ? (
            <p>データを読み込み中...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>エラー: {error}</p>
          ) : userName ? (
            // 登録済みの名前を表示
            <h3>ようこそ、{userName} さん！</h3>
          ) : (
            // 未登録の場合のメッセージ
            <p>まだプロフィール登録がありません。以下から登録してください。</p>
          )}
        </div>

        <hr />
        
        {/* ユーザー登録フォーム */}
        <div style={{ marginBottom: '40px' }}>
          <p>ユーザー情報の変更</p>
          <RegisterForm />
        </div>

        {/*  商品出品フォーム */}
        <div style={{ marginBottom: '40px' }}>
          <ProductRegisterForm />
        </div>
      </main>
    </div>
  );
};