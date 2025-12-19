import React, { useState } from 'react';
import { useProductList } from './useProductList';
import { ProductItem } from './ProductItem';
import { ProductSearchBar } from '../ProductSearchBar';
import { Button } from '../../../../components/ui/Button';

type Props = {
  currentUserId: string | null;
};

export const ProductList = ({ currentUserId }: Props) => {
  // total を受け取る
  const { products, total, loading, error, searchProducts, deleteProduct, updateProduct } = useProductList();
  
  // 現在の検索条件を保持
  const [conditions, setConditions] = useState({ keyword: '', sort: 'newest', status: 'all' });
  // 現在のページ番号
  const [page, setPage] = useState(1);

  const handleSearch = (keyword: string, sort: string, status: string) => {
    setConditions({ keyword, sort, status });
    setPage(1); // 検索条件が変わったら1ページ目に戻す
    searchProducts({ keyword, sort, status, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // 現在の条件を維持したままページだけ変える
    searchProducts({ ...conditions, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 上に戻る
  };

  if (error) return <p style={{ color: 'red' }}>エラー: {error}</p>;

  // ページ計算
  const limit = 20; // バックエンドと合わせる
  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <ProductSearchBar onSearch={handleSearch} />

      {loading ? (
        <p style={{textAlign: 'center', margin: '40px 0'}}>読み込み中...</p>
      ) : products.length === 0 ? (
        <p style={{textAlign: 'center', margin: '40px 0'}}>商品が見つかりませんでした。</p>
      ) : (
        <>
          <p style={{ fontSize: '12px', color: '#666', textAlign: 'right', marginBottom: '10px' }}>
             {total}件中 {(page - 1) * limit + 1} - {Math.min(page * limit, total)}件を表示
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {products.map((product) => (
              <ProductItem 
                key={product.id} 
                product={product} 
                currentUserId={currentUserId}
                onDelete={deleteProduct}
                onUpdate={updateProduct}
              />
            ))}
          </div>
          
          {/* ページネーションボタン */}
          {totalPages > 1 && (
             <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
               <Button 
                 onClick={() => handlePageChange(page - 1)} 
                 disabled={page <= 1}
                 style={{ width: '100px', backgroundColor: page <= 1 ? '#ccc' : '#007bff' }}
               >
                 前へ
               </Button>
               <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                 {page} / {totalPages}
               </span>
               <Button 
                 onClick={() => handlePageChange(page + 1)} 
                 disabled={page >= totalPages}
                 style={{ width: '100px', backgroundColor: page >= totalPages ? '#ccc' : '#007bff' }}
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