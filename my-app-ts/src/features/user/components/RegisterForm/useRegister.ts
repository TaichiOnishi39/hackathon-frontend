import { useState } from 'react';
import { getAuth } from 'firebase/auth';

export const useRegister = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState(''); // 追加: 自己紹介
  const [image, setImage] = useState<File | null>(null); // 追加: 画像ファイル
  const [imagePreview, setImagePreview] = useState<string | null>(null); // 追加: プレビューURL

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false); // 完了フラグ

  // 画像選択時の処理
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      // プレビュー表示用
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const registerUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('認証情報が見つかりません');
      const token = await user.getIdToken();

      // 1. まずユーザーを作成 (名前登録)
      const res1 = await fetch('https://hackathon-backend-80731441408.europe-west1.run.app/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });

      if (!res1.ok) {
        throw new Error('ユーザー登録に失敗しました');
      }

      // 2. 続けてプロフィール詳細を更新 (画像・Bio登録)
      // 画像またはBioがある場合のみ実行
      if (bio.trim() || image) {
        const formData = new FormData();
        formData.append('name', name); // 名前も念のため再送
        formData.append('bio', bio);
        if (image) {
          formData.append('image', image);
        }

        const res2 = await fetch('https://hackathon-backend-80731441408.europe-west1.run.app/users/me', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        if (!res2.ok) {
          console.warn('詳細情報の保存に失敗しましたが、登録は完了しました');
        }
      }

      setIsSuccess(true); // 全て完了
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return {
    name, setName,
    bio, setBio,
    image, handleImageChange, imagePreview,
    registerUser,
    loading,
    error,
    isSuccess
  };
};