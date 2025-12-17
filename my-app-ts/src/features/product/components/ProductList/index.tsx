import React from 'react';
import { useProductList } from './useProductList';

export const ProductList = () => {
  const { products, loading, error } = useProductList();

  if (loading) return <p>商品を読み込み中...</p>;
  if (error) return <p style={{ color: 'red' }}>エラー: {error}</p>;

  return (
    <div style={{ width: '100%' }}>
      <h3>新着商品一覧</h3>
      
      {products.length === 0 ? (
        <p>現在、出品されている商品はありません。</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {products.map((product) => (
            <div 
              key={product.id} 
              style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '16px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {/* 商品名 */}
              <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{product.name}</h4>
              
              {/* 価格 */}
              <p style={{ 
                color: '#e91e63', 
                fontWeight: 'bold', 
                fontSize: '20px', 
                margin: '0 0 8px 0' 
              }}>
                ¥{product.price.toLocaleString()}
              </p>
              
              {/* 説明文 */}
              <p style={{ 
                fontSize: '14px', 
                color: '#555', 
                margin: '0 0 12px 0',
                whiteSpace: 'pre-wrap' // 改行を反映
              }}>
                {product.description}
              </p>
              
              {/* フッター情報 */}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '8px', fontSize: '12px', color: '#999' }}>
                出品者: {product.user_name}<br/>
                {new Date(product.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};