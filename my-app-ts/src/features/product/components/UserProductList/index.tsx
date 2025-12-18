import React from 'react';
import { useUserProductList } from './useUserProductList';
import { ProductItem } from '../ProductList/ProductItem';

type Props = {
  userId: string;          // 表示したいユーザーのID
  currentUserId: string | null; // 閲覧している自分自身のID (「あなたの商品」タグ判定用)
};

export const UserProductList = ({ userId, currentUserId }: Props) => {
  const { products, loading, error } = useUserProductList(userId);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p style={{ color: 'red' }}>エラー: {error}</p>;
  
  if (products.length === 0) {
    return <p>出品している商品はありません。</p>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};