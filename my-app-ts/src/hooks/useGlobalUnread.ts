import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useLocation } from 'react-router-dom';

export const useGlobalUnread = () => {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const location = useLocation(); 

  const fetchUnreadCount = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch('https://hackathon-backend-80731441408.europe-west1.run.app/messages/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        // dataは配列。各チャットの unread_count を合計する
        const total = data.reduce((sum: number, chat: any) => sum + (chat.unread_count || 0), 0);
        setTotalUnreadCount(total);
      }
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  useEffect(() => {
    // 初回実行
    fetchUnreadCount();

    // ポーリング（30秒ごとに更新）
    const intervalId = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(intervalId);
  }, [location.pathname]);

  return { totalUnreadCount, refetch: fetchUnreadCount };
};