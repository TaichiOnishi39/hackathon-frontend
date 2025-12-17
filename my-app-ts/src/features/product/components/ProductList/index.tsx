import React from 'react';
import { useProductList } from './useProductList';
import { ProductItem } from './ProductItem'; // ★作った部品をインポート

type Props = {
  currentUserId: string | null;
};

export const ProductList = ({ currentUserId }: Props) => {
  // ロジックはカスタムフックに任せる
  const { products, loading, error, deleteProduct, updateProduct } = useProductList();

  if (loading) return <p>商品を読み込み中...</p>;
  if (error) return <p style={{ color: 'red' }}>エラー: {error}</p>;

  return (
    <div style={{ width: '100%' }}>
      {products.length === 0 ? (
        <p>現在、出品されている商品はありません。</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {products.map((product) => (
            // ★ mapの中身はこれだけ！ 詳細は ProductItem に丸投げ
            <ProductItem
              key={product.id}
              product={product}
              currentUserId={currentUserId}
              onUpdate={updateProduct}
              onDelete={deleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};