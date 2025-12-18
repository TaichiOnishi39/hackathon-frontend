import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../../features/user/components/RegisterForm';
import { useUserProfile } from '../../features/user/components/UserProfile/useUserProfile';

export const RegisterPage = () => {
  const { userProfile, loading } = useUserProfile();
  const navigate = useNavigate();

  // もし既にプロフィールがあるなら、登録画面には用がないのでダッシュボードへ飛ばす
  useEffect(() => {
    if (!loading && userProfile) {
      navigate('/dashboard');
    }
  }, [loading, userProfile, navigate]);

  if (loading) return <div>Checking profile...</div>;

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>アカウント登録</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px' }}>
        アプリを利用するために、ユーザー情報を登録してください。
      </p>
      
      {/* 登録フォーム (登録完了後の遷移は RegisterForm 内、またはここで制御) */}
      <RegisterForm />
    </div>
  );
};