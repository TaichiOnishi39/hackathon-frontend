import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProductDetail } from '../ProductDetailPage/useProductDetail';
import { useUserProfile } from '../../features/user/components/UserProfile/useUserProfile';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ProductEditPage = () => {
  const { product, loading: productLoading, error, updateProduct, deleteProduct } = useProductDetail();
  const { userProfile, loading: userLoading } = useUserProfile();
  const navigate = useNavigate();
  const { id } = useParams();

  // フォーム用State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  // データ読み込みと権限チェック
  useEffect(() => {
    if (productLoading || userLoading) return;

    if (product) {
      // 権限チェック: userProfile.id と product.user_id を比較
      if (!userProfile || userProfile.id !== product.user_id) {
        alert("編集権限がありません");
        navigate(`/products/${id}`);
        return;
      }

      // 初期値をセット (初回のみ)
      if (name === '') {
          setName(product.name);
          setPrice(String(product.price));
          setDescription(product.description);
      }
    }
  }, [product, userProfile, productLoading, userLoading, navigate, id, name]);

  const handleSave = async () => {
    if (!product) return;
    const success = await updateProduct(name, description, Number(price));
    if (success) {
      navigate(`/products/${product.id}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('本当にこの商品を削除しますか？\n（この操作は取り消せません）')) {
      const success = await deleteProduct();
      if (success) {
        navigate('/');
      }
    }
  };

  if (productLoading || userLoading) return <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>読み込み中...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>エラー: {error}</div>;
  if (!product) return null;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px', paddingBottom: '80px' }}>
      <Link to={`/products/${id}`} style={{ display: 'inline-block', marginBottom: '20px', color: '#666', textDecoration: 'none', fontWeight: '500' }}>
        &lt; キャンセルして戻る
      </Link>

      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '30px', textAlign: 'center', color: '#333' }}>商品情報の編集</h1>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>商品名</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="商品名" />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>価格 (¥)</label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="価格" />
        </div>

        <div style={{ marginBottom: '40px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>商品説明</label>
          <textarea
            style={{ 
              width: '100%', 
              padding: '12px', 
              boxSizing: 'border-box', 
              minHeight: '150px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '16px',
              lineHeight: '1.6',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="商品の説明を入力してください"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 保存ボタン (メイン) */}
          <Button 
            onClick={handleSave} 
            style={{ 
              width: '100%', 
              padding: '14px', 
              fontSize: '16px', 
              backgroundColor: '#007bff', // 統一感のある青
              borderRadius: '30px', 
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            変更を保存する
          </Button>
          
          <div style={{ borderTop: '1px solid #eee', margin: '10px 0' }}></div>

          {/* 削除ボタン (サブ/危険) */}
          <Button 
            onClick={handleDelete} 
            style={{ 
              width: '100%', 
              padding: '14px', 
              fontSize: '16px', 
              backgroundColor: '#fff', 
              color: '#dc3545',
              border: '2px solid #dc3545', // アウトラインスタイル
              borderRadius: '30px',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#dc3545';
                e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.color = '#dc3545';
            }}
          >
            この商品を削除する <span style={{fontSize:'18px'}}>🗑️</span>
          </Button>
        </div>
      </div>
    </div>
  );
};