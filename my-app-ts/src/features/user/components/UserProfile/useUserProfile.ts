import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import toast from 'react-hot-toast';

export interface UserProfileData {
  id: string;
  name: string;
  firebase_uid: string;
  bio: string;
  image_url?: string;
  is_subscribed: boolean;
}

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const token = await user.getIdToken();
      
      const res = await fetch('https://hackathon-backend-80731441408.europe-west1.run.app/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });

      if (res.status === 404) {
        setUserProfile(null);
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await res.json();
      setUserProfile(data);

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // プロフィール更新機能
  const updateUserProfile = async (name: string, bio: string, imageFile: File | null) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return false;
      const token = await user.getIdToken();

      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await fetch('https://hackathon-backend-80731441408.europe-west1.run.app/users/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!res.ok) throw new Error('更新に失敗しました');
      
      const updatedUser = await res.json();
      setUserProfile(updatedUser); // 画面のデータを最新にする
      return true;

    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // リロード関数も返しておくと、登録後に再取得できて便利です
  return { userProfile, loading, error, reload: fetchUserProfile, updateUserProfile, setUserProfile };
};