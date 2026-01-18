
import React from 'react';
import { Page } from '../lib/nav';

interface AppLinkProps {
  href: Page | string;
  onNavigate?: (page: Page) => void;
  external?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const AppLink: React.FC<AppLinkProps> = ({ href, onNavigate, external, className, onClick, children, style }) => {
  const isInternal = !external && !href.startsWith('http') && onNavigate;

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick();
    if (isInternal) {
      e.preventDefault();
      onNavigate(href as Page);
    }
  };

  if (isInternal) {
    return (
      <a href={`#${href}`} onClick={handleClick} className={className} style={style}>
        {children}
      </a>
    );
  }

  return (
    <a 
      href={href} 
      onClick={onClick} 
      className={className} 
      style={style}
      target="_blank" 
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};
