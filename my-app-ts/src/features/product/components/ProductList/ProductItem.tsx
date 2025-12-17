import React, { useState } from 'react';
import { Product } from './useProductList';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

type Props = {
  product: Product;
  currentUserId: string | null;
  onUpdate: (id: string, name: string, desc: string, price: number) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
};

export const ProductItem = ({ product, currentUserId, onUpdate, onDelete }: Props) => {
  // ★ 編集モードかどうかは、このカード自身が管理する
  const [isEditing, setIsEditing] = useState(false);

  // フォーム用ステート
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [desc, setDesc] = useState(product.description);

  // 自分の商品かどうか
  const isMyProduct = currentUserId === product.user_id;

  const handleSave = async () => {
    // 親から渡された更新関数を実行
    const success = await onUpdate(product.id, name, desc, Number(price));
    if (success) {
      setIsEditing(false); // 成功したら閲覧モードに戻る
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // 入力内容を元に戻す
    setName(product.name);
    setPrice(String(product.price));
    setDesc(product.description);
  };

  // --- 編集モードの表示 ---
  if (isEditing) {
    return (
      <div style={cardStyle(true)}>
        <div style={{ marginBottom: '10px' }}>
          <Input label="商品名" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <Input label="価格" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '12px', display: 'block' }}>説明</label>
          <textarea
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <Button onClick={handleCancel} style={{ backgroundColor: '#6c757d', fontSize: '12px', padding: '4px 8px' }}>
            キャンセル
          </Button>
          <Button onClick={handleSave} style={{ backgroundColor: '#28a745', fontSize: '12px', padding: '4px 8px' }}>
            保存
          </Button>
        </div>
      </div>
    );
  }

  // --- 通常モードの表示 ---
  return (
    <div style={cardStyle(false)}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{product.name}</h4>
      <p style={{ color: '#e91e63', fontWeight: 'bold', fontSize: '20px', margin: '0 0 8px 0' }}>
        ¥{product.price.toLocaleString()}
      </p>
      <p style={{ fontSize: '14px', color: '#555', margin: '0 0 12px 0', whiteSpace: 'pre-wrap' }}>
        {product.description}
      </p>

      <div style={{ borderTop: '1px solid #eee', paddingTop: '8px', fontSize: '12px', color: '#999' }}>
        出品者: {product.user_name}<br />
        {new Date(product.created_at).toLocaleString()}
      </div>

      {isMyProduct && (
        <div style={{ marginTop: '10px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button
            onClick={() => setIsEditing(true)}
            style={{ backgroundColor: '#ffc107', color: '#000', fontSize: '12px', padding: '4px 8px' }}
          >
            編集
          </Button>
          <Button
            onClick={() => onDelete(product.id)}
            style={{ backgroundColor: '#dc3545', fontSize: '12px', padding: '4px 8px' }}
          >
            削除
          </Button>
        </div>
      )}
    </div>
  );
};

// スタイル定義（共通化）
const cardStyle = (isEditing: boolean): React.CSSProperties => ({
  border: isEditing ? '2px solid #007bff' : '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  position: 'relative',
});