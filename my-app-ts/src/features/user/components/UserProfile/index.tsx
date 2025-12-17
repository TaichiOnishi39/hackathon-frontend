import React from 'react';
import { useUserProfile } from './useUserProfile';

export const UserProfile = () => {
  const { userProfile, loading, error } = useUserProfile();

  if (loading) {
    return <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>読み込み中...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red', backgroundColor: '#fee', borderRadius: '8px' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', marginBottom: '30px' }}>
      {userProfile ? (
        // 登録済みの場合
        <div>
          <h3 style={{ margin: 0 }}>ようこそ、{userProfile.name} さん！</h3>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
            ID: {userProfile.id}
          </p>
        </div>
      ) : (
        // 未登録の場合
        <div>
          <h3 style={{ margin: 0 }}>ようこそ、ゲスト さん</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
            まだプロフィールが登録されていません。<br/>
            下のフォームから名前を登録して、商品を出品してみましょう！
          </p>
        </div>
      )}
    </div>
  );
};