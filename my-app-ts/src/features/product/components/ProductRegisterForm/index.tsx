import React from 'react';
import { useProductRegister } from './useProductRegister';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';

export const ProductRegisterForm = () => {
  const {
    name, setName,
    price, setPrice,
    description, setDescription,
    imageFile, setImageFile,
    registerProduct,
    loading,
    error,
    generateDescription,
    generateFromImage,
    aiLoading,
    keywords, setKeywords,
    showAiInput, setShowAiInput
  } = useProductRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerProduct();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
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
        label="価格 (円) 数字のみ入力してください"
        type="number"
        placeholder="例: 3000"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>商品画像</label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            style={{ fontSize: '14px' }}
            required
          />
          
          {/* ★追加: 画像解析ボタン */}
          {imageFile && (
            <button
              type="button"
              onClick={generateFromImage}
              disabled={aiLoading}
              style={{
                backgroundColor: '#e91e63', // ピンク色で目立たせる
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: aiLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '5px',
                boxShadow: '0 2px 5px rgba(233,30,99,0.3)'
              }}
            >
              {aiLoading ? '解析中...' : '📷 画像から自動入力'}
            </button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <label style={{ fontSize: '12px' }}>商品説明</label>
          
          {/* ★AIボタン: クリックで入力エリアを開閉 */}
          <button
            type="button" 
            onClick={() => setShowAiInput(!showAiInput)}
            disabled={!name}
            style={{
              fontSize: '11px',
              padding: '4px 8px',
              backgroundColor: showAiInput ? '#666' : '#673ab7', // 開いてる時はグレー、閉じてる時は紫
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !name ? 'not-allowed' : 'pointer',
              opacity: !name ? 0.6 : 1,
              display: 'flex', alignItems: 'center', gap: '4px'
            }}
          >
            {showAiInput ? '閉じる' : '✨ AIで文章を作る'}
          </button>
        </div>

        {/* ★AI入力エリア: showAiInput が true の時だけ表示 */}
        {showAiInput && (
          <div style={{ 
            marginBottom: '10px', 
            padding: '10px', 
            backgroundColor: '#f3e5f5', // 薄い紫の背景
            borderRadius: '4px',
            border: '1px solid #d1c4e9'
          }}>
            <p style={{ fontSize: '12px', margin: '0 0 5px', color: '#4a148c' }}>
              商品の特徴キーワードを入力してください
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="例: 新品, 箱あり, 限定カラー, 傷なし"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                style={{ flex: 1, padding: '6px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <button
                type="button"
                onClick={generateDescription}
                disabled={aiLoading || !keywords.trim()}
                style={{
                  backgroundColor: '#673ab7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: (aiLoading || !keywords.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (aiLoading || !keywords.trim()) ? 0.7 : 1
                }}
              >
                {aiLoading ? '生成中...' : '生成する'}
              </button>
            </div>
          </div>
        )}
        
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