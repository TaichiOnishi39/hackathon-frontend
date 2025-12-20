import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from './useUserProfile';
import { Button } from '../../../../components/ui/Button';
import { useSettings } from '../../../../contexts/SettingsContext';

export const UserProfile = () => {
  const { userProfile, loading, error } = useUserProfile();
  const navigate = useNavigate();

  const { settings } = useSettings();

  if (loading) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '12px', textAlign: 'center', color: '#666' }}>
        読み込み中...
      </div>
    );
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  }

  if (!userProfile) {
    return <div>プロフィール未登録</div>;
  }

  // アイコン表示用 (画像があれば画像、なければイニシャル)
  const renderIcon = (size: number) => {
    if (userProfile.image_url) {
      return (
        <img 
          src={userProfile.image_url} 
          alt={userProfile.name} 
          style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee' }} 
        />
      );
    }
    return (
      <div style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${size/2.5}px`, color: '#888', fontWeight: 'bold' }}>
        {userProfile.name.charAt(0)}
      </div>
    );
  };

  return (
    <div style={{ 
      backgroundColor: '#fff', 
      borderRadius: '16px', 
      padding: '24px', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      {/* アイコン */}
      <div style={{ marginBottom: '16px' }}>
        {renderIcon(100)}
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '8px', // 名前とマークの間隔
        marginBottom: '4px' 
      }}>

      {/* 名前 */}
      <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#333' }}>
        {userProfile.name}
      </h3>

      {/* ★追加: サブスク済みの場合の黄色いチェックマーク */}
        {settings.isSubscribed && (
          <span title="プレミアムプラン加入中" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '20px', 
            height: '20px', 
            backgroundColor: '#ffc107', // 黄色
            borderRadius: '50%', 
            color: '#fff', 
            fontSize: '12px', 
            fontWeight: 'bold',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            flexShrink: 0 // 名前が長くても潰れないように
          }}>
            ✓
          </span>
        )}
      </div>
      
      {/* ID (控えめに表示) */}
      <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#999', fontFamily: 'monospace' }}>
        @{userProfile.id.substring(0, 8)}...
      </p>

      {/* 自己紹介 */}
      <div style={{ 
        width: '100%',
        fontSize: '14px', 
        color: '#555', 
        lineHeight: '1.6', 
        whiteSpace: 'pre-wrap', 
        marginBottom: '24px',
        textAlign: 'left',
        backgroundColor: '#f8f9fa',
        padding: '12px',
        borderRadius: '8px'
      }}>
         {userProfile.bio || '自己紹介はまだありません。'}
      </div>
      
      {/* 編集ボタン */}
      <Button 
        onClick={() => navigate('/profile/edit')} 
        style={{ 
          width: '100%',
          backgroundColor: '#fff', 
          color: '#333', 
          border: '1px solid #ddd',
          borderRadius: '20px',
          fontWeight: 'bold',
          padding: '10px'
        }}
      >
        プロフィールを編集
      </Button>
    </div>
  );
};