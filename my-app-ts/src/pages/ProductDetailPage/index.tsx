import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProductDetail } from './useProductDetail';
import { Button } from '../../components/ui/Button';
import { useUserProfile } from '../../features/user/components/UserProfile/useUserProfile';
import { getAuth } from 'firebase/auth';

export const ProductDetailPage = () => {
  const { product, loading, error, purchaseProduct, isLiked: hookIsLiked } = useProductDetail();
  const { userProfile } = useUserProfile();
  const navigate = useNavigate();

  // 即時反映用のいいねState
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (product) {
      setLikeCount(product.like_count);
    }
  }, [product]);

  useEffect(() => {
    setIsLiked(hookIsLiked);
  }, [hookIsLiked]);

  const handleToggleLike = async () => {
    const auth = getAuth();
    if (!auth.currentUser) {
      alert("ログインしてください");
      return;
    }
    if (!product) return;

    const prevLiked = isLiked;
    const prevCount = likeCount;

    setIsLiked(!prevLiked);
    setLikeCount(prev => prevLiked ? prev - 1 : prev + 1);

    try {
      const token = await auth.currentUser.getIdToken();
      await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/products/${product.id}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  const handleChat = () => {
    if (!product) return;
    navigate(`/chat/${product.user_id}?productId=${product.id}`);
  };

  // ★編集ページへ遷移
  const handleEditClick = () => {
    if (product) {
      navigate(`/products/${product.id}/edit`);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>読み込み中...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>エラー: {error}</div>;
  if (!product) return <div style={{ padding: '20px' }}>商品が見つかりません</div>;

  const isSoldOut = !!product.buyer_id;
  const isMyProduct = userProfile && userProfile.id === product.user_id;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#666', textDecoration: 'none' }}>
        &lt; 戻る
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>{product.name}</h1>
              
              {!isMyProduct ? (
                <button 
                  onClick={handleToggleLike}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    color: isLiked ? '#e91e63' : '#ccc',
                  }}
                >
                  <span style={{ fontSize: '32px', lineHeight: 1 }}>{isLiked ? '♥' : '♡'}</span>
                  <span style={{ fontSize: '12px', color: '#555', fontWeight: 'bold' }}>{likeCount}</span>
                </button>
              ) : (
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#e91e63' }}>
                    <span style={{ fontSize: '24px' }}>♥</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{likeCount}</span>
                 </div>
              )}
            </div>

            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              出品者: <Link to={`/users/${product.user_id}`} style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>{product.user_name}</Link> / {new Date(product.created_at).toLocaleString()}
            </p>
            
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#e91e63', margin: '0 0 30px 0' }}>
              ¥{product.price.toLocaleString()}
            </p>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>商品説明</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{product.description}</p>
            </div>

            <div style={{ marginTop: '30px' }}>
              {isMyProduct ? (
                // ★自分の商品の場合は「編集ページへ移動」ボタンのみ表示
                <Button 
                  onClick={handleEditClick} 
                  style={{ width: '100%', padding: '15px', backgroundColor: '#ffc107', color: '#000', fontSize: '18px' }}
                >
                  商品を編集・削除する ⚙️
                </Button>
              ) : (
                <>
                  {isSoldOut ? (
                    <Button disabled style={{ width: '100%', padding: '15px', backgroundColor: '#ccc', fontSize: '18px' }}>
                      売り切れ 🚫
                    </Button>
                  ) : (
                    <Button 
                      onClick={purchaseProduct} 
                      style={{ width: '100%', padding: '15px', backgroundColor: '#e91e63', fontSize: '18px' }}
                    >
                      購入する 🛒
                    </Button>
                  )}
                  <div style={{ marginTop: '10px' }}>
                    <Button 
                      onClick={handleChat}
                      style={{ width: '100%', padding: '15px', backgroundColor: '#fff', color: '#0084ff', border: '1px solid #0084ff', fontSize: '18px' }}
                    >
                      出品者に質問する 💬
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};