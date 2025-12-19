import React, { useState } from 'react'; // useState追加
import { useProductList } from './useProductList';
import { ProductItem } from './ProductItem';
import { ProductSearchBar } from '../ProductSearchBar';

type Props = {
  currentUserId: string | null;
};

export const ProductList = ({ currentUserId }: Props) => {
  const { products, loading, error, searchProducts, deleteProduct, updateProduct } = useProductList();
  
  // 検索条件を保持しておく（ページネーションなどを追加するときにも便利）
  const [currentKeyword, setCurrentKeyword] = useState('');

  // 検索・ソート・絞り込み実行関数
  const handleSearch = (keyword: string, sort: string, status: string) => {
    setCurrentKeyword(keyword);
    searchProducts({ keyword, sort, status });
  };

  if (error) return <p style={{ color: 'red' }}>エラー: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      {/* 検索バーにソート・絞り込み機能も統合 */}
      <ProductSearchBar onSearch={handleSearch} />

      {loading ? (
        <p>読み込み中...</p>
      ) : products.length === 0 ? (
        <p>商品が見つかりませんでした。</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {products.map((product) => (
            <ProductItem 
              key={product.id} 
              product={product} 
              currentUserId={currentUserId}
              onDelete={deleteProduct}
              onUpdate={updateProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};