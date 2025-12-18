import React from 'react';
import { useProductRegister } from './useProductRegister';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';

// ★アイコンを使わずに絵文字で対応、スタイルはすべてここに記述
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

  // --- スタイル定義 (CSS) ---
  const styles = {
    container: {
      maxWidth: '640px',
      margin: '20px auto',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
      fontFamily: 'sans-serif',
      border: '1px solid #f0f0f0',
    },
    header: {
      backgroundColor: '#f8f9fa',
      padding: '16px 24px',
      borderBottom: '1px solid #eaeaea',
    },
    headerTitle: {
      margin: 0,
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
    },
    form: {
      padding: '24px',
    },
    section: {
      marginBottom: '24px',
    },
    labelRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#444',
    },
    clearBtn: {
      background: 'none',
      border: 'none',
      color: '#999',
      fontSize: '12px',
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    imageArea: {
      border: '2px dashed #e0e0e0',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: '#fafafa',
      display: 'flex',
      flexDirection: 'column' as const, // TS用にキャスト
      gap: '12px',
    },
    aiButtonPink: {
      backgroundColor: '#e91e63',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      padding: '8px 16px',
      fontSize: '13px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      boxShadow: '0 2px 5px rgba(233,30,99,0.2)',
      fontWeight: 'bold',
      transition: 'opacity 0.2s',
    },
    aiToggleBtn: {
      backgroundColor: showAiInput ? '#eee' : '#673ab7',
      color: showAiInput ? '#666' : 'white',
      border: 'none',
      borderRadius: '20px',
      padding: '4px 12px',
      fontSize: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    aiPanel: {
      backgroundColor: '#f3e5f5',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '12px',
      border: '1px solid #e1bee7',
    },
    textArea: {
      width: '100%',
      minHeight: '120px',
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontSize: '14px',
      lineHeight: '1.5',
      boxSizing: 'border-box' as const,
      resize: 'vertical' as const,
    },
    submitBtn: {
      width: '100%',
      padding: '12px',
      backgroundColor: loading ? '#ccc' : '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: loading ? 'not-allowed' : 'pointer',
      marginTop: '10px',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.headerTitle}>商品を出品する</h3>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        
        {/* --- 商品名 --- */}
        <div style={styles.section}>
          <div style={styles.labelRow}>
            <label style={styles.label}>商品名</label>
            {name && (
              <button type="button" onClick={() => setName('')} style={styles.clearBtn}>
                クリア ✕
              </button>
            )}
          </div>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="例：メンズ スニーカー"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        {/* --- 価格 --- */}
        <div style={styles.section}>
          <div style={styles.labelRow}>
            <label style={styles.label}>価格 (円)</label>
            {Number(price) > 0 && (
              <button type="button" onClick={() => setPrice('')} style={styles.clearBtn}>
                クリア ✕
              </button>
            )}
          </div>
          <Input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)}
            placeholder="3000"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        {/* --- 商品画像 --- */}
        <div style={styles.section}>
          <label style={{...styles.label, display: 'block', marginBottom: '8px'}}>商品画像</label>
          <div style={styles.imageArea}>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            
            {imageFile && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button
                  type="button"
                  onClick={generateFromImage}
                  disabled={aiLoading}
                  style={{
                    ...styles.aiButtonPink,
                    opacity: aiLoading ? 0.6 : 1,
                    cursor: aiLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {aiLoading ? '解析中...' : '📷 画像から自動入力'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- 商品説明 --- */}
        <div style={styles.section}>
          <div style={styles.labelRow}>
            <label style={styles.label}>商品説明</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {description && (
                <button type="button" onClick={() => setDescription('')} style={styles.clearBtn}>
                  クリア
                </button>
              )}
              {/* AI開閉ボタン */}
              <button
                type="button" 
                onClick={() => setShowAiInput(!showAiInput)}
                disabled={!name}
                style={{
                  ...styles.aiToggleBtn,
                  opacity: !name ? 0.5 : 1,
                  cursor: !name ? 'not-allowed' : 'pointer'
                }}
              >
                {showAiInput ? '閉じる' : '✨ AI作成'}
              </button>
            </div>
          </div>

          {/* AI入力パネル */}
          {showAiInput && (
            <div style={styles.aiPanel}>
              <p style={{ fontSize: '12px', color: '#6a1b9a', margin: '0 0 8px', fontWeight: 'bold' }}>
                キーワードから説明文を生成します
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="例: 新品, 箱あり, 限定カラー"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
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
                    padding: '0 16px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: (aiLoading || !keywords.trim()) ? 'not-allowed' : 'pointer',
                    opacity: (aiLoading || !keywords.trim()) ? 0.7 : 1
                  }}
                >
                  {aiLoading ? '...' : '生成'}
                </button>
              </div>
            </div>
          )}
          
          <textarea
            style={styles.textArea}
            placeholder="商品の色、サイズ、素材、状態などを詳しく入力してください"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* --- エラー表示 --- */}
        {error && (
          <div style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', fontSize: '13px', marginBottom: '16px' }}>
            ⚠ {error}
          </div>
        )}

        {/* --- 送信ボタン --- */}
        <Button 
          type="submit" 
          disabled={loading}
          style={styles.submitBtn}
        >
          {loading ? '出品処理中...' : '商品を出品する'}
        </Button>

      </form>
    </div>
  );
};