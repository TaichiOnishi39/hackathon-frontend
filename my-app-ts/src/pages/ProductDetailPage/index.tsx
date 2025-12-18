import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProductDetail } from './useProductDetail';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input'; // ★Inputコンポーネントを使用
import { useUserProfile } from '../../features/user/components/UserProfile/useUserProfile';

export const ProductDetailPage = () => {
  // ★deleteProduct, updateProduct を受け取る
  const { product, loading, error, purchaseProduct, isLiked, toggleLike, deleteProduct, updateProduct } = useProductDetail();
  const { userProfile } = useUserProfile();
  const navigate = useNavigate();

  // ★編集モード管理用のstate
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // 商品データが読み込まれたら編集用フォームに初期値をセット
  useEffect(() => {
    if (product) {
      setEditName(product.name);
      setEditPrice(String(product.price));
      setEditDesc(product.description);
    }
  }, [product]);

  if (loading) return <div style={{ padding: '20px' }}>読み込み中...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>エラー: {error}</div>;
  if (!product) return <div style={{ padding: '20px' }}>商品が見つかりません</div>;

  const isSoldOut = !!product.buyer_id;
  // 自分の商品かどうか
  const isMyProduct = userProfile && userProfile.id === product.user_id;

  // 削除ボタン
  const handleDelete = async () => {
    const success = await deleteProduct();
    if (success) {
      navigate('/'); // 削除したらトップへ戻る
    }
  };

  // 保存ボタン
  const handleSave = async () => {
    const success = await updateProduct(editName, editDesc, Number(editPrice));
    if (success) {
      setIsEditing(false); // 編集モード終了
    }
  };

  const handleChat = () => {
    if (!product) return;
    navigate(`/chat/${product.user_id}`);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
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
            
            {/* ▼▼▼ 編集モード: 入力フォームを表示 ▼▼▼ */}
            {isEditing ? (
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{fontSize: '12px'}}>商品名</label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{fontSize: '12px'}}>価格</label>
                  <Input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{fontSize: '12px', display: 'block', marginBottom: '5px'}}>商品説明</label>
                  <textarea 
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '150px' }}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button onClick={handleSave} style={{ flex: 1, backgroundColor: '#28a745' }}>保存する</Button>
                  <Button onClick={() => setIsEditing(false)} style={{ flex: 1, backgroundColor: '#6c757d' }}>キャンセル</Button>
                </div>
              </div>
            ) : (
              /* ▼▼▼ 通常モード: 詳細を表示 ▼▼▼ */
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>{product.name}</h1>
                  {/* 他人の商品ならいいねボタン表示 */}
                  {!isMyProduct && (
                    <button 
                      onClick={toggleLike}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', fontSize: '32px', lineHeight: 1,
                        color: isLiked ? '#e91e63' : '#ccc', transition: 'transform 0.1s'
                      }}
                      title={isLiked ? "いいね解除" : "いいね！"}
                    >
                      {isLiked ? '♥' : '♡'}
                    </button>
                  )}
                </div>

                <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                出品者: 
                {/* ★リンクに変更 */}
                <Link to={`/users/${product.user_id}`} style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold', marginLeft: '5px' }}>
                  {product.user_name}
                </Link>
                 / {new Date(product.created_at).toLocaleString()}
              </p>
                
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#e91e63', margin: '0 0 30px 0' }}>
                  ¥{product.price.toLocaleString()}
                </p>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>商品説明</h3>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{product.description}</p>
                </div>

                <div style={{ marginTop: '30px' }}>
                  {/* ★自分の商品かどうかでボタンを出し分け */}
                  {isMyProduct ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Button 
                        onClick={() => setIsEditing(true)} 
                        style={{ flex: 1, backgroundColor: '#ffc107', color: '#000', fontSize: '18px', padding: '15px' }}
                      >
                        編集する ✏️
                      </Button>
                      <Button 
                        onClick={handleDelete} 
                        style={{ flex: 1, backgroundColor: '#dc3545', fontSize: '18px', padding: '15px' }}
                      >
                        削除する 🗑️
                      </Button>
                    </div>
                  ) : (
                    /* 他人の商品なら購入・チャット */
                    <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};