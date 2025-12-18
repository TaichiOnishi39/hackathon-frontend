import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserProfileData } from '../../features/user/components/UserProfile/useUserProfile';

export const useUserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/users/${userId}`);
        if (res.ok) {
          setUser(await res.json());
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading };
};