import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

type Props = {
  onSearch: (keyword: string) => void;
};

export const ProductSearchBar = ({ onSearch }: Props) => {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    // 親から渡された検索関数を実行
    onSearch(keyword);
  };

  // エンターキーでも検索できるようにする
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'flex-end' }}>
      <div style={{ flex: 1 }}>
        <Input
          label="商品検索" // ラベルはお好みで
          placeholder="キーワードを入力 (例: りんご)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown} // エンターキー対応
        />
      </div>
      <Button 
        onClick={handleSearch}
        style={{ height: '40px', marginBottom: '2px' }} // Inputと高さを合わせる調整
      >
        検索
      </Button>
    </div>
  );
};