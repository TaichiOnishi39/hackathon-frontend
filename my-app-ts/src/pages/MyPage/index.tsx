import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { Button } from '../../components/ui/Button';

// コンポーネント
import { UserProfile } from '../../features/user/components/UserProfile';
import { ProductRegisterForm } from '../../features/product/components/ProductRegisterForm';
import { ProductItem } from '../../features/product/components/ProductList/ProductItem';
import { useUserProfile } from '../../features/user/components/UserProfile/useUserProfile';
import { useMyPage } from './useMyPage';

export const MyPage = () => {
  const { userProfile } = useUserProfile();
  // deleteMyProduct, updateMyProduct は削除
  const { sellingProducts, purchasedProducts, likedProducts, loading } = useMyPage();

  const [activeTab, setActiveTab] = useState<'selling' | 'purchased' | 'liked'>('selling');

  const handleLogout = async () => {
    await signOut(auth);
  };

  const renderGrid = (products: any[]) => {
    if (loading) return <p>読み込み中...</p>;
    if (products.length === 0) return <p>商品はありません。</p>;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {products.map((p) => (
          <ProductItem
            key={p.id}
            product={p}
            currentUserId={userProfile?.id || null}
            // onUpdate, onDelete を削除
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h2 style={{ margin: 0 }}>My Page</h2>
          <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>&lt; ホームに戻る</Link>
        </div>
        <Button onClick={handleLogout} style={{ backgroundColor: '#666' }}>ログアウト</Button>
      </header>

      <main>
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          
          {/* 左カラム: プロフィール・出品 */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <UserProfile />
            <div style={{ marginTop: '20px' }}>
              <ProductRegisterForm />
            </div>
          </div>

          {/* 右カラム: 履歴タブ */}
          <div style={{ flex: 2, minWidth: '300px' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
              <TabButton label={`出品 (${sellingProducts.length})`} active={activeTab === 'selling'} onClick={() => setActiveTab('selling')} />
              <TabButton label={`購入 (${purchasedProducts.length})`} active={activeTab === 'purchased'} onClick={() => setActiveTab('purchased')} />
              <TabButton label={`いいね (${likedProducts.length})`} active={activeTab === 'liked'} onClick={() => setActiveTab('liked')} />
            </div>

            <div>
              {activeTab === 'selling' && renderGrid(sellingProducts)}
              {activeTab === 'purchased' && renderGrid(purchasedProducts)}
              {activeTab === 'liked' && renderGrid(likedProducts)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const TabButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      padding: '10px 20px',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
      borderBottom: active ? '3px solid #e91e63' : '3px solid transparent',
      fontWeight: active ? 'bold' : 'normal',
      color: active ? '#e91e63' : '#666',
      fontSize: '16px'
    }}
  >
    {label}
  </button>
);