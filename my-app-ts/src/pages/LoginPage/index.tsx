import React from 'react';
import { Link } from 'react-router-dom';
import { AuthForm } from '../../features/user/components/AuthForm';

export const LoginPage = () => {
  return (
    <div style={{ 
      maxWidth: '480px', 
      margin: '0 auto', 
      padding: '20px', 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center' 
    }}>

      {/* ログインカード (AuthFormを囲む枠) */}
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '40px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        textAlign: 'center'
      }}>
        {/* AuthFormを表示 */}
        <AuthForm />
      </div>

    </div>
  );
};