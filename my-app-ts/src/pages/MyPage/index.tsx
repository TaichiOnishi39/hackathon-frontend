import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../../features/user/components/UserProfile';
import { ProductItem } from '../../features/product/components/ProductList/ProductItem';
import { useUserProfile } from '../../features/user/components/UserProfile/useUserProfile';
import { useMyPage } from './useMyPage';
import { useSettings } from '../../contexts/SettingsContext';
import { UserProductList } from '../../features/product/components/UserProductList';

export const MyPage = () => {
  const { userProfile } = useUserProfile();
  const { purchasedProducts, likedProducts, loading } = useMyPage();
  const [activeTab, setActiveTab] = useState<'selling' | 'purchased' | 'liked'>('selling');
  
  const { settings } = useSettings();

  // ★追加: 出品数を管理するState
  const [sellingTotal, setSellingTotal] = useState(0);

  const renderGrid = (products: any[]) => {
    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>読み込み中...</div>;
    
    if (products.length === 0) {
      return (
        <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px', color: '#888' }}>
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>商品はまだありません 📦</p>
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {products.map((p) => (
          <ProductItem
            key={p.id}
            product={p}
            currentUserId={userProfile?.id || null}
            showDescription={settings.showDescription}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px 20px 60px' }}>
      
      <header style={{ marginBottom: '30px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: '#666', marginBottom: '10px', fontSize: '14px' }}>
          <span>&lt;</span> ホームに戻る
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>マイページ</h2>
          <Link to="/settings" style={{ textDecoration: 'none' }}>
            <button style={{ 
              padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', backgroundColor: '#fff',
              cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              ⚙️ 設定
            </button>
          </Link>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        <aside style={{ flex: '1 1 280px', maxWidth: '100%', position: 'sticky', top: '20px' }}>
          <UserProfile />
        </aside>

        <main style={{ flex: '999 1 300px', minWidth: '0' }}>
          
          <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '24px', backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
            {/* ★修正: countにsellingTotalを渡し、hideCountを削除 */}
            <TabButton 
              label="出品した商品" 
              count={sellingTotal} 
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

          <div>
          <div style={{ display: activeTab === 'selling' ? 'block' : 'none' }}>
               <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#444' }}>出品中・売却済みの商品</h3>
               {userProfile?.id ? (
                 <UserProductList 
                   userId={userProfile.id} 
                   currentUserId={userProfile.id} 
                   onTotalChange={setSellingTotal} 
                 />
               ) : (
                 <p>読み込み中...</p>
               )}
            </div>
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

// タブボタン (変更なし)
const TabButton = ({ label, count, active, onClick, hideCount = false }: { label: string, count: number, active: boolean, onClick: () => void, hideCount?: boolean }) => (
  <button
    onClick={onClick}
    style={{
      padding: '12px 16px', cursor: 'pointer', border: 'none', backgroundColor: 'transparent',
      borderBottom: active ? '3px solid #007bff' : '3px solid transparent',
      fontWeight: active ? 'bold' : '500', color: active ? '#007bff' : '#666',
      fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px',
      transition: 'all 0.2s', whiteSpace: 'nowrap'
    }}
  >
    {label}
    {!hideCount && count > 0 && (
      <span style={{ 
        backgroundColor: active ? '#007bff' : '#eee', color: active ? '#fff' : '#666', 
        fontSize: '11px', padding: '2px 6px', borderRadius: '10px', minWidth: '16px', textAlign: 'center'
      }}>
        {count}
      </span>
    )}
  </button>
);