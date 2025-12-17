import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { Button } from '../../components/ui/Button';

// 機能ごとのコンポーネントをインポート
import { UserProfile } from '../../features/user/components/UserProfile';         // ★今回作成
import { RegisterForm } from '../../features/user/components/RegisterForm';
import { ProductRegisterForm } from '../../features/product/components/ProductRegisterForm';
import { ProductList } from '../../features/product/components/ProductList';

// useUserProfileフックをインポート (自分のIDを取得するため)
import { useUserProfile } from '../../features/user/components/UserProfile/useUserProfile';

export const DashboardPage = () => {
  // ★ ここで自分の情報を取得
  const { userProfile } = useUserProfile();
  // ログアウト処理だけはこのページに残してもOK（あるいはHeaderコンポーネントに移動など）
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Dashboard</h2>
        <Button onClick={handleLogout} style={{ backgroundColor: '#666' }}>
          ログアウト
        </Button>
      </header>

      <main>
        {/* ★ここにポンと置くだけ！ */}
        <UserProfile />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* 左（上）: 各種登録フォーム */}
          <section>
            <h3 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>登録・出品</h3>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <ProductRegisterForm />
              </div>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <RegisterForm />
              </div>
            </div>
          </section>

          {/* 右（下）: 商品一覧 */}
          <section>
            <h3 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>商品タイムライン</h3>
            {/* 取得した自分のID (userProfile.id) を渡す */}
            <ProductList currentUserId={userProfile?.id || null} />
          </section>
        </div>
      </main>
    </div>
  );
};