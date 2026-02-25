import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className = '', children }) => {
  return (
    <div className={`rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.35)] ${className}`}>
      {children}
    </div>
  );
};

export default Card;
