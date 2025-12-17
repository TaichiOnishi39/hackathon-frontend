import React from 'react';
import { useProductList } from './useProductList';
import { Button } from '../../../../components/ui/Button';

// ★ Propsの型定義
type Props = {
  currentUserId: string | null; // 親から自分のIDをもらう
};

export const ProductList = ({ currentUserId }: Props) => {
  const { products, loading, error, deleteProduct } = useProductList();

  if (loading) return <p>商品を読み込み中...</p>;
  if (error) return <p style={{ color: 'red' }}>エラー: {error}</p>;

  return (
    <div style={{ width: '100%' }}>
      {products.length === 0 ? (
        <p>現在、出品されている商品はありません。</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {products.map((product) => {
            // ★ 自分の商品かどうか判定
            const isMyProduct = currentUserId === product.user_id;

            return (
              <div 
                key={product.id} 
                style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '16px',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  position: 'relative' // ボタン配置用
                }}
              >
                <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{product.name}</h4>
                <p style={{ color: '#e91e63', fontWeight: 'bold', fontSize: '20px', margin: '0 0 8px 0' }}>
                  ¥{product.price.toLocaleString()}
                </p>
                <p style={{ fontSize: '14px', color: '#555', margin: '0 0 12px 0', whiteSpace: 'pre-wrap' }}>
                  {product.description}
                </p>
                
                <div style={{ borderTop: '1px solid #eee', paddingTop: '8px', fontSize: '12px', color: '#999' }}>
                  出品者: {product.user_name}<br/>
                  {new Date(product.created_at).toLocaleString()}
                </div>

                {/* ★ 自分の商品なら削除ボタンを表示 */}
                {isMyProduct && (
                  <div style={{ marginTop: '10px', textAlign: 'right' }}>
                    <Button 
                      onClick={() => deleteProduct(product.id)}
                      style={{ 
                        backgroundColor: '#dc3545', // 赤色
                        fontSize: '12px',
                        padding: '4px 8px'
                      }}
                    >
                      削除
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};