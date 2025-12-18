import React from 'react';
import { Product } from './useProductList';
import { Link } from 'react-router-dom';

type Props = {
  product: Product;
  currentUserId: string | null;
};

export const ProductItem = ({ product, currentUserId }: Props) => {
  // 自分の商品かどうか
  const isMyProduct = currentUserId === product.user_id;

  // 売り切れ判定
  const isSoldOut = !!product.buyer_id;

  return (
    <div style={cardStyle}>
      {/* ★ 画像をクリックで詳細へ */}
      <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {product.image_url && (
          <div style={{ width: '100%', height: '150px', backgroundColor: '#f9f9f9', marginBottom: '10px', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <img src={product.image_url} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', opacity: isSoldOut ? 0.6 : 1 }} />
            {/* 売り切れバッジ */}
            {isSoldOut && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>
                SOLD OUT
              </div>
            )}
          </div>
        )}
        <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{product.name}</h4>
      </Link>

      <p style={{ color: '#e91e63', fontWeight: 'bold', fontSize: '20px', margin: '0 0 8px 0' }}>
        ¥{product.price.toLocaleString()}
      </p>

      <p style={{ fontSize: '14px', color: '#555', margin: '0 0 12px 0', whiteSpace: 'pre-wrap', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
        {product.description}
      </p>

      <div style={{ borderTop: '1px solid #eee', paddingTop: '8px', fontSize: '12px', color: '#999', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>
          出品者: {product.user_name}<br />
          {new Date(product.created_at).toLocaleString()}
        </span>
        
        {/* ★編集・削除ボタンの代わりにラベルを表示 */}
        {isMyProduct && (
          <span style={{ backgroundColor: '#e9ecef', color: '#495057', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
            あなたの商品
          </span>
        )}
      </div>
    </div>
  );
};

// スタイル定義
const cardStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  position: 'relative',
};