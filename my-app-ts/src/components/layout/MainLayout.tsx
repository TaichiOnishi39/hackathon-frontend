import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useGlobalUnread } from '../../hooks/useGlobalUnread';

export const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalUnreadCount } = useGlobalUnread();

  // ログアウト処理
  const handleLogout = async () => {
    if (window.confirm("ログアウトしますか？")) {
      await signOut(auth);
      navigate('/login');
    }
  };

  // 出品ページ("/sell")にいるときは、出品ボタンを表示しない（邪魔になるため）
  const isSellPage = location.pathname === '/sell';

  return (
    <div style={{ paddingBottom: '80px' /* フッター/FABのために下を空ける */ }}>
      
      {/* --- 共通ヘッダー --- */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        backgroundColor: '#fff', 
        borderBottom: '1px solid #eee',
        padding: '10px 15px',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        {/* ロゴ（クリックでトップへ） */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#333', fontFamily: 'Arial, sans-serif' }}>
            フリフリ
          </h2>
        </Link>

        {/* 右側のアイコン群 */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link to="/messages" className="relative text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
            💬
            {totalUnreadCount > 0 && (
              <span className="absolute top-1 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </span>
            )}
          </Link>
          
          <Link to="/mypage" style={{ textDecoration: 'none', fontSize: '24px' }} title="マイページ">
            👤
          </Link>
          
          <button 
            onClick={handleLogout} 
            style={{ 
              background: 'none', 
              border: '1px solid #ddd', 
              borderRadius: '20px', 
              padding: '4px 10px', 
              fontSize: '10px', 
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ログアウト
          </button>
        </div>
      </header>

      {/* --- 各ページの中身がここに表示される --- */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '15px' }}>
        <Outlet />
      </main>

      {/* --- 共通出品ボタン (出品ページ以外で表示) --- */}
      {!isSellPage && (
        <Link to="/sell" style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          backgroundColor: '#e91e63',
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'white',
          boxShadow: '0 4px 10px rgba(233, 30, 99, 0.4)',
          zIndex: 200,
          fontSize: '10px',
          fontWeight: 'bold'
        }}>
          <span style={{ fontSize: '24px', marginBottom: '-2px' }}>📷</span>
          <span>出品</span>
        </Link>
      )}

    </div>
  );
};