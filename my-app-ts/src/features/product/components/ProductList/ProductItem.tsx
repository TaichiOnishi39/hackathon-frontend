import React, { useState } from 'react';
import { Product } from './useProductList';
import { Link, useNavigate } from 'react-router-dom'; // useNavigateを追加
import { getAuth } from 'firebase/auth';

type Props = {
  product: Product;
  currentUserId: string | null;
  // ★追加: 親から渡される削除・更新関数を受け取る (任意)
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: (id: string, name: string, description: string, price: number) => Promise<boolean>;
};

export const ProductItem = ({ product, currentUserId, onDelete, onUpdate }: Props) => {
  const [isLiked, setIsLiked] = useState(product.is_liked);
  const [likeCount, setLikeCount] = useState(product.like_count);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const isMyProduct = currentUserId === product.user_id;
  const isSoldOut = !!product.buyer_id;

  // いいね処理
  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUserId) {
        alert("ログインしてください");
        return;
    }
    if (isProcessing) return;

    const previousLiked = isLiked;
    const previousCount = likeCount;
    
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsProcessing(true);

    try {
        const auth = getAuth();
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : '';

        const response = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/products/${product.id}/like`, {
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
        setIsLiked(previousLiked);
        setLikeCount(previousCount);
        alert("いいねに失敗しました");
    } finally {
        setIsProcessing(false);
    }
  };

  // ★削除ボタン処理
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(product.id);
    }
  };

  // ★編集ボタン処理
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault(); // 詳細ページへの遷移を防ぐ
    e.stopPropagation();
    navigate(`/products/${product.id}/edit`);
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

      {isMyProduct && isSoldOut && (
        <div style={{ 
            backgroundColor: '#d4edda', 
            color: '#155724', 
            padding: '8px', 
            borderRadius: '4px', 
            fontSize: '13px', 
            marginBottom: '10px',
            border: '1px solid #c3e6cb'
        }}>
          <strong>🎉 購入者:</strong> {product.buyer_name} さん
        </div>
      )}

      <div style={{ borderTop: '1px solid #eee', paddingTop: '8px', fontSize: '12px', color: '#999', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>
          出品者: <Link to={`/users/${product.user_id}`} style={{ color: '#007bff', textDecoration: 'none' }}>{product.user_name}</Link><br />
          {new Date(product.created_at).toLocaleString()}
        </span>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* いいねボタン */}
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
                    color: isLiked ? '#e91e63' : '#aaa',
                    transition: 'transform 0.1s'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <span style={{ fontSize: '20px' }}>{isLiked ? '♥' : '♡'}</span>
                <span>{likeCount}</span>
            </button>

            {/* ★自分の商品の場合の操作ボタン */}
            {isMyProduct && (
                <div style={{ display: 'flex', gap: '5px' }}>
                    {/* 編集ボタン */}
                    <button
                        onClick={handleEdit}
                        style={{
                            backgroundColor: '#fff', border: '1px solid #007bff', color: '#007bff',
                            borderRadius: '4px', cursor: 'pointer', padding: '2px 8px', fontSize: '12px'
                        }}
                    >
                        編集
                    </button>
                    {/* 削除ボタン */}
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            style={{
                                backgroundColor: '#fff', border: '1px solid #dc3545', color: '#dc3545',
                                borderRadius: '4px', cursor: 'pointer', padding: '2px 8px', fontSize: '12px'
                            }}
                        >
                            削除
                        </button>
                    )}
                </div>
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