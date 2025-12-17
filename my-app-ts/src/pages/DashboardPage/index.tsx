import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { RegisterForm } from '../../features/user/components/RegisterForm';
import { ProductRegisterForm } from '../../features/product/components/ProductRegisterForm';
import { ProductList } from '../../features/product/components/ProductList';
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
        {/* ユーザー情報 */}
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
          {userName ? <h3>ようこそ、{userName} さん！</h3> : <p>ユーザー情報を読み込み中...</p>}
        </div>

        {/* 2カラムレイアウト風にする */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* 左（上）: 各種登録フォーム */}
          <section>
            <h3 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>登録・出品</h3>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <ProductRegisterForm /> {/* 商品出品 */}
              </div>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <RegisterForm /> {/* ユーザー名変更 */}
              </div>
            </div>
          </section>

          {/* 右（下）: 商品一覧 */}
          <section>
            <h3 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>商品タイムライン</h3>
            <ProductList /> {/* ★ここに一覧を表示！ */}
          </section>

        </div>
      </main>
    </div>
  );
};