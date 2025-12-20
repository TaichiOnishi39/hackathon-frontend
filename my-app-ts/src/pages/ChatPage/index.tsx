import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useChat } from './useChat';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useSettings } from '../../contexts/SettingsContext';

export const ChatPage = () => {
  // ★ targetProduct を受け取る
  const { 
    messages, inputText, setInputText, sendMessage, loading, 
    partnerId, isSending, partner, unsendMessage, deleteMessage, targetProduct 
  } = useChat();

  const navigate = useNavigate();
  const { settings } = useSettings();

  // 自動スクロール用
  const bottomRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);
  useEffect(() => {
    if (loading || messages.length === 0) return;
    if (isFirstLoad.current) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        isFirstLoad.current = false;
      }
  }, [messages, loading]);

  const handleSend = async () => {
    await sendMessage();
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteCheck = async (messageId: string) => {
    if (settings.isSubscribed) {
        await deleteMessage(messageId);
    } else {
        if (window.confirm("履歴の完全な削除にはフリフリプレミアムへの加入が必要です。\n設定ページから加入しますか？")) {
            navigate('/settings');
        }
    }
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
        // height: '64px', // 高さを固定すると商品情報が入った時に崩れるので削除または minHeight にする
        minHeight: '64px',
        padding: '10px 16px', 
        borderBottom: '1px solid #f0f0f0', 
        display: 'flex', 
        flexDirection: 'column', // 商品情報が入るため縦並びを許可
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
      }}>
        
        {/* 上段: 戻るボタンと相手の名前 */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <div style={{ width: '40px' }}> {/* 左側のスペース確保 */}
                <button 
                onClick={() => navigate(-1)} 
                style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '5px', 
                    color: '#666', background: 'none', border: 'none', 
                    cursor: 'pointer', padding: 0, fontSize: '16px'
                }}
                >
                <span>&lt;</span> 戻る
                </button>
            </div>
            
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                {partner ? (
                    <Link 
                        to={`/users/${partner.id}`} 
                        style={{ textDecoration: 'none', color: '#333', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {renderPartnerIcon(28)}
                        <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{partner.name}</h2>
                        </div>
                    </Link>
                ) : (
                    <h2 style={{ margin: 0, fontSize: '16px', color: '#ccc' }}>...</h2>
                )}
            </div>
            <div style={{ width: '40px' }}></div> {/* 右側のバランス用スペース */}
        </div>

        {/* ★追加: 対象商品がある場合は表示 */}
        {targetProduct && (
            <div style={{ 
                marginTop: '10px', 
                padding: '10px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                textDecoration: 'none',
                color: 'inherit'
            }}>
                {targetProduct.image_url ? (
                    <img 
                        src={targetProduct.image_url} 
                        alt={targetProduct.name} 
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', backgroundColor: '#fff' }} 
                    />
                ) : (
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#eee', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📦</div>
                )}
                
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {targetProduct.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#e91e63', fontWeight: 'bold' }}>
                        ¥{targetProduct.price.toLocaleString()}
                    </div>
                </div>

                <Link 
                    to={`/products/${targetProduct.id}`}
                    style={{ 
                        fontSize: '12px', 
                        color: '#007bff', 
                        fontWeight: 'bold', 
                        textDecoration: 'none',
                        border: '1px solid #007bff',
                        padding: '4px 10px',
                        borderRadius: '15px',
                        backgroundColor: '#fff'
                    }}
                >
                    確認する
                </Link>
            </div>
        )}

      </div>

      {/* メッセージ表示エリア */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#f0f2f5' }}>
        {loading ? <p>読み込み中...</p> : messages.map((msg) => {
          const isMe = msg.sender_id !== partnerId; 
          
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
              
              {!isMe && (
                  <div style={{ marginRight: '8px', alignSelf: 'flex-end' }}>
                      {renderPartnerIcon(32)}
                  </div>
              )}

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
                      onClick={() => handleDeleteCheck(msg.id)}
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
            disabled={isSending || !inputText.trim()}
            style={{ 
                padding: '8px 16px',
                backgroundColor: isSending ? '#ccc' : '#007bff',
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