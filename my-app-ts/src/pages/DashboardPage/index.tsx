import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { Button } from '../../components/ui/Button';

// 商品リストのみ使う
import { ProductList } from '../../features/product/components/ProductList';
import { useUserProfile } from '../../features/user/components/UserProfile/useUserProfile';

export const DashboardPage = () => {
  const { userProfile } = useUserProfile();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0 }}>フリフリ</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/sell">
                <Button style={{ backgroundColor: '#e91e63' }}>出品する 📷</Button>
            </Link>
            
            <Link to="/mypage">
                <Button style={{ backgroundColor: '#28a745' }}>マイページ 👤</Button>
            </Link>
            <Button onClick={handleLogout} style={{ backgroundColor: '#666' }}>ログアウト</Button>
        </div>
      </header>

      <main>
        {/* 全商品リスト (ProductList内でメッセージボタンなども管理) */}
        <ProductList currentUserId={userProfile?.id || null} />
      </main>
    </div>
  );
};