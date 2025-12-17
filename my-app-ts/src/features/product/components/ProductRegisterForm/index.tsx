import React from 'react';
import { useProductRegister } from './useProductRegister';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';

export const ProductRegisterForm = () => {
  const {
    name, setName,
    price, setPrice,
    description, setDescription,
    imageFile, setImageFile, // ★追加
    registerProduct,
    loading,
    error
  } = useProductRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerProduct();
  };

  // ファイルが選択された時の処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]); // 1つ目のファイルをセット
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginTop: '20px', backgroundColor: '#fff' }}>
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

      {/* ★追加: 画像選択フォーム */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>商品画像</label>
        <input 
          type="file" 
          accept="image/*" // 画像のみ許可
          onChange={handleFileChange}
          style={{ fontSize: '14px' }}
          required
        />
        {/* 選択中のファイル名を表示したければここに imageFile?.name */}
      </div>

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
          backgroundColor: loading ? '#ccc' : '#28a745',
          color: 'white',
          marginTop: '10px'
        }}
      >
        {loading ? '出品中...' : '出品する'}
      </Button>
    </form>
  );
};