import React from 'react';
import { ProductList } from '../../features/product/components/ProductList';
import { useUserProfile } from '../../features/user/components/UserProfile/useUserProfile';

export const DashboardPage = () => {
  const { userProfile } = useUserProfile();

  return (
    // ヘッダーやボタンは MainLayout にあるので、ここは中身だけでOK
    <div style={{ width: '100%' }}>
        <ProductList currentUserId={userProfile?.id || null} />
    </div>
  );
};