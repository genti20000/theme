import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-zinc-900/80 px-3 py-1 text-[10px] md:text-xs font-black uppercase tracking-[0.08em] text-yellow-300 ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
