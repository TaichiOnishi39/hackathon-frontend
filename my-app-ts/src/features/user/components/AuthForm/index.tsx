import React from 'react';
import { useAuth } from './useAuth';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

export const AuthForm = () => {
  const {
    email, setEmail,
    password, setPassword,
    isLoginMode, setIsLoginMode,
    loading, error,
    loginWithGoogle,
    handleSubmit,
    handleResetPassword
  } = useAuth();

  return (
    <div style={{ width: '100%' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '30px', color: '#333' }}>
        {isLoginMode ? 'ログイン' : '新規アカウント作成'}
      </h1>

      {/* Googleログインボタン (白背景・シンプル版) */}
      <Button 
        onClick={loginWithGoogle} 
        style={{ 
          width: '100%', 
          backgroundColor: '#fff', 
          color: '#555', 
          border: '1px solid #ddd', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          fontWeight: '500', 
          fontSize: '14px', 
          padding: '12px', 
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)', // 控えめな影
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
      >
        <span>Googleで続行</span>
      </Button>

      <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }}></div>
        <span style={{ padding: '0 10px', fontSize: '12px', color: '#999' }}>または</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }}></div>
      </div>

      {/* メールアドレスフォーム */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#555' }}>
            メールアドレス
          </label>
          <Input 
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#555' }}>
            パスワード
          </label>
          <Input 
            type="password"
            placeholder="パスワードを入力"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {/* パスワード忘れリンク */}
        {isLoginMode && (
          <div style={{ textAlign: 'right', marginTop: '-10px' }}>
            <span 
              onClick={handleResetPassword}
              style={{ 
                fontSize: '12px', 
                color: '#007bff', 
                cursor: 'pointer', 
                textDecoration: 'none' 
              }}
              onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              パスワードを忘れた場合
            </span>
          </div>
        )}
        
        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '6px', fontSize: '13px', textAlign: 'left' }}>
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={loading} 
          style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '8px', marginTop: '10px' }}
        >
          {loading ? '処理中...' : (isLoginMode ? 'ログイン' : '登録する')}
        </Button>
      </form>

      {/* モード切り替えリンク */}
      <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px', fontSize: '14px' }}>
        {isLoginMode ? 'アカウントをお持ちでない方は' : 'すでにアカウントをお持ちの方は'}<br />
        <span 
          onClick={() => setIsLoginMode(!isLoginMode)}
          style={{ color: '#007bff', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {isLoginMode ? '新規登録はこちら' : 'ログインはこちら'}
        </span>
      </div>
    </div>
  );
};