import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, ...props }: Props) => (
  <button 
    style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }} 
    {...props}
  >
    {children}
  </button>
);