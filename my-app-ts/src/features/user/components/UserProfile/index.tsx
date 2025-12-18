import React, { useState, useEffect } from 'react';
import { useUserProfile } from './useUserProfile';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

export const UserProfile = () => {
  const { userProfile, loading, error, updateUserProfile } = useUserProfile();
  
  // 編集モードかどうか
  const [isEditing, setIsEditing] = useState(false);
  
  // フォーム用State
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  // プロフィールデータが読み込まれたらフォーム初期値にセット
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setBio(userProfile.bio || '');
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!name.trim()) {
      alert("名前は必須です");
      return;
    }
    const success = await updateUserProfile(name, bio);
    if (success) {
      setIsEditing(false); // 成功したら閲覧モードに戻る
      alert("プロフィールを更新しました");
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>読み込み中...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red', backgroundColor: '#fee', borderRadius: '8px' }}>{error}</div>;
  }

  // 未登録の場合（通常ここには来ないはずですが念のため）
  if (!userProfile) {
    return <div>プロフィール未登録</div>;
  }

  // --- 編集モード ---
  if (isEditing) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0 }}>プロフィール編集</h3>
        
        <Input 
          label="お名前 (必須)" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>自己紹介 (任意)</label>
          <textarea
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '80px' }}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="趣味や好きなものなどを書いてみましょう"
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={handleSave} style={{ backgroundColor: '#28a745' }}>保存する</Button>
          <Button onClick={() => setIsEditing(false)} style={{ backgroundColor: '#6c757d' }}>キャンセル</Button>
        </div>
      </div>
    );
  }

  // --- 閲覧モード ---
  return (
    <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', marginBottom: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: 0 }}>{userProfile.name}</h3>
          <p style={{ margin: '5px 0 10px 0', fontSize: '12px', color: '#666' }}>ID: {userProfile.id}</p>
          
          {/* 自己紹介文の表示 (改行コードを <br> に変換して表示) */}
          <div style={{ fontSize: '14px', color: '#333', whiteSpace: 'pre-wrap' }}>
             {userProfile.bio ? userProfile.bio : <span style={{color:'#999'}}>(自己紹介はまだありません)</span>}
          </div>
        </div>
        
        <Button 
          onClick={() => setIsEditing(true)} 
          style={{ fontSize: '12px', padding: '5px 10px', backgroundColor: '#007bff' }}
        >
          編集
        </Button>
      </div>
    </div>
  );
};