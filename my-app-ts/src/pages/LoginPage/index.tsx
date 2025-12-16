import React from 'react';
import { AuthForm } from '../../features/user/components/AuthForm';

export const LoginPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      {/* ログイン・登録フォームを表示 */}
      <AuthForm />
    </div>
  );
};