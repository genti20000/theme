import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className = '', children }) => {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.45)] ${className}`}>
      {children}
    </div>
  );
};

export default Card;
