import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

type Props = {
  children: React.ReactNode;
};

export const PrivateRoute = ({ children }: Props) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    // ログインしていなければログイン画面へ
    return <Navigate to="/login" />;
  }

  // ログインしていれば中身を表示
  return <>{children}</>;
};