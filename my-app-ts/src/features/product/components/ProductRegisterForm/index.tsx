import React from 'react';
import { useProductRegister } from './useProductRegister';
import { Input } from '../../../../components/ui/Input'; // 既存のInputを再利用
import { Button } from '../../../../components/ui/Button'; // 既存のButtonを再利用

export const ProductRegisterForm = () => {
  const {
    name, setName,
    price, setPrice,
    description, setDescription,
    registerProduct,
    loading,
    error
  } = useProductRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerProduct();
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
      <h3>商品を出品する</h3>

      <Input
        label="商品名"
        placeholder="例: おしゃれなスニーカー"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        label="価格 (円)"
        type="number"
        placeholder="例: 3000"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      {/* 説明文は長くなるのでtextareaを直接書きます */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', fontSize: '12px' }}>商品説明</label>
        <textarea
          style={{ padding: '8px', width: '100%', boxSizing: 'border-box', minHeight: '80px' }}
          placeholder="商品の詳細を入力してください"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {error && (
        <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>
      )}

      <Button 
        type="submit" 
        disabled={loading}
        style={{ 
          width: '100%',
          backgroundColor: loading ? '#ccc' : '#28a745', // 緑色にしてみる
          color: 'white',
          marginTop: '10px'
        }}
      >
        {loading ? '出品中...' : '出品する'}
      </Button>
    </form>
  );
};