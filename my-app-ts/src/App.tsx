import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

// 作成したページをインポート
import { PrivateRoute } from './components/auth/PrivateRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ChatPage } from './pages/ChatPage';
import { ChatListPage } from './pages/ChatListPage';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // ★初期ロード判定用

  // 1. Firebaseのログイン状態を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // 判定完了！
    });
    return () => unsubscribe();
  }, []);

  // 2. 判定が終わるまでは「ロード中」を出す (これがないと一瞬ログイン画面がチラつく)
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* ▼ ルートパス (/) にアクセスした時 */}
        <Route path="/" element={
          user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />

        {/* ▼ ログインページ (/login) */}
        <Route path="/login" element={
          // すでにログインしてるならダッシュボードへ飛ばす
          user ? <Navigate to="/dashboard" /> : <LoginPage />
        } />

        {/* ▼ ダッシュボード (/dashboard) */}
        <Route path="/dashboard" element={
          // ログインしてないならログインページへ飛ばす (ガード)
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />

        {/*  商品詳細ページ (:id が変数になります) */}
        <Route path="/products/:id" element={<ProductDetailPage />} />

        {/*  チャットページ */}
        <Route path="/chat/:userId" element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        } />

        {/* メッセージ一覧ページ */}
        <Route path="/messages" element={
          <PrivateRoute>
            <ChatListPage />
          </PrivateRoute>  
        } />
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;
