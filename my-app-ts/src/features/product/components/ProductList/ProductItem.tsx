import React, { useState } from 'react';
import { Product } from './useProductList';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

type Props = {
  product: Product;
  currentUserId: string | null;
};

export const ProductItem = ({ product, currentUserId }: Props) => {
  // ★ローカルstateで「見た目」を即座に更新する
  const [isLiked, setIsLiked] = useState(product.is_liked);
  const [likeCount, setLikeCount] = useState(product.like_count);
  const [isProcessing, setIsProcessing] = useState(false);

  const isMyProduct = currentUserId === product.user_id;
  const isSoldOut = !!product.buyer_id;

  // ★いいねボタンを押した時の処理
  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // リンク遷移を防ぐ
    e.stopPropagation();

    if (!currentUserId) {
        alert("ログインしてください");
        return;
    }
    if (isProcessing) return; // 連打防止

    // 1. 先に見た目を変える（サクサク動くように見せる）
    const previousLiked = isLiked;
    const previousCount = likeCount;
    
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsProcessing(true);

    try {
        // 2. サーバーに送信
        const auth = getAuth();
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : '';

        const response = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/products/like?id=${product.id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed');
        }
    } catch (err) {
        console.error(err);
        // 失敗したら元に戻す
        setIsLiked(previousLiked);
        setLikeCount(previousCount);
        alert("いいねに失敗しました");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div style={cardStyle}>
      <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {product.image_url && (
          <div style={{ width: '100%', height: '150px', backgroundColor: '#f9f9f9', marginBottom: '10px', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <img src={product.image_url} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', opacity: isSoldOut ? 0.6 : 1 }} />
            {isSoldOut && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>SOLD OUT</div>
            )}
          </div>
        )}
        <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{product.name}</h4>
      </Link>

      <p style={{ color: '#e91e63', fontWeight: 'bold', fontSize: '20px', margin: '0 0 8px 0' }}>
        ¥{product.price.toLocaleString()}
      </p>

      <div style={{ borderTop: '1px solid #eee', paddingTop: '8px', fontSize: '12px', color: '#999', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>
          出品者: {product.user_name}<br />
          {new Date(product.created_at).toLocaleString()}
        </span>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* ★クリックできるいいねボタンに変更 */}
            <button 
                onClick={handleToggleLike}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '16px',
                    color: isLiked ? '#e91e63' : '#aaa', // いいね済みならピンク
                    transition: 'transform 0.1s'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <span style={{ fontSize: '20px' }}>{isLiked ? '♥' : '♡'}</span>
                <span>{likeCount}</span>
            </button>

            {isMyProduct && (
                <span style={{ backgroundColor: '#e9ecef', color: '#495057', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>あなた</span>
            )}
        </div>
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  position: 'relative',
};