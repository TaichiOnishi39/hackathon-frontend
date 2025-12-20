import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RegisterForm } from '../../features/user/components/RegisterForm';
import { useUserProfile } from '../../features/user/components/UserProfile/useUserProfile';

export const RegisterPage = () => {
  const { userProfile, loading } = useUserProfile();
  const navigate = useNavigate();

  // 既にプロフィール登録済みならホームへリダイレクト
  useEffect(() => {
    if (!loading && userProfile) {
      navigate('/');
    }
  }, [loading, userProfile, navigate]);

  return (
    <div style={{ 
      maxWidth: '480px', 
      margin: '0 auto', 
      padding: '20px', 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center' 
    }}>

      {/* 登録カード */}
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '40px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '10px', color: '#333' }}>アカウント登録</h1>
        <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>
          あなたのプロフィールを作成しましょう
        </p>
        
        {/* 登録フォームの表示 */}
        <RegisterForm />
      </div>

    </div>
  );
};