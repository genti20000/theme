import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      {...props}
      className={`w-full min-h-11 rounded-xl border border-zinc-700 bg-zinc-900 px-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-300/30 ${className}`}
    />
  );
};

export default Input;
