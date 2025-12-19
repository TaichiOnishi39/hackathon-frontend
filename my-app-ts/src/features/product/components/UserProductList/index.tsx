import React, { useEffect, useState } from 'react'; // useState追加
import { useUserProductList } from './useUserProductList';
import { ProductItem } from '../ProductList/ProductItem'; // 共通のItemを使う
import { ProductSearchBar } from '../ProductSearchBar';   // ★追加

type Props = {
  userId: string;
  currentUserId: string | null;
};

export const UserProductList = ({ userId, currentUserId }: Props) => {
  const { products, loading, fetchUserProducts } = useUserProductList();
  
  // 初期ロード & 検索実行
  const handleSearch = (keyword: string, sort: string, status: string) => {
    // ユーザーページではキーワード検索は不要なら無視してもOKですが、あると便利です
    fetchUserProducts(userId, { keyword, sort, status });
  };

  // 初回ロード (デフォルト条件)
  useEffect(() => {
    fetchUserProducts(userId, { sort: 'newest', status: 'all' });
  }, [userId]);

  return (
    <div>
      {/* ★検索バーを追加 */}
      <ProductSearchBar onSearch={handleSearch} />

      {loading ? (
        <p>読み込み中...</p>
      ) : products.length === 0 ? (
        <p>出品商品はありません。</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {products.map(product => (
            <ProductItem 
              key={product.id} 
              product={product} 
              currentUserId={currentUserId} 
            />
          ))}
        </div>
      )}
    </div>
  );
};