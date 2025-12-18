import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProductDetail } from '../ProductDetailPage/useProductDetail';
import { useUserProfile } from '../../features/user/components/UserProfile/useUserProfile'; // ★追加
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ProductEditPage = () => {
  const { product, loading: productLoading, error, updateProduct, deleteProduct } = useProductDetail();
  const { userProfile, loading: userLoading } = useUserProfile(); // ★ユーザー情報を取得
  const navigate = useNavigate();
  const { id } = useParams();

  // フォーム用State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  // データ読み込みと権限チェック
  useEffect(() => {
    // 両方のデータ読み込みが終わるまで待機
    if (productLoading || userLoading) return;

    if (product) {
      // 権限チェック: プロフィールが無い、またはIDが一致しない場合
      // ★修正: userProfile.id (DBのID) と product.user_id を比較
      if (!userProfile || userProfile.id !== product.user_id) {
        alert("編集権限がありません");
        navigate(`/products/${id}`); // 詳細ページへ戻す
        return;
      }

      // 権限OKなら初期値をセット (初回のみ)
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
      // updateProduct内でalertが出るのでここでは省略可
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

  // ロード中は待機表示
  if (productLoading || userLoading) return <div style={{ padding: '20px' }}>読み込み中...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>エラー: {error}</div>;
  if (!product) return null;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <Link to={`/products/${id}`} style={{ display: 'inline-block', marginBottom: '20px', color: '#666', textDecoration: 'none' }}>
        &lt; キャンセルして戻る
      </Link>

      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>商品情報の編集</h1>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>商品名</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="商品名" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>価格 (¥)</label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="価格" />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>商品説明</label>
          <textarea
            style={{ 
              width: '100%', 
              padding: '10px', 
              boxSizing: 'border-box', 
              minHeight: '150px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="商品の説明を入力してください"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Button onClick={handleSave} style={{ width: '100%', padding: '15px', fontSize: '18px', backgroundColor: '#28a745' }}>
            変更を保存する
          </Button>
          
          <div style={{ borderTop: '1px solid #eee', margin: '10px 0' }}></div>

          <Button onClick={handleDelete} style={{ width: '100%', padding: '15px', fontSize: '16px', backgroundColor: '#dc3545' }}>
            この商品を削除する 🗑️
          </Button>
        </div>
      </div>
    </div>
  );
};