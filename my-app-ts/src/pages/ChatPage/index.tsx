import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useChat } from './useChat';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getAuth } from 'firebase/auth';

export const ChatPage = () => {
  const { messages, inputText, setInputText, sendMessage, loading, partnerId, isSending, partner } = useChat();
  const auth = getAuth();
  const navigate = useNavigate();
  // 注: ここでの currentUser.uid は FirebaseのUIDです。
  // バックエンドから返ってくる messages の sender_id はバックエンドの User ID (ULID) なので
  // 本来は「自分のバックエンドID」を知っておく必要があります。
  // ★簡易対応: 
  // 自分のメッセージかどうかを判定するために、APIレスポンスに「これは自分だよフラグ」があるのが理想ですが
  // 今回は「送信したら右に出る」雰囲気を作るため、
  // 「sender_id が partnerId (URLのID) と違うなら自分」とみなします。

  // 自動スクロール用
  const bottomRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);
  useEffect(() => {
    if (loading || messages.length === 0) return;
    if (isFirstLoad.current) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        isFirstLoad.current = false; // 一度スクロールしたらフラグを折る
      }
  }, [messages, loading]);

  const handleSend = async () => {
    await sendMessage();
    // 送信してメッセージが増えたタイミングに合わせてスクロール
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const renderPartnerIcon = (size: number) => {
    if (partner?.image_url) {
      return (
        <img 
          src={partner.image_url} 
          alt={partner.name}
          style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid #ddd' }}
        />
      );
    }
    return (
      <div style={{ 
          width: `${size}px`, height: `${size}px`, borderRadius: '50%', backgroundColor: '#eee', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${size/2.5}px`, color: '#666', flexShrink: 0
      }}>
          {partner ? partner.name.charAt(0) : '?'}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', height: '90vh', display: 'flex', flexDirection: 'column' }}>

      {/* ヘッダーエリア */}
      <div style={{ 
        padding: '10px 15px', 
        borderBottom: '1px solid #ddd', 
        display: 'flex', 
        alignItems: 'center',
        backgroundColor: '#fff',
        zIndex: 10
      }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ marginRight: '15px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}
        >
          &lt; 戻る
        </button>
        
        <div style={{ flex: 1 }}>
            {partner ? (
                <Link 
                    to={`/users/${partner.id}`} 
                    style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    {/* ★ヘッダーにもアイコンを表示 */}
                    {renderPartnerIcon(36)}
                    <div>
                        <h2 style={{ margin: 0, fontSize: '16px' }}>{partner.name}</h2>
                        <span style={{ fontSize: '11px', color: '#007bff' }}>プロフィールを見る</span>
                    </div>
                </Link>
            ) : (
                <h2 style={{ margin: 0, fontSize: '18px' }}>...</h2>
            )}
        </div>
      </div>

      {/* メッセージ表示エリア */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#f0f2f5' }}>
        {loading ? <p>読み込み中...</p> : messages.map((msg) => {
          // 相手(partnerId)からのメッセージでなければ、自分とみなす
          const isMe = msg.sender_id !== partnerId; 
          
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
              
              {!isMe && (
                  <div style={{ marginRight: '8px', alignSelf: 'flex-end' }}>
                      {renderPartnerIcon(32)}
                  </div>
              )}

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

                {/* ★追加: 商品情報の表示 */}
                {msg.product_id && (
                  <div style={{ 
                    fontSize: '0.85em', 
                    marginBottom: '8px', 
                    paddingBottom: '8px',
                    borderBottom: '1px solid rgba(0,0,0,0.1)'
                  }}>
                    <span style={{opacity: 0.8, marginRight: '5px'}}>商品:</span>
                    <Link 
                      to={`/products/${msg.product_id}`} 
                      style={{ 
                        color: isMe ? '#fff' : '#007bff', 
                        fontWeight: 'bold',
                        textDecoration: 'underline'
                      }}
                    >
                      {msg.product_name || '商品ページを確認'}
                    </Link>
                  </div>
                )}
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
            disabled={isSending}
            onKeyDown={(e) => { 
                if(e.key === 'Enter' && !e.nativeEvent.isComposing && !isSending) {
                    handleSend(); 
                }
            }}
          />
        </div>

        <button 
            onClick={handleSend} 
            disabled={isSending || !inputText.trim()} // ★送信中または空文字ならボタン無効
            style={{ 
                padding: '8px 16px',
                backgroundColor: isSending ? '#ccc' : '#007bff', // 送信中はグレーアウト
                color: '#fff',
                border: 'none',
                cursor: isSending ? 'not-allowed' : 'pointer'
            }}
        >
            {isSending ? '送信中...' : '送信'}
        </button>
      </div>
    </div>
  );
};