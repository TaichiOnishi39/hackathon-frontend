import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { settings, toggleShowDescription, toggleSubscription } = useSettings();

  const handleToggleSubscription = () => {
    if (settings.isSubscribed) {
      // 既に加入している場合 -> 解約の確認
      if (window.confirm("本当にフリフリプレミアムを解約しますか？\n（履歴の完全削除など様々な機能が使えなくなります）")) {
        toggleSubscription();
        alert("解約しました。");
      }
    } else {
      // 未加入の場合 -> 加入の確認
      if (window.confirm("フリフリプレミアムに加入しますか？")) {
        toggleSubscription();
        alert("加入しました！🎉\n様々な機能が使えるようになりました。");
      }
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ border: 'none', background: 'none', color: '#666', cursor: 'pointer', marginBottom: '20px', fontSize: '16px' }}
      >
        &lt; 戻る
      </button>

      <h1 style={{ fontSize: '24px', marginBottom: '30px' }}>アプリ設定</h1>

      <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>

        {/* 商品説明の表示設定 */}
        <div 
          onClick={toggleShowDescription}
          style={{ 
            padding: '20px', 
            borderBottom: '1px solid #f0f0f0', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: '#fff'
          }}
        >
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>商品一覧に詳細を表示</div>
            <div style={{ fontSize: '12px', color: '#888' }}>一覧画面で商品説明文を表示します</div>
          </div>
          
          {/* トグルスイッチ風のUI */}
          <div style={{ 
            width: '50px', 
            height: '28px', 
            backgroundColor: settings.showDescription ? '#34C759' : '#e9e9ea', 
            borderRadius: '14px', 
            position: 'relative',
            transition: 'background-color 0.2s'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#fff',
              borderRadius: '50%',
              position: 'absolute',
              top: '2px',
              left: settings.showDescription ? '24px' : '2px',
              transition: 'left 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </div>
        </div>

        {/* ★追加: プレミアムプラン設定 */}
        <div 
          onClick={handleToggleSubscription}
          style={{ 
            padding: '20px', 
            // borderBottom: '1px solid #f0f0f0', // さらに下に項目を足す場合はコメントアウトを外してください
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            cursor: 'pointer',
            // 加入中は少しリッチな色（薄い黄色）にする
            backgroundColor: settings.isSubscribed ? '#fff8e1' : '#fff'
          }}
        >
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                フリフリプレミアム 
                {settings.isSubscribed && (
                  <span style={{ fontSize:'12px', background:'#ffc107', padding:'2px 6px', borderRadius:'4px', color:'#000', fontWeight:'bold' }}>
                    PRO
                  </span>
                )}
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>様々な機能がご利用できます</div>
          </div>
          
          {/* トグルスイッチ (黄色) */}
          <div style={{ 
            width: '50px', 
            height: '28px', 
            backgroundColor: settings.isSubscribed ? '#ffc107' : '#e9e9ea', 
            borderRadius: '14px', 
            position: 'relative',
            transition: 'background-color 0.2s'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#fff',
              borderRadius: '50%',
              position: 'absolute',
              top: '2px',
              left: settings.isSubscribed ? '24px' : '2px',
              transition: 'left 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </div>
        </div>

      </div>
    </div>
  );
};