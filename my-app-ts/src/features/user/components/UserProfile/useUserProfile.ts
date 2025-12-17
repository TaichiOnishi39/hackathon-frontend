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

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // リロード関数も返しておくと、登録後に再取得できて便利です
  return { userProfile, loading, error, reload: fetchUserProfile };
};