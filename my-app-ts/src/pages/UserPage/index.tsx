import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUserProfile } from '../../features/user/components/UserProfile/useUserProfile';
import { UserProductList } from '../../features/product/components/UserProductList'; // ★追加
import { useUserPage } from './useUserPage'; // (※プロフィールの取得ロジックだけ残す)

export const UserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  
  // ユーザー情報の取得ロジック (useUserPage は商品取得部分を削ってプロフィール取得のみにする修正が必要ですが、
  // 面倒なら以前のままでも動きます。ここではプロフィール表示に使います)
  const { user, loading: userLoading } = useUserPage(); 
  
  // 自分のID (ProductItemに渡す用)
  const { userProfile: me } = useUserProfile();

  if (userLoading) return <div style={{ padding: '20px' }}>読み込み中...</div>;
  if (!user) return <div style={{ padding: '20px' }}>ユーザーが見つかりません</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#666', textDecoration: 'none' }}>
        &lt; トップに戻る
      </Link>

      {/* プロフィールヘッダー */}
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: '0 0 10px 0' }}>{user.name}</h1>
        <div style={{ color: '#666', whiteSpace: 'pre-wrap' }}>
          {user.bio || '(自己紹介はありません)'}
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