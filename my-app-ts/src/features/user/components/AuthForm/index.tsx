import React from 'react';
import { useAuth } from './useAuth';
import { Button } from '../../../../components/ui/Button'; // 汎用ボタン
import { Input } from '../../../../components/ui/Input';   // 汎用インプット

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
    <div style={{ maxWidth: '300px', margin: '0 auto', textAlign: 'center' }}>
      <h3>{isLoginMode ? 'ログイン' : '新規アカウント作成'}</h3>

      {/* Googleログインボタン */}
      <Button 
        onClick={loginWithGoogle} 
        style={{ width: '100%', backgroundColor: '#db4437', color: 'white', marginBottom: '20px' }}
      >
        Googleで続行
      </Button>

      <div style={{ marginBottom: '20px', fontSize: '12px', color: '#666' }}>または</div>

      {/* メールアドレスフォーム */}
      <form onSubmit={handleSubmit}>
        <Input 
          label="メールアドレス"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input 
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {/* ★パスワード忘れリンク (ログインモードの時だけ表示) */}
        {isLoginMode && (
          <div style={{ textAlign: 'right', marginBottom: '10px' }}>
            <span 
              onClick={handleResetPassword}
              style={{ 
                fontSize: '11px', 
                color: '#666', 
                cursor: 'pointer', 
                textDecoration: 'underline' 
              }}
            >
              パスワードを忘れた場合
            </span>
          </div>
        )}
        
        {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

        <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
          {loading ? '処理中...' : (isLoginMode ? 'ログイン' : '登録する')}
        </Button>
      </form>

      {/* モード切り替えリンク */}
      <p 
        onClick={() => setIsLoginMode(!isLoginMode)}
        style={{ fontSize: '12px', color: 'blue', cursor: 'pointer', marginTop: '15px' }}
      >
        {isLoginMode ? 'アカウントをお持ちでない方はこちら' : 'すでにアカウントをお持ちの方はこちら'}
      </p>
    </div>
  );
};