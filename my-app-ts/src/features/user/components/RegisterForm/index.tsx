import React from 'react';
import { useRegister } from './useRegister';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';

export const RegisterForm = () => {
  // error も受け取る
  const { name, setName, registerUser, loading, error } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerUser();
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
      <h3>ユーザー登録</h3>
      
      <Input 
        label="ユーザーネーム"
        placeholder="(50文字以内)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={50}
      />

      {/* ★エラーがある時だけ赤い文字を出す */}
      {error && (
        <p style={{ color: 'red', fontSize: '12px', marginTop: '-5px', marginBottom: '10px' }}>
          {error}
        </p>
      )}

      {/* ★名前が空の時はボタンを押せないようにする (disabled) */}
      <Button 
        type="submit" 
        disabled={loading || !name.trim()}
        style={{ 
          // 無効時はグレー、通常は青
          backgroundColor: (!name.trim() || loading) ? '#ccc' : '#007bff',
          cursor: (!name.trim() || loading) ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '送信中...' : '登録する'}
      </Button>
    </form>
  );
};