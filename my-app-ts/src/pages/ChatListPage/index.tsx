import React from 'react';
import { Link } from 'react-router-dom';
import { useChatList } from './useChatList';

export const ChatListPage = () => {
  const { chats, loading } = useChatList();

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
        読み込み中...
      </div>
    );
  }

  // 日付フォーマット関数 (今日なら時刻、それ以外なら日付)
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'numeric', day: 'numeric' });
  };

  // アイコン表示ヘルパー
  const renderIcon = (chat: any) => {
    if (chat.partner_image_url) {
      return (
        <img 
          src={chat.partner_image_url} 
          alt={chat.partner_name}
          style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #f0f0f0' }}
        />
      );
    }
    return (
      <div style={{ 
        width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#eee', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        fontSize: '24px', color: '#999', fontWeight: 'bold' 
      }}>
        {chat.partner_name.charAt(0)}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '80px' }}>
      
      {/* ヘッダー */}
      <div style={{ 
        padding: '16px 20px', 
        borderBottom: '1px solid #f0f0f0', 
        backgroundColor: '#fff', 
        position: 'sticky', top: 0, zIndex: 10 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>メッセージ</h2>
          <Link to="/" style={{ fontSize: '14px', color: '#007bff', textDecoration: 'none' }}>ホームへ</Link>
        </div>
      </div>
      
      {chats.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#888' }}>
          <p>メッセージはまだありません。</p>
          <p style={{ fontSize: '13px' }}>気になる商品について質問してみましょう！</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff' }}>
          {chats.map((chat) => (
            <Link 
              key={chat.partner_id} 
              to={`/chat/${chat.partner_id}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div style={{ 
                padding: '12px 16px', 
                display: 'flex', 
                alignItems: 'center',
                gap: '16px',
                transition: 'background-color 0.1s'
              }}
              onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
              >
                {/* 左: アイコン */}
                <div style={{ flexShrink: 0 }}>
                  {renderIcon(chat)}
                </div>

                {/* 中央: 名前とメッセージ */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                      {chat.partner_name}
                    </span>
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      {formatTime(chat.last_time)}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ 
                      fontSize: '14px', 
                      color: chat.unread_count > 0 ? '#333' : '#888',
                      fontWeight: chat.unread_count > 0 ? '600' : 'normal',
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      maxWidth: '85%'
                    }}>
                      {chat.last_message}
                    </div>

                    {/* 未読バッジ */}
                    {chat.unread_count > 0 && (
                      <span style={{
                        backgroundColor: '#e91e63',
                        color: 'white',
                        borderRadius: '10px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        minWidth: '18px',
                        textAlign: 'center',
                        boxShadow: '0 2px 4px rgba(233,30,99,0.3)'
                      }}>
                        {chat.unread_count > 99 ? '99+' : chat.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* 区切り線 (一番下以外) */}
              <div style={{ height: '1px', backgroundColor: '#f5f5f5', marginLeft: '88px' }} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};