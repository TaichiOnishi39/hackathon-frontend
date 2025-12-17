import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button'; 

type Props = {
  style?: React.CSSProperties; // 親からスタイルを上書きできるようにしておく
};

export const MessageListButton = ({ style }: Props) => {
  return (
    <Link to="/messages" style={{ textDecoration: 'none', ...style }}>
      <Button 
        style={{ 
          backgroundColor: '#007bff', 
          fontSize: '14px', 
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        <span>💬</span>
        <span>メッセージ一覧</span>
      </Button>
    </Link>
  );
};