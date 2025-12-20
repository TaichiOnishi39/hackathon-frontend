import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import toast from 'react-hot-toast';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  product_id?: string;   
  product_name?: string;
  is_deleted?: boolean;
}

export interface ChatUser {
    id: string;
    name: string;
    image_url?: string;
}

// 簡易的な商品情報の型定義
interface SimpleProduct {
    id: string;
    name: string;
    price: number;
    image_url: string;
    status: 'on_sale' | 'sold_out';
}

export const useChat = () => {
  const { userId } = useParams<{ userId: string }>(); 
  const [searchParams] = useSearchParams();
  // ★修正: 遷移元によっては product_id だったり productId だったりする可能性があるので両方見る
  const productId = searchParams.get('product_id') || searchParams.get('productId');

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [partner, setPartner] = useState<ChatUser | null>(null);
  const [targetProduct, setTargetProduct] = useState<SimpleProduct | null>(null); // ★追加: 対象商品
  
  const auth = getAuth();
  
  // 1. チャット履歴の取得
  const fetchMessages = async () => {
    if (!userId) return;
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/messages?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('チャットの取得に失敗しました');
      const data = await res.json();
      setMessages(data || []); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartner = async () => {
    if (!userId) return;
    try {
        const res = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/users/${userId}`);
        if (!res.ok) throw new Error('ユーザー情報の取得に失敗');
        const data = await res.json();
        setPartner(data);
    } catch (err) {
        console.error(err);
    }
  };

  // ★追加: 問い合わせ対象の商品情報を取得
  const fetchTargetProduct = async () => {
    if (!productId) return;
    try {
        const res = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/products/${productId}`);
        if (res.ok) {
            const data = await res.json();
            setTargetProduct(data);
        }
    } catch (err) {
        console.error("商品情報の取得に失敗", err);
    }
  };

  // 既読にする処理
  const markAsRead = async () => {
    if (!userId) return;
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/messages/read?partner_id=${userId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("既読処理に失敗:", err);
    }
  };

  // 2. メッセージ送信
  const sendMessage = async () => {
    if (!inputText.trim() || !userId) return;
    if (isSending) return; 

    setIsSending(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver_id: userId,
          content: inputText,
          product_id: productId || null
        })
      });

      if (!res.ok) throw new Error('送信に失敗しました');
      
      setInputText('');
      fetchMessages(); 
      
    } catch (err) {
      console.error(err);
      toast.error('送信できませんでした');
    }finally{
      setIsSending(false);
    }
  };

  const unsendMessage = async (messageId: string) => {
    if (!window.confirm("送信を取り消しますか？\n（「メッセージの送信を取り消しました」と表示されます）")) return;
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/messages/${messageId}/unsend`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, is_deleted: true, content: '' } : m));
      } else {
        toast.error("取り消しに失敗しました");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!window.confirm("この履歴を完全に削除しますか？\n（元に戻せません）")) return;
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/messages/${messageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== messageId));
      } else {
        toast.error("削除に失敗しました");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 初回読み込み 
  useEffect(() => {
    if (!userId) return;
    fetchMessages();
    fetchPartner();
    fetchTargetProduct(); // ★追加
    markAsRead();

    const intervalId = setInterval(() => {
        fetchMessages();
        markAsRead(); 
      }, 3000);
    return () => {
      clearInterval(intervalId);
    };  
  }, [userId]); // productIdが変わった時も再取得したほうが良いが、通常チャット画面でIDは変わらないのでuserId依存でOK

  return { 
      messages, inputText, setInputText, sendMessage, loading, 
      partnerId: userId, isSending, partner, unsendMessage, deleteMessage,
      targetProduct // ★追加: これを返す
  };
};