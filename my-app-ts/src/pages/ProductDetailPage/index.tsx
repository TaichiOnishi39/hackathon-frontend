import React from 'react';
import { Link } from 'react-router-dom';
import { useProductDetail } from './useProductDetail';
import { Button } from '../../components/ui/Button';

export const ProductDetailPage = () => {
  const { product, loading, error, purchaseProduct } = useProductDetail();

  if (loading) return <div style={{ padding: '20px' }}>読み込み中...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>エラー: {error}</div>;
  if (!product) return <div style={{ padding: '20px' }}>商品が見つかりません</div>;

  // 売り切れ判定
  const isSoldOut = !!product.buyer_id;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* 戻るリンク */}
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#666', textDecoration: 'none' }}>
        &lt; ダッシュボードに戻る
      </Link>

      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          
          {/* 画像エリア */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ color: '#ccc' }}>NO IMAGE</span>
              )}
            </div>
          </div>

          {/* 情報エリア */}
          <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>{product.name}</h1>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              出品者: {product.user_name} / {new Date(product.created_at).toLocaleString()}
            </p>
            
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#e91e63', margin: '0 0 30px 0' }}>
              ¥{product.price.toLocaleString()}
            </p>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>商品説明</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{product.description}</p>
            </div>

            {/* 購入ボタン */}
            <div style={{ marginTop: '30px' }}>
              {isSoldOut ? (
                <Button disabled style={{ width: '100%', padding: '15px', backgroundColor: '#ccc', fontSize: '18px' }}>
                  売り切れ 🚫
                </Button>
              ) : (
                <Button 
                  onClick={purchaseProduct} 
                  style={{ width: '100%', padding: '15px', backgroundColor: '#e91e63', fontSize: '18px', boxShadow: '0 4px 0 #c2185b' }}
                >
                  購入する 🛒
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};