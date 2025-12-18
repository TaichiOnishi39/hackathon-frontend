import React from 'react';
import { useProductList } from './useProductList';
import { ProductItem } from './ProductItem';
import { ProductSearchBar } from '../ProductSearchBar'; 
import { MessageListButton } from '../../../chat/components/MessageListButton';

type Props = {
  currentUserId: string | null;
};

export const ProductList = ({ currentUserId }: Props) => {
  // deleteProduct, updateProduct はここでは使わなくなりました
  const { products, loading, error, searchProducts } = useProductList();

  const handleSearch = (keyword: string) => {
    searchProducts(keyword);
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <MessageListButton />
      </div>
      
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
              // onUpdate, onDelete を削除
            />
          ))}
        </div>
      )}
    </div>
  );
};