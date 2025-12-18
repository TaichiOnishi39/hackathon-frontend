import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { useUserProfile } from './features/user/components/UserProfile/useUserProfile';
import { MainLayout } from './components/layout/MainLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage'; 
import { DashboardPage } from './pages/DashboardPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ChatPage } from './pages/ChatPage';
import { ChatListPage } from './pages/ChatListPage';
import { MyPage } from './pages/MyPage';
import { UserPage } from './pages/UserPage';
import { ProductRegisterPage } from './pages/ProductRegisterPage';
import { ProductEditPage } from './pages/ProductEditPage';

// ★新しいガード: プロフィール登録済みかチェックする
const ProfileGuard = () => {
  const { userProfile, loading } = useUserProfile();

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading Profile...</div>;

  // プロフィールがない(404)なら、登録画面へ飛ばす
  if (!userProfile) {
    return <Navigate to="/register" />;
  }

  // プロフィールがあるなら、そのまま子要素(Dashboardなど)を表示
  return <Outlet />;
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading Auth...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* ▼ 未ログインならログイン画面へ */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />

        {/* ▼ ログイン必須のルート群 */}
        {user ? (
          <>
            {/* 1. まずユーザー登録画面 (未登録でもアクセス可能) */}
            <Route path="/register" element={<RegisterPage />} />

            {/* 2. プロフィール登録済みでないと入れないルート群 (ProfileGuardで囲む) */}
            <Route element={<ProfileGuard />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/sell" element={<ProductRegisterPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/chat/:userId" element={<ChatPage />} />
              <Route path="/messages" element={<ChatListPage />} />
              <Route path="/users/:userId" element={<UserPage />} />
              <Route path="/products/:id/edit" element={<ProductEditPage />} />
            </Route>
            </Route>
          </>
        ) : (
          // ログインしてない状態で保護ルートに来たらログインへ
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
