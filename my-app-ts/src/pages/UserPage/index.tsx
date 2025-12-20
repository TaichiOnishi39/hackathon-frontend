import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../features/user/components/UserProfile/useUserProfile';
import { UserProductList } from '../../features/product/components/UserProductList'; 
import { useUserPage } from './useUserPage'; 
import { Button } from '../../components/ui/Button';

export const UserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  
  const { user, loading: userLoading } = useUserPage(); 
  // 自分のID (ProductItemに渡す用)
  const { userProfile: me } = useUserProfile();
  const navigate = useNavigate();

  if (userLoading) return <div style={{ padding: '20px' }}>読み込み中...</div>;
  if (!user) return <div style={{ padding: '20px' }}>ユーザーが見つかりません</div>;

  const isMe = me?.id === user.id;

  const renderIcon = (size: number) => {
    if (user.image_url) {
      return (
        <img 
          src={user.image_url} 
          alt={user.name} 
          style={{ 
            width: `${size}px`, 
            height: `${size}px`, 
            borderRadius: '50%', 
            objectFit: 'cover', 
            border: '1px solid #eee',
            flexShrink: 0
          }} 
        />
      );
    }
    return (
        <div style={{ 
            width: `${size}px`, 
            height: `${size}px`, 
            borderRadius: '50%', 
            backgroundColor: '#f0f0f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: `${size / 2.5}px`, 
            color: '#666',
            flexShrink: 0,
            fontWeight: 'bold'
        }}>
            {user.name.charAt(0)}
        </div>
      );
    };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '5px', 
            textDecoration: 'none', 
            color: '#666', 
            fontWeight: '500',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontSize: '16px',
            fontFamily: 'inherit'
          }}
        >
          <span>&lt;</span> 戻る
        </button>
      </div>

      {/* プロフィールヘッダー */}
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '30px', 
        borderRadius: '8px', 
        marginBottom: '30px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',          // ★横並びにする
        alignItems: 'flex-start', // ★上端を揃える
        gap: '24px'               // ★アイコンと文字の間隔
      }}>
        
        {/* ユーザーアイコン風のデザイン (あると見栄えが良いので追加) */}
        {renderIcon(80)}

        <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <h2 style={{ margin: 0, fontSize: '22px' }}>{user.name}</h2>
            </div>
            
            <div style={{ color: '#555', whiteSpace: 'pre-wrap', marginBottom: '16px', lineHeight: '1.6', fontSize: '14px' }}>
              {user.bio || '(自己紹介はありません)'}
            </div>

            {/* ボタン（左寄せ） */}
            {!isMe && (
                <Button 
                    onClick={() => navigate(`/chat/${user.id}`)}
                    style={{ 
                        backgroundColor: '#fff', 
                        color: '#0084ff', 
                        border: '1px solid #0084ff',
                        padding: '6px 16px',   // 少しシュッとさせる
                        borderRadius: '20px',  // 丸みをつける
                        width: 'auto',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    <span>メッセージを送る</span>
                    <span>💬</span>
                </Button>
            )}
        </div>
        </div>

      {/* 商品一覧エリア */}
      <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>出品した商品</h3>
      
      {/* ★新しいコンポーネントを利用 */}
      {userId && (
        <UserProductList 
          userId={userId} 
          currentUserId={me?.id || null} 
        />
      )}
    </div>
  );
};