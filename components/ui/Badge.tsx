import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[10px] md:text-xs font-black uppercase tracking-[0.08em] text-zinc-100 ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
