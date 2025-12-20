import { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

export const useAuth = () => {
  const auth = getAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true); // ログインか登録かの切り替え
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Googleログイン
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // メールでログイン or 新規登録
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        // ログイン処理
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // 新規登録処理 (Firebase Auth側)
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
      // Firebaseのエラーコードに応じたメッセージ表示などが理想
      setError("認証に失敗しました。メールアドレスやパスワードを確認してください。");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("メールアドレスを入力してください");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success("パスワード再設定メールを送信しました。メールボックスを確認してください。");
      setError(""); // エラー消去
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError("そのメールアドレスは登録されていません");
      } else {
        setError("メール送信に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    isLoginMode, setIsLoginMode,
    loading, error,
    loginWithGoogle,
    handleSubmit,
    handleResetPassword
  };
};