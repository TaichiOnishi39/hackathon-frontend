import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

export interface ChatSummary {
  partner_id: string;
  partner_name: string;
  last_message: string;
  last_time: string;
  unread_count: number;
}

export const useChatList = () => {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();

        const res = await fetch('https://hackathon-backend-80731441408.europe-west1.run.app/messages/list', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch chat list');
        const data = await res.json();
        setChats(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  return { chats, loading };
};