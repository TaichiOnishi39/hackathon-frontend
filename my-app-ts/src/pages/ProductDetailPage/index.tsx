import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProductDetail } from './useProductDetail';
import { useUserProfile } from '../../features/user/components/UserProfile/useUserProfile';
import { Button } from '../../components/ui/Button';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // useProductDetailから必要な関数などを取得
  const { 
    product, loading, error, 
    deleteProduct, purchaseProduct, toggleLike, isLiked: remoteIsLiked 
  } = useProductDetail();
  
  const { userProfile } = useUserProfile();

  const [isProcessing, setIsProcessing] = useState(false);
  
  // いいねの即時反映用State
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // データ読み込み時にStateを更新
  useEffect(() => {
    if (product) {
      setLikeCount(product.like_count);
    }
  }, [product]);

  useEffect(() => {
    setIsLiked(remoteIsLiked);
  }, [remoteIsLiked]);

  // いいねボタンのハンドラ
  const handleToggleLike = () => {
    if (!userProfile) {
      toast.error("ログインしてください");
      return;
    }
    // 楽観的UI更新（API完了を待たずに見た目を変える）
    const prevLiked = isLiked;
    setIsLiked(!isLiked);
    setLikeCount(prev => !prevLiked ? prev + 1 : prev - 1);
    
    // API呼び出し
    toggleLike().catch(() => {
      // 失敗したら戻す
      setIsLiked(prevLiked);
      setLikeCount(prev => prevLiked ? prev + 1 : prev - 1);
    });
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>読み込み中...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>エラー: {error}</div>;
  if (!product) return <div style={{ padding: '40px', textAlign: 'center' }}>商品が見つかりません</div>;

  const isMyProduct = userProfile?.id === product.user_id;
  const isSoldOut = !!product.buyer_id;

  const handleDelete = async () => {
    if (window.confirm('本当にこの商品を削除しますか？\n（この操作は取り消せません）')) {
      setIsProcessing(true);
      const success = await deleteProduct();
      if (success) {
        navigate('/');
      } else {
        setIsProcessing(false);
      }
    }
  };

  const handleChat = () => {
    if (!userProfile) {
      toast.error("ログインしてください");
      return;
    }
    navigate(`/chat/${product.user_id}?product_id=${product.id}`);
  };

  // アイコン表示用ヘルパー
  const renderUserIcon = (imageUrl: string, name: string, size: number) => {
    if (imageUrl) {
      return (
        <img 
          src={imageUrl} 
          alt={name} 
          style={{ 
            width: `${size}px`, height: `${size}px`, borderRadius: '50%', objectFit: 'cover', 
            border: '1px solid #eee', flexShrink: 0 
          }}
        />
      );
    }
    return (
      <div style={{ 
        width: `${size}px`, height: `${size}px`, borderRadius: '50%', backgroundColor: '#eee', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        fontSize: `${size/2.5}px`, color: '#999', fontWeight: 'bold', flexShrink: 0
      }}>
        {name ? name.charAt(0) : '?'}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 20px 80px' }}>
      <div style={{ marginBottom: '20px' }}>
        {/* ★修正: LinkからonClickでnavigate(-1)するボタンに変更 */}
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '5px', 
            textDecoration: 'none', 
            color: '#666', 
            fontWeight: '500',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontSize: '16px',
            fontFamily: 'inherit'
          }}
        >
          <span>&lt;</span> 戻る
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        {/* 商品画像エリア */}
        <div style={{ width: '100%', backgroundColor: '#f9f9f9', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: '300px', maxHeight: '500px' }}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', display: 'block' }} />
          ) : (
            <div style={{ color: '#ccc', fontSize: '20px' }}>No Image</div>
          )}
          {isSoldOut && (
            <div style={{ position: 'absolute', top: '20px', left: '0', backgroundColor: '#e91e63', color: '#fff', padding: '8px 40px', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', transform: 'rotate(-45deg) translate(-20px, -20px)', zIndex: 10 }}>
              SOLD OUT
            </div>
          )}
        </div>

        {/* 詳細情報エリア */}
        <div style={{ padding: '30px' }}>
          
          {/* タイトルと価格 */}
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '24px' }}>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#333', lineHeight: '1.4' }}>{product.name}</h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#e91e63' }}>¥{product.price.toLocaleString()}</span>
              <span style={{ fontSize: '14px', color: '#999' }}>(税込)</span>
            </div>
          </div>

          {/* メタ情報（いいね・日時） */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', color: '#666', fontSize: '14px', alignItems: 'center' }}>
            <button 
              onClick={handleToggleLike}
              style={{ 
                background: 'none', border: 'none', cursor: 'pointer', 
                display: 'flex', alignItems: 'center', gap: '6px', 
                fontSize: '14px', color: '#666', padding: 0
              }}
            >
              <span style={{ fontSize: '24px', color: isLiked ? '#e91e63' : '#ccc', transition: 'transform 0.1s' }}>♥</span>
              <span style={{ fontWeight: 'bold' }}>いいね! {likeCount}</span>
            </button>

            <div style={{ width: '1px', height: '20px', backgroundColor: '#eee' }}></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🕒</span>
              <span>{new Date(product.created_at).toLocaleDateString()} に出品</span>
            </div>
          </div>

          {/* 購入者情報 */}
          {isMyProduct && isSoldOut && (
            <div style={{ marginBottom: '30px', padding: '16px', backgroundColor: '#e8f5e9', borderRadius: '8px', border: '1px solid #c8e6c9', color: '#2e7d32' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>🎉</span>
                <span style={{ fontWeight: 'bold' }}>この商品は購入されました！</span>
              </div>
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {renderUserIcon(product.buyer_image_url, product.buyer_name, 32)}
                <span>購入者: <strong>{product.buyer_name}</strong> さん</span>
              </div>
            </div>
          )}

          {/* 商品説明 */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#444' }}>商品の説明</h3>
            <div style={{ lineHeight: '1.8', color: '#555', whiteSpace: 'pre-wrap', fontSize: '16px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
              {product.description || '(商品説明はありません)'}
            </div>
          </div>

          {/* 出品者情報 */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#444' }}>出品者</h3>
            <Link to={`/users/${product.user_id}`} style={{ textDecoration: 'none' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', 
                border: '1px solid #eee', borderRadius: '8px', transition: 'background-color 0.2s' 
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {renderUserIcon(product.user_image_url, product.user_name, 48)}
                <div>
                  <div style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>{product.user_name}</div>
                  <div style={{ fontSize: '12px', color: '#007bff' }}>プロフィールを見る &gt;</div>
                </div>
              </div>
            </Link>
          </div>

          {/* アクションボタン */}
          <div style={{ marginTop: '20px' }}>
            {isMyProduct ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Button 
                  onClick={() => navigate(`/products/${product.id}/edit`)}
                  style={{ width: '100%', padding: '14px', fontSize: '16px', borderRadius: '30px', fontWeight: 'bold' }}
                >
                  商品の情報を編集する
                </Button>
                <Button 
                  onClick={handleDelete}
                  disabled={isProcessing}
                  style={{ width: '100%', padding: '14px', fontSize: '16px', borderRadius: '30px', backgroundColor: '#fff', color: '#dc3545', border: '2px solid #dc3545', fontWeight: 'bold' }}
                >
                  この商品を削除する
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {isSoldOut ? (
                  <Button disabled style={{ width: '100%', padding: '16px', fontSize: '18px', backgroundColor: '#ccc', borderRadius: '30px', cursor: 'not-allowed' }}>
                    売り切れ 🚫
                  </Button>
                ) : (
                  <Button 
                    onClick={purchaseProduct} 
                    style={{ 
                      width: '100%', 
                      padding: '16px', 
                      fontSize: '18px', 
                      borderRadius: '30px', 
                      backgroundColor: '#e91e63', 
                      boxShadow: '0 4px 12px rgba(233, 30, 99, 0.4)', 
                      fontWeight: 'bold' 
                    }}
                  >
                    購入する 🛒
                  </Button>
                )}
                
                <Button 
                  onClick={handleChat}
                  style={{ 
                    width: '100%', 
                    padding: '16px', 
                    fontSize: '18px', 
                    borderRadius: '30px', 
                    backgroundColor: '#fff', 
                    color: '#0084ff', 
                    border: '2px solid #0084ff', 
                    fontWeight: 'bold' 
                  }}
                >
                  出品者に質問する 💬
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};