import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

type Props = {
  // キーワード、ソート、ステータスをまとめて親に渡す
  onSearch: (keyword: string, sort: string, status: string) => void;
};

export const ProductSearchBar = ({ onSearch }: Props) => {
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('newest'); // デフォルト
  const [status, setStatus] = useState('all');   // デフォルト

  const handleSearch = () => {
    onSearch(keyword, sort, status);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // プルダウン等のスタイル
  const selectStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    height: '40px',
    backgroundColor: '#fff',
    cursor: 'pointer'
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', // スマホで折り返せるように
      gap: '10px', 
      marginBottom: '20px', 
      alignItems: 'flex-end',
      backgroundColor: '#f9f9f9',
      padding: '15px',
      borderRadius: '8px'
    }}>
      {/* キーワード入力 */}
      <div style={{ flex: '1 1 300px' }}>
        <Input
          label="キーワード検索"
          placeholder="商品名を入力..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* 絞り込み (販売状況) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>絞り込み</label>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          style={selectStyle}
        >
          <option value="all">すべて表示</option>
          <option value="selling">販売中のみ</option>
          <option value="sold">売り切れのみ</option>
        </select>
      </div>

      {/* 並び替え */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>並び替え</label>
        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}
          style={selectStyle}
        >
          <option value="newest">新着順</option>
          <option value="oldest">古い順</option>
          <option value="price_asc">価格が安い順</option>
          <option value="price_desc">価格が高い順</option>
          <option value="likes">いいねが多い順</option>
        </select>
      </div>

      {/* 検索ボタン */}
      <Button 
        onClick={handleSearch}
        style={{ height: '40px', padding: '0 24px' }}
      >
        検索
      </Button>
    </div>
  );
};