
import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface HeaderProps {
  onNavigate: (page: 'home' | 'menu' | 'drinks' | 'gallery' | 'imageEditor' | 'admin' | 'terms' | 'songs' | 'events' | 'blog') => void;
}

const MenuIcon = () => (
  <svg className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="6" width="18" height="2" rx="1" />
    <rect x="3" y="11" width="18" height="2" rx="1" />
    <rect x="3" y="16" width="12" height="2" rx="1" />
    <path d="M19 6V16C19 17.6569 17.6569 19 16 19C14.3431 19 13 17.6569 13 16C13 14.3431 14.3431 13 16 13C16.8284 13 17.58 13.3358 18.1213 13.8787L19 13V6H3" fill="none" />
    <circle cx="16" cy="17" r="3" />
    <rect x="18" y="5" width="2" height="12" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { headerData } = useData();
  
  const BOOKING_URL = "https://squareup.com/appointments/book/aijx16oiq683tl/LCK48B0G6CF51/services";

  const handleNav = (page: any) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  // Improved fallback logic: Use headerData.navOrder if it's an array with items, otherwise use default
  const navLinks = (headerData.navOrder && headerData.navOrder.length > 0) 
    ? headerData.navOrder 
    : ["menu", "gallery", "blog", "drinks", "events", "songs"];

  const half = Math.ceil(navLinks.length / 2);
  const leftLinks = navLinks.slice(0, half);
  const rightLinks = navLinks.slice(half);

  const getLabel = (key: string) => {
      switch(key) {
          case 'menu': return 'FOOD MENU';
          case 'gallery': return 'GALLERY';
          case 'blog': return 'BLOG';
          case 'drinks': return 'DRINKS';
          case 'events': return 'EVENTS';
          case 'songs': return 'SONGS';
          default: return key.toUpperCase();
      }
  };

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl shadow-2xl border-b border-zinc-900">
      <style>{`
        @keyframes wing-enter-left {
          0% { opacity: 0; transform: translateX(-50px) skewX(-15deg) scale(0.9); }
          100% { opacity: 1; transform: translateX(0) skewX(0) scale(1); }
        }
        @keyframes wing-enter-right {
          0% { opacity: 0; transform: translateX(50px) skewX(15deg) scale(0.9); }
          100% { opacity: 1; transform: translateX(0) skewX(0) scale(1); }
        }
        @keyframes item-slide-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-wing-left { animation: wing-enter-left 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-wing-right { animation: wing-enter-right 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>

      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Book Now */}
        <div className="flex-1 flex justify-start items-center">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="relative bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-300 hover:to-pink-400 rounded-full px-5 py-2 md:px-7 md:py-2.5 transition-all duration-300 shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] flex justify-center group">
                <span className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest whitespace-nowrap">Book Now</span>
            </a>
        </div>

        {/* Center: Desktop Links + Logo */}
        <div className="flex items-center gap-10">
            {/* Desktop Navigation Wing (Left Part) */}
            <nav className="hidden lg:flex items-center gap-6">
                {leftLinks.map(link => (
                    <button key={link} onClick={() => onNavigate(link as any)} className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-pink-500 transition-colors">{getLabel(link)}</button>
                ))}
            </nav>

            <button onClick={() => onNavigate('home')} className="focus:outline-none z-10 transition-transform duration-300 hover:scale-105">
                <div className="w-14 h-14 md:w-20 md:h-20 relative flex items-center justify-center">
                    <img src={headerData.logoUrl} alt="LKC Logo" className="w-full h-full object-contain drop-shadow-lg" />
                </div>
            </button>

            {/* Desktop Navigation Wing (Right Part) */}
            <nav className="hidden lg:flex items-center gap-6">
                {rightLinks.map(link => (
                    <button key={link} onClick={() => onNavigate(link as any)} className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-pink-500 transition-colors">{getLabel(link)}</button>
                ))}
            </nav>
        </div>

        {/* Right: Menu Toggle */}
        <div className="flex-1 flex justify-end items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="relative bg-zinc-900 hover:bg-zinc-800 rounded-full px-5 py-2 md:px-6 md:py-2 border border-zinc-800 transition-all duration-300 hover:border-pink-500 group shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center h-[40px] md:h-[45px]"
              aria-label="Toggle Menu"
            >
                 <div className={`transition-all duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}>
                    {isMenuOpen ? <CloseIcon /> : <div className="w-8 h-8 flex items-center justify-center"><MenuIcon /></div>}
                 </div>
            </button>
        </div>
      </div>

      {/* Fly Menu Overlay (The "Fly Menu") */}
      {isMenuOpen && (
        <div className="fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] pointer-events-none overflow-hidden z-40">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-auto transition-opacity duration-500" onClick={() => setIsMenuOpen(false)}></div>
            <div className="relative w-full px-4 pt-8 flex justify-between gap-4 pointer-events-none max-w-5xl mx-auto">
                {/* Left Wing */}
                <div className="w-1/2 bg-zinc-900 border-2 border-zinc-800 rounded-tl-3xl rounded-tr-lg rounded-bl-[80px] rounded-br-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center gap-6 animate-wing-left origin-top-right pointer-events-auto">
                    {leftLinks.map((link, idx) => (
                        <button key={link} onClick={() => handleNav(link as any)} style={{animationDelay: `${0.1 + idx*0.1}s`}} className="text-xl md:text-3xl font-black tracking-widest text-zinc-100 hover:text-pink-500 transition-all animate-item-slide-up opacity-0 fill-mode-forwards hover:scale-110 uppercase italic">{getLabel(link)}</button>
                    ))}
                </div>
                {/* Right Wing */}
                <div className="w-1/2 bg-zinc-900 border-2 border-zinc-800 rounded-tr-3xl rounded-tl-lg rounded-br-[80px] rounded-bl-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center gap-6 animate-wing-right origin-top-left pointer-events-auto">
                    {rightLinks.map((link, idx) => (
                        <button key={link} onClick={() => handleNav(link as any)} style={{animationDelay: `${0.1 + idx*0.1}s`}} className="text-xl md:text-3xl font-black tracking-widest text-zinc-100 hover:text-pink-500 transition-all animate-item-slide-up opacity-0 fill-mode-forwards hover:scale-110 uppercase italic">{getLabel(link)}</button>
                    ))}
                    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-xl md:text-3xl font-black tracking-widest text-yellow-400 hover:text-yellow-300 transition-all animate-item-slide-up opacity-0 fill-mode-forwards hover:scale-110 uppercase italic" style={{animationDelay: `${0.1 + rightLinks.length*0.1}s`}}>BOOK NOW</a>
                </div>
            </div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-zinc-700 animate-pulse"></div>
        </div>
      )}
    </header>
  );
};

export default Header;
