import React from 'react';
import { Link } from 'react-router-dom';
import { useChatList } from './useChatList';

export const ChatListPage = () => {
  const { chats, loading } = useChatList();

  if (loading) return <div style={{ padding: '20px' }}>読み込み中...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>メッセージ一覧</h2>
      
      {chats.length === 0 ? (
        <p>メッセージはまだありません。</p>
      ) : (
        <div>
          {chats.map((chat) => (
            <Link 
              key={chat.partner_id} 
              to={`/chat/${chat.partner_id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ 
                padding: '15px', 
                borderBottom: '1px solid #eee', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fff'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>
                    {chat.partner_name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }}>
                    {chat.last_message}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  {new Date(chat.last_time).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link to="/" style={{ color: '#007bff' }}>ホームに戻る</Link>
      </div>
    </div>
  );
};