import React, { useState } from 'react';
import { useProductList } from './useProductList';
import { ProductItem } from './ProductItem';
import { ProductSearchBar } from '../ProductSearchBar';
import { Button } from '../../../../components/ui/Button';
import { useSettings } from '../../../../contexts/SettingsContext';

type Props = {
  currentUserId: string | null;
};

export const ProductList = ({ currentUserId }: Props) => {
  // total を受け取る
  const { products, total, loading, error, searchProducts, deleteProduct, updateProduct } = useProductList();

  const { settings } = useSettings();
  
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
                showDescription={settings.showDescription}
              />
            ))}
          </div>
          
          {/* ページネーションボタン (デザイン変更) */}
          {totalPages > 1 && (
             <div style={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               gap: '24px', // 間隔を広げる
               marginTop: '50px', // 上の余白を広げる
               padding: '24px 0', // 上下のパディングを追加
               borderTop: '1px solid #eee' // 区切り線を追加してエリアを明確に
             }}>
               <Button
                 onClick={() => handlePageChange(page - 1)}
                 disabled={page <= 1}
                 style={{
                   width: 'auto', // 幅を自動調整
                   padding: '12px 24px', // 大きくする
                   fontSize: '16px',
                   fontWeight: 'bold',
                   borderRadius: '30px', // 丸くする
                   // 無効時は薄いグレー、通常は白背景に青枠
                   backgroundColor: page <= 1 ? '#f1f3f5' : '#fff',
                   color: page <= 1 ? '#adb5bd' : '#007bff',
                   border: `2px solid ${page <= 1 ? '#f1f3f5' : '#007bff'}`,
                   cursor: page <= 1 ? 'not-allowed' : 'pointer',
                   boxShadow: page <= 1 ? 'none' : '0 4px 12px rgba(0, 123, 255, 0.15)', // 影をつけて浮かせる
                   transition: 'all 0.3s ease', // 滑らかな変化
                   display: 'flex',
                   alignItems: 'center',
                   gap: '8px'
                 }}
                 // ホバーエフェクト (マウスが乗った時だけ青く塗りつぶす)
                 onMouseOver={(e) => {
                    if (page > 1) {
                      e.currentTarget.style.backgroundColor = '#007bff';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.transform = 'translateY(-2px)'; // 少し浮き上がる
                    }
                 }}
                 onMouseOut={(e) => {
                    if (page > 1) {
                      e.currentTarget.style.backgroundColor = '#fff';
                      e.currentTarget.style.color = '#007bff';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                 }}
               >
                 <span style={{ fontSize: '18px' }}>←</span> 前へ
               </Button>

               <span style={{
                 display: 'flex',
                 alignItems: 'center',
                 fontWeight: 'bold',
                 fontSize: '18px',
                 color: '#495057',
                 minWidth: '120px', // 幅を固定して中央揃えを安定させる
                 justifyContent: 'center',
                 letterSpacing: '1px'
               }}>
                 <span style={{ color: '#212529' }}>{page}</span>
                 <span style={{ margin: '0 12px', color: '#ced4da', fontWeight: 'normal', fontSize: '24px' }}>/</span>
                 <span style={{ color: '#868e96' }}>{totalPages}</span>
               </span>

               <Button
                 onClick={() => handlePageChange(page + 1)}
                 disabled={page >= totalPages}
                 style={{
                   width: 'auto',
                   padding: '12px 24px',
                   fontSize: '16px',
                   fontWeight: 'bold',
                   borderRadius: '30px',
                   backgroundColor: page >= totalPages ? '#f1f3f5' : '#fff',
                   color: page >= totalPages ? '#adb5bd' : '#007bff',
                   border: `2px solid ${page >= totalPages ? '#f1f3f5' : '#007bff'}`,
                   cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                   boxShadow: page >= totalPages ? 'none' : '0 4px 12px rgba(0, 123, 255, 0.15)',
                   transition: 'all 0.3s ease',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '8px'
                 }}
                 onMouseOver={(e) => {
                    if (page < totalPages) {
                      e.currentTarget.style.backgroundColor = '#007bff';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                 }}
                 onMouseOut={(e) => {
                    if (page < totalPages) {
                      e.currentTarget.style.backgroundColor = '#fff';
                      e.currentTarget.style.color = '#007bff';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                 }}
               >
                 次へ <span style={{ fontSize: '18px' }}>→</span>
               </Button>
             </div>
          )}
        </>
      )}
    </div>
  );
};