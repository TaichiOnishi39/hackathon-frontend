import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

export interface UserProfileData {
  id: string;
  name: string;
  firebase_uid: string;
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

      if (res.ok) {
        // 200 OK の場合
        const data = await res.json();
        // データがあればセット、なければ null のまま
        setUserProfile(data || null);
      } else {
        // 500エラーなど
        const errorText = await res.text();
        setError(`取得エラー: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      setError("ネットワークエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // リロード関数も返しておくと、登録後に再取得できて便利です
  return { userProfile, loading, error, reload: fetchUserProfile };
};