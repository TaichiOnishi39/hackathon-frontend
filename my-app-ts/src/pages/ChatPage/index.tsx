import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from './useChat';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getAuth } from 'firebase/auth';

export const ChatPage = () => {
  const { messages, inputText, setInputText, sendMessage, loading } = useChat();
  const auth = getAuth();
  const navigate = useNavigate();
  // 注: ここでの currentUser.uid は FirebaseのUIDです。
  // バックエンドから返ってくる messages の sender_id はバックエンドの User ID (ULID) なので
  // 本来は「自分のバックエンドID」を知っておく必要があります。
  // ★簡易対応: 
  // 自分のメッセージかどうかを判定するために、APIレスポンスに「これは自分だよフラグ」があるのが理想ですが
  // 今回は「送信したら右に出る」雰囲気を作るため、
  // 「sender_id が partnerId (URLのID) と違うなら自分」とみなします。
  const { partnerId } = useChat();

  // 自動スクロール用
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', height: '90vh', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>チャット</h2>

      {/* 戻るボタン */}
      <div style={{ 
        padding: '10px', 
        borderBottom: '1px solid #ddd', 
        display: 'flex', 
        alignItems: 'center',
        backgroundColor: '#fff' 
      }}>
        <button 
          onClick={() => navigate(-1)} // ★1つ前の画面に戻る
          style={{ 
            marginRight: '15px', 
            border: 'none', 
            background: 'none', 
            fontSize: '20px', 
            cursor: 'pointer',
            color: '#666'
          }}
        >
          &lt; 戻る
        </button>
        <h2 style={{ margin: 0, fontSize: '18px' }}>チャット</h2>
      </div>

      {/* メッセージ表示エリア */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#f0f2f5' }}>
        {loading ? <p>読み込み中...</p> : messages.map((msg) => {
          // 相手(partnerId)からのメッセージでなければ、自分とみなす
          const isMe = msg.sender_id !== partnerId; 
          
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
              <div style={{
                maxWidth: '70%',
                padding: '10px 14px',
                borderRadius: '16px',
                backgroundColor: isMe ? '#0084ff' : '#fff',
                color: isMe ? '#fff' : '#000',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* 入力エリア */}
      <div style={{ padding: '10px', borderTop: '1px solid #ddd', backgroundColor: '#fff', display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <Input 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)}
            placeholder="メッセージを入力..."
            onKeyDown={(e) => { if(e.key === 'Enter') sendMessage(); }}
          />
        </div>
        <Button onClick={sendMessage} style={{ height: '40px' }}>送信</Button>
      </div>
    </div>
  );
};