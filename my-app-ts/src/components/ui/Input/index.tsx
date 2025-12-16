import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Input = ({ label, ...props }: Props) => (
  <div style={{ marginBottom: '10px' }}>
    {label && <label style={{ display: 'block', fontSize: '12px' }}>{label}</label>}
    <input 
      style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }} 
      {...props} 
    />
  </div>
);