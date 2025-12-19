import React, { useEffect, useState } from 'react';
import { useUserProductList } from './useUserProductList';
import { ProductItem } from '../ProductList/ProductItem';
import { ProductSearchBar } from '../ProductSearchBar';
import { Button } from '../../../../components/ui/Button';

type Props = {
  userId: string;
  currentUserId: string | null;
};

export const UserProductList = ({ userId, currentUserId }: Props) => {
  const { products, total, loading, fetchUserProducts } = useUserProductList();
  
  const [conditions, setConditions] = useState({ keyword: '', sort: 'newest', status: 'all' });
  const [page, setPage] = useState(1);

  const handleSearch = (keyword: string, sort: string, status: string) => {
    setConditions({ keyword, sort, status });
    setPage(1);
    fetchUserProducts(userId, { keyword, sort, status, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchUserProducts(userId, { ...conditions, page: newPage });
  };

  useEffect(() => {
    // 初期ロード
    fetchUserProducts(userId, { sort: 'newest', status: 'all', page: 1 });
  }, [userId]);

  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <ProductSearchBar onSearch={handleSearch} />

      {loading ? (
        <p>読み込み中...</p>
      ) : products.length === 0 ? (
        <p>商品はありません。</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {products.map(product => (
              <ProductItem 
                key={product.id} 
                product={product} 
                currentUserId={currentUserId} 
              />
            ))}
          </div>

          {totalPages > 1 && (
             <div style={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               gap: '20px',
               marginTop: '40px',
               paddingTop: '24px',
               borderTop: '1px solid #f0f0f0'
             }}>
               <Button
                 onClick={() => handlePageChange(page - 1)}
                 disabled={page <= 1}
                 style={{
                   width: 'auto',
                   padding: '10px 20px', // 少し小さめに
                   fontSize: '14px',
                   fontWeight: 'bold',
                   borderRadius: '24px',
                   backgroundColor: page <= 1 ? '#f8f9fa' : '#fff',
                   color: page <= 1 ? '#adb5bd' : '#007bff',
                   border: `2px solid ${page <= 1 ? '#f8f9fa' : '#007bff'}`,
                   cursor: page <= 1 ? 'not-allowed' : 'pointer',
                   boxShadow: page <= 1 ? 'none' : '0 2px 8px rgba(0, 123, 255, 0.1)',
                   transition: 'all 0.2s ease',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '6px'
                 }}
                 onMouseOver={(e) => {
                    if (page > 1) {
                      e.currentTarget.style.backgroundColor = '#007bff';
                      e.currentTarget.style.color = '#fff';
                    }
                 }}
                 onMouseOut={(e) => {
                    if (page > 1) {
                      e.currentTarget.style.backgroundColor = '#fff';
                      e.currentTarget.style.color = '#007bff';
                    }
                 }}
               >
                 <span style={{ fontSize: '16px' }}>←</span> 前へ
               </Button>

               <span style={{
                 display: 'flex',
                 alignItems: 'center',
                 fontWeight: 'bold',
                 fontSize: '16px',
                 color: '#495057',
                 minWidth: '100px',
                 justifyContent: 'center'
               }}>
                 <span style={{ color: '#212529' }}>{page}</span>
                 <span style={{ margin: '0 10px', color: '#ced4da', fontWeight: 'normal' }}>/</span>
                 <span style={{ color: '#868e96' }}>{totalPages}</span>
               </span>

               <Button
                 onClick={() => handlePageChange(page + 1)}
                 disabled={page >= totalPages}
                 style={{
                   width: 'auto',
                   padding: '10px 20px',
                   fontSize: '14px',
                   fontWeight: 'bold',
                   borderRadius: '24px',
                   backgroundColor: page >= totalPages ? '#f8f9fa' : '#fff',
                   color: page >= totalPages ? '#adb5bd' : '#007bff',
                   border: `2px solid ${page >= totalPages ? '#f8f9fa' : '#007bff'}`,
                   cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                   boxShadow: page >= totalPages ? 'none' : '0 2px 8px rgba(0, 123, 255, 0.1)',
                   transition: 'all 0.2s ease',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '6px'
                 }}
                 onMouseOver={(e) => {
                    if (page < totalPages) {
                      e.currentTarget.style.backgroundColor = '#007bff';
                      e.currentTarget.style.color = '#fff';
                    }
                 }}
                 onMouseOut={(e) => {
                    if (page < totalPages) {
                      e.currentTarget.style.backgroundColor = '#fff';
                      e.currentTarget.style.color = '#007bff';
                    }
                 }}
               >
                 次へ <span style={{ fontSize: '16px' }}>→</span>
               </Button>
             </div>
          )}
        </>
      )}
    </div>
  );
};