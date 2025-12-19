import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { settings, toggleShowDescription } = useSettings();

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

      </div>
    </div>
  );
};