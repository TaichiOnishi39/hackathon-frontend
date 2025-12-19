import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useChat } from './useChat';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getAuth } from 'firebase/auth';

export const ChatPage = () => {
  const { messages, inputText, setInputText, sendMessage, loading, partnerId, isSending, partner, unsendMessage, deleteMessage } = useChat();
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
        height: '64px', // 高さを固定して安定させる
        padding: '0 16px', 
        borderBottom: '1px solid #f0f0f0', 
        display: 'flex', 
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)', // 少し透過させてモダンに
        backdropFilter: 'blur(10px)', // すりガラス効果
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
      }}>
        {/* 戻るボタン: 円形のクリックエリアにして押しやすく */}
        <Link 
          to="/messages" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '40px', 
            height: '40px',
            borderRadius: '50%',
            textDecoration: 'none', 
            color: '#666', 
            fontSize: '24px',
            transition: 'background-color 0.2s',
            marginRight: '8px' // 相手情報との間隔
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ‹
        </Link>
        
        {/* 中央: 相手の情報 */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', paddingRight: '48px' /* 戻るボタンの分だけ右に余白を入れて完全中央揃えにする */ }}>
            {partner ? (
                <Link 
                    to={`/users/${partner.id}`} 
                    style={{ 
                      textDecoration: 'none', 
                      color: '#333', 
                      display: 'flex', 
                      flexDirection: 'column', // 上下に並べる
                      alignItems: 'center', 
                      gap: '2px'
                    }}
                >
                    {/* 名前を大きく表示 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {renderPartnerIcon(28)} {/* アイコンは少し小さめに */}
                      <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{partner.name}</h2>
                    </div>
                    {/* サブテキスト */}
                    <span style={{ fontSize: '10px', color: '#007bff', fontWeight: '500' }}>
                      プロフィールを見る &gt;
                    </span>
                </Link>
            ) : (
                <h2 style={{ margin: 0, fontSize: '16px', color: '#ccc' }}>...</h2>
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

              {/* 自分のメッセージの場合、左側に操作ボタンを表示 */}
              {isMe && (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', marginRight: '6px', gap: '2px' }}>
                  {!msg.is_deleted ? (
                    <button 
                      onClick={() => unsendMessage(msg.id)}
                      style={{ border: 'none', background: 'none', color: '#999', fontSize: '10px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      取り消し
                    </button>
                  ) : (
                    <button 
                      onClick={() => deleteMessage(msg.id)}
                      style={{ border: 'none', background: 'none', color: '#dc3545', fontSize: '10px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      削除
                    </button>
                  )}
                </div>
              )}

              <div style={{
                maxWidth: '70%',
                padding: '10px 14px',
                borderRadius: '16px',
                backgroundColor: msg.is_deleted ? '#e4e6eb' : (isMe ? '#0084ff' : '#fff'),
                color: msg.is_deleted ? '#999' : (isMe ? '#fff' : '#000'),
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap'
              }}>

                {/* 商品情報の表示（削除されていない場合のみ） */}
                {!msg.is_deleted && msg.product_id && (
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
            
                {/* ★追加: 削除済みならテキストを変更 */}
                {msg.is_deleted ? "メッセージの送信を取り消しました" : msg.content}

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