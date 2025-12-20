import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from './useRegister';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import toast from 'react-hot-toast';

export const RegisterForm = () => {
  const navigate = useNavigate();
  
  const { 
    name, setName, 
    bio, setBio, 
    image, handleImageChange, imagePreview,
    registerUser, 
    loading, 
    error,
    isSuccess 
  } = useRegister();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 登録完了したらホームへ遷移
  useEffect(() => {
    if (isSuccess) {
      toast.success("登録が完了しました！");
      navigate('/');
    }
  }, [isSuccess, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerUser();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* --- プロフィール画像アップロード --- */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div 
          onClick={() => fileInputRef.current?.click()}
          style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            backgroundColor: '#f0f0f0', 
            border: '2px dashed #ccc',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            transition: 'border-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#007bff'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = '#ccc'}
        >
          {imagePreview ? (
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ textAlign: 'center', color: '#888', fontSize: '12px' }}>
              <span style={{ fontSize: '24px', display: 'block' }}>📷</span>
              写真を追加
            </div>
          )}
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />
        <div style={{ fontSize: '12px', color: '#666' }}>プロフィール写真 (任意)</div>
      </div>

      {/* --- ユーザーネーム --- */}
      <div style={{ textAlign: 'left' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#555' }}>
          ユーザーネーム <span style={{ color: '#e53935', fontSize: '12px' }}>(必須)</span>
        </label>
        <Input 
          placeholder="例: 花子 (50文字以内)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          required
        />
      </div>

      {/* --- 自己紹介文 --- */}
      <div style={{ textAlign: 'left' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#555' }}>
          自己紹介 <span style={{ color: '#999', fontSize: '12px', fontWeight: 'normal' }}>(任意)</span>
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="趣味や好きなものについて書いてみましょう"
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px solid #ddd', 
            minHeight: '80px',
            fontSize: '16px',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none'
          }}
        />
      </div>

      {/* --- エラー表示 --- */}
      {error && (
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* --- 登録ボタン --- */}
      <Button 
        type="submit" 
        disabled={loading || !name.trim()}
        style={{ 
          width: '100%', 
          padding: '14px', 
          fontSize: '16px', 
          borderRadius: '8px',
          backgroundColor: (!name.trim() || loading) ? '#ccc' : '#007bff',
          cursor: (!name.trim() || loading) ? 'not-allowed' : 'pointer',
          marginTop: '10px'
        }}
      >
        {loading ? '登録処理中...' : 'はじめる'}
      </Button>
    </form>
  );
};