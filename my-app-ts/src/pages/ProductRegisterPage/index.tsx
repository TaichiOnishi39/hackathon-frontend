import React from 'react';
import { Link } from 'react-router-dom';
import { ProductRegisterForm } from '../../features/product/components/ProductRegisterForm';

export const ProductRegisterPage = () => {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#666', textDecoration: 'none' }}>
        &lt; ダッシュボードに戻る
      </Link>
      
      {/* フォームコンポーネントを配置 */}
      <ProductRegisterForm />
    </div>
  );
};