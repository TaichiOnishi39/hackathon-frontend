import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../features/user/components/UserProfile/useUserProfile';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { userProfile, loading, error, updateUserProfile } = useUserProfile();

  // フォーム用State
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // ユーザーデータが読み込まれたらフォームにセット
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setBio(userProfile.bio || '');
      setPreviewUrl(userProfile.image_url || '');
    }
  }, [userProfile]);

  // 画像選択時の処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("名前は必須です");
      return;
    }
    const success = await updateUserProfile(name, bio, imageFile);
    if (success) {
      alert("プロフィールを更新しました");
      navigate('/mypage'); // 更新後はマイページに戻る
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>読み込み中...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  // アイコン表示用ヘルパー
  const renderIcon = (size: number) => {
    if (previewUrl) {
      return (
        <img 
          src={previewUrl} 
          alt="icon" 
          style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', objectFit: 'cover', border: '1px solid #ddd' }} 
        />
      );
    }
    return (
      <div style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${size/2}px`, color: '#fff', fontWeight: 'bold' }}>
        {name ? name.charAt(0) : '?'}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <button 
        onClick={() => navigate('/mypage')} 
        style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', fontSize: '16px', color: '#666' }}
      >
        &lt; マイページに戻る
      </button>

      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, marginBottom: '24px', textAlign: 'center' }}>プロフィール編集</h2>

        {/* 画像変更エリア */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
            <div style={{ marginBottom: '16px' }}>
                {renderIcon(100)}
            </div>
            <label 
                htmlFor="file-upload" 
                style={{ 
                    cursor: 'pointer', 
                    color: '#007bff', 
                    fontWeight: 'bold', 
                    fontSize: '14px', 
                    padding: '8px 16px', 
                    border: '1px solid #007bff', 
                    borderRadius: '20px' 
                }}
            >
                画像を変更する
            </label>
            <input 
                id="file-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
            />
        </div>

        {/* 入力フォーム */}
        <div style={{ marginBottom: '20px' }}>
            <Input 
                label="お名前 (必須)" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
            />
        </div>

        <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#444', marginBottom: '8px' }}>
                自己紹介
            </label>
            <textarea
                style={{ 
                    width: '100%', 
                    padding: '12px', 
                    boxSizing: 'border-box', 
                    minHeight: '120px', 
                    borderRadius: '8px', 
                    border: '1px solid #ddd', 
                    fontSize: '16px',
                    lineHeight: '1.5',
                    resize: 'vertical'
                }}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="趣味や好きなものなどを書いてみましょう"
            />
        </div>

        <Button onClick={handleSave} style={{ width: '100%', padding: '12px', fontSize: '16px' }}>
            保存して完了
        </Button>
      </div>
    </div>
  );
};