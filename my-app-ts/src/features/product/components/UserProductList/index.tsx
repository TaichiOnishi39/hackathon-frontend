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
             <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
               <Button 
                 onClick={() => handlePageChange(page - 1)} 
                 disabled={page <= 1}
                 style={{ width: '80px', padding: '8px', fontSize: '12px', backgroundColor: page <= 1 ? '#ccc' : '#007bff' }}
               >
                 前へ
               </Button>
               <span style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                 {page} / {totalPages}
               </span>
               <Button 
                 onClick={() => handlePageChange(page + 1)} 
                 disabled={page >= totalPages}
                 style={{ width: '80px', padding: '8px', fontSize: '12px', backgroundColor: page >= totalPages ? '#ccc' : '#007bff' }}
               >
                 次へ
               </Button>
             </div>
          )}
        </>
      )}
    </div>
  );
};