import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

export interface UserProfileData {
  id: string;
  name: string;
  firebase_uid: string;
  bio: string;
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
  const updateUserProfile = async (name: string, bio: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return false;
      const token = await user.getIdToken();

      const res = await fetch('https://hackathon-backend-80731441408.europe-west1.run.app/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, bio }),
      });

      if (!res.ok) throw new Error('更新に失敗しました');
      
      const updatedUser = await res.json();
      setUserProfile(updatedUser); // 画面のデータを最新にする
      return true;

    } catch (err: any) {
      console.error(err);
      alert(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // リロード関数も返しておくと、登録後に再取得できて便利です
  return { userProfile, loading, error, reload: fetchUserProfile, updateUserProfile };
};