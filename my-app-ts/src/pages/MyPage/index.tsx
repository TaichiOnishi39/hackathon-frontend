import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../../features/user/components/UserProfile';
import { ProductItem } from '../../features/product/components/ProductList/ProductItem';
import { useUserProfile } from '../../features/user/components/UserProfile/useUserProfile';
import { useMyPage } from './useMyPage';

export const MyPage = () => {
  const { userProfile } = useUserProfile();
  const { sellingProducts, purchasedProducts, likedProducts, loading } = useMyPage();
  const [activeTab, setActiveTab] = useState<'selling' | 'purchased' | 'liked'>('selling');

  // 商品グリッド表示用関数
  const renderGrid = (products: any[]) => {
    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>読み込み中...</div>;
    
    if (products.length === 0) {
      return (
        <div style={{ 
          padding: '60px 20px', 
          textAlign: 'center', 
          backgroundColor: '#f9f9f9', 
          borderRadius: '8px', 
          color: '#888' 
        }}>
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>商品はまだありません 📦</p>
        </div>
      );
    }

    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
        gap: '20px' 
      }}>
        {products.map((p) => (
          <ProductItem
            key={p.id}
            product={p}
            currentUserId={userProfile?.id || null}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px 20px 60px' }}>
      
      {/* ヘッダーエリア */}
      <header style={{ marginBottom: '30px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: '#666', marginBottom: '10px', fontSize: '14px' }}>
          <span>&lt;</span> ホームに戻る
        </Link>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>マイページ</h2>
      </header>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* 左カラム: プロフィール (スマホでは上に、PCでは左固定幅に) */}
        <aside style={{ flex: '1 1 280px', maxWidth: '100%', position: 'sticky', top: '20px' }}>
          <UserProfile />
        </aside>

        {/* 右カラム: 履歴タブと一覧 */}
        <main style={{ flex: '999 1 300px', minWidth: '0' }}> {/* minWidth:0 はGridのはみ出し防止 */}
          
          {/* タブメニュー */}
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #eee', 
            marginBottom: '24px',
            backgroundColor: '#fff',
            position: 'sticky', // スクロールしてもタブが見えるように
            top: 0,
            zIndex: 10
          }}>
            <TabButton 
              label="出品した商品" 
              count={sellingProducts.length} 
              active={activeTab === 'selling'} 
              onClick={() => setActiveTab('selling')} 
            />
            <TabButton 
              label="購入した商品" 
              count={purchasedProducts.length} 
              active={activeTab === 'purchased'} 
              onClick={() => setActiveTab('purchased')} 
            />
            <TabButton 
              label="いいね" 
              count={likedProducts.length} 
              active={activeTab === 'liked'} 
              onClick={() => setActiveTab('liked')} 
            />
          </div>

          {/* コンテンツエリア */}
          <div>
            {activeTab === 'selling' && (
               <div>
                  <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#444' }}>出品中・売却済みの商品</h3>
                  {renderGrid(sellingProducts)}
               </div>
            )}
            {activeTab === 'purchased' && (
                <div>
                   <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#444' }}>購入履歴</h3>
                   {renderGrid(purchasedProducts)}
                </div>
            )}
            {activeTab === 'liked' && (
                <div>
                   <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#444' }}>いいねした商品</h3>
                   {renderGrid(likedProducts)}
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// タブボタンコンポーネント (件数バッジ付き)
const TabButton = ({ label, count, active, onClick }: { label: string, count: number, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      padding: '12px 16px',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
      borderBottom: active ? '3px solid #007bff' : '3px solid transparent',
      fontWeight: active ? 'bold' : '500',
      color: active ? '#007bff' : '#666',
      fontSize: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap'
    }}
  >
    {label}
    {count > 0 && (
      <span style={{ 
        backgroundColor: active ? '#007bff' : '#eee', 
        color: active ? '#fff' : '#666', 
        fontSize: '11px', 
        padding: '2px 6px', 
        borderRadius: '10px',
        minWidth: '16px',
        textAlign: 'center'
      }}>
        {count}
      </span>
    )}
  </button>
);