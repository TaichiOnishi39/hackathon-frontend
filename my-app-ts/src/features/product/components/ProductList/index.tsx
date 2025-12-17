import React from 'react';
import { useProductList } from './useProductList';
import { ProductItem } from './ProductItem';
import { ProductSearchBar } from '../ProductSearchBar'; 

type Props = {
  currentUserId: string | null;
};

export const ProductList = ({ currentUserId }: Props) => {
  // ★ searchProducts を受け取る
  const { products, loading, error, deleteProduct, updateProduct, searchProducts } = useProductList();

  // ★ 検索バーから呼ばれる関数
  const handleSearch = (keyword: string) => {
    searchProducts(keyword);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* ★ ここに検索バーを配置！ */}
      <ProductSearchBar onSearch={handleSearch} />

      {loading ? (
        <p>商品を読み込み中...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>エラー: {error}</p>
      ) : products.length === 0 ? (
        <p>該当する商品はありません。</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {products.map((product) => (
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