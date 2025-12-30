
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

  // 1. Define hardcoded "Source of Truth" links to ensure the menu is NEVER empty
  const defaultLinks = ["home", "menu", "drinks", "gallery", "songs", "events", "blog", "imageEditor"];
  
  // 2. Merge CMS links with defaults, ensuring no duplicates and filtering out empty strings
  const rawLinks = (headerData.navOrder && headerData.navOrder.length > 0) 
    ? headerData.navOrder 
    : defaultLinks;

  // Filter out any broken data and ensure essential pages are present
  const navLinks = Array.from(new Set(["home", ...rawLinks, "imageEditor"]))
    .filter(link => link && typeof link === 'string' && link.trim() !== "");

  const half = Math.ceil(navLinks.length / 2);
  const leftLinks = navLinks.slice(0, half);
  const rightLinks = navLinks.slice(half);

  const getLabel = (key: string) => {
      switch(key.toLowerCase()) {
          case 'home': return 'HOME';
          case 'menu': return 'FOOD MENU';
          case 'gallery': return 'GALLERY';
          case 'blog': return 'LATEST NEWS';
          case 'drinks': return 'DRINKS';
          case 'events': return 'EVENTS';
          case 'songs': return 'SONG LIST';
          case 'imageeditor': return 'AI STUDIO';
          default: return key.toUpperCase();
      }
  };

  return (
    <header className="sticky top-0 z-[100] bg-black/95 backdrop-blur-2xl shadow-2xl border-b border-zinc-900">
      <style>{`
        @keyframes wing-enter-left {
          0% { opacity: 0; transform: translateX(-80px) skewX(-10deg); }
          100% { opacity: 1; transform: translateX(0) skewX(0); }
        }
        @keyframes wing-enter-right {
          0% { opacity: 0; transform: translateX(80px) skewX(10deg); }
          100% { opacity: 1; transform: translateX(0) skewX(0); }
        }
        @keyframes item-pop {
          0% { opacity: 0; transform: scale(0.8) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-wing-left { animation: wing-enter-left 0.6s cubic-bezier(0.2, 1, 0.2, 1) forwards; }
        .animate-wing-right { animation: wing-enter-right 0.6s cubic-bezier(0.2, 1, 0.2, 1) forwards; }
        .animate-item-pop { animation: item-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>

      <div className="container mx-auto px-4 py-3 flex items-center justify-between h-[70px] md:h-[100px]">
        {/* Left: Action */}
        <div className="flex-1 flex justify-start items-center">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="relative bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-300 hover:to-pink-400 rounded-full px-5 py-2 md:px-7 md:py-3 transition-all duration-300 shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] flex justify-center group">
                <span className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest whitespace-nowrap">Book Now</span>
            </a>
        </div>

        {/* Center: Branding & Desktop Nav */}
        <div className="flex items-center gap-4 md:gap-12">
            {/* Desktop Left */}
            <nav className="hidden xl:flex items-center gap-8">
                {leftLinks.map(link => (
                    <button key={link} onClick={() => onNavigate(link as any)} className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 hover:text-white transition-all hover:scale-110">{getLabel(link)}</button>
                ))}
            </nav>

            <button onClick={() => handleNav('home')} className="focus:outline-none z-10 transition-all duration-500 hover:scale-110 hover:rotate-3">
                <div className="w-16 h-16 md:w-24 md:h-24 relative flex items-center justify-center">
                    <img src={headerData.logoUrl} alt="LKC Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]" />
                </div>
            </button>

            {/* Desktop Right */}
            <nav className="hidden xl:flex items-center gap-8">
                {rightLinks.map(link => (
                    <button key={link} onClick={() => onNavigate(link as any)} className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 hover:text-white transition-all hover:scale-110">{getLabel(link)}</button>
                ))}
            </nav>
        </div>

        {/* Right: Burger */}
        <div className="flex-1 flex justify-end items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`relative bg-zinc-900/80 backdrop-blur-md rounded-full px-5 py-2 md:px-7 md:py-3 border-2 transition-all duration-300 group flex items-center justify-center gap-3 ${isMenuOpen ? 'border-pink-500 scale-110 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'border-zinc-800'}`}
            >
                 <span className="hidden md:block text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">{isMenuOpen ? 'CLOSE' : 'MENU'}</span>
                 <div className={`transition-transform duration-500 ${isMenuOpen ? 'rotate-90' : ''}`}>
                    {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                 </div>
            </button>
        </div>
      </div>

      {/* FLY OUT MENU OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[70px] md:top-[100px] w-full h-screen z-[999] overflow-hidden">
            {/* Blackout Backdrop */}
            <div 
              className="absolute inset-0 bg-black/95 backdrop-blur-3xl" 
              onClick={() => setIsMenuOpen(false)}
            ></div>
            
            <div className="relative w-full h-full flex flex-col items-center justify-start pt-12 md:pt-24 px-4 pb-40 overflow-y-auto">
                <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-12 w-full max-w-7xl">
                    
                    {/* Left Wing */}
                    <div className="w-full md:w-1/2 bg-zinc-900/60 border border-white/5 rounded-[40px] md:rounded-[80px] p-8 md:p-16 flex flex-col items-center md:items-end gap-6 md:gap-12 animate-wing-left origin-right shadow-2xl">
                        {leftLinks.map((link, idx) => (
                            <button 
                              key={link} 
                              onClick={() => handleNav(link as any)} 
                              style={{animationDelay: `${idx * 0.08}s` }} 
                              className="text-2xl md:text-5xl font-black italic tracking-tighter text-zinc-100 hover:text-pink-500 transition-all animate-item-pop opacity-0 fill-mode-forwards hover:scale-110 uppercase text-center md:text-right"
                            >
                              {getLabel(link)}
                            </button>
                        ))}
                    </div>
                    
                    {/* Right Wing */}
                    <div className="w-full md:w-1/2 bg-zinc-900/60 border border-white/5 rounded-[40px] md:rounded-[80px] p-8 md:p-16 flex flex-col items-center md:items-start gap-6 md:gap-12 animate-wing-right origin-left shadow-2xl">
                        {rightLinks.map((link, idx) => (
                            <button 
                              key={link} 
                              onClick={() => handleNav(link as any)} 
                              style={{animationDelay: `${idx * 0.08}s` }} 
                              className="text-2xl md:text-5xl font-black italic tracking-tighter text-zinc-100 hover:text-pink-500 transition-all animate-item-pop opacity-0 fill-mode-forwards hover:scale-110 uppercase text-center md:text-left"
                            >
                              {getLabel(link)}
                            </button>
                        ))}
                        <a 
                          href={BOOKING_URL} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-2xl md:text-5xl font-black italic tracking-tighter text-yellow-400 hover:text-yellow-300 transition-all animate-item-pop opacity-0 fill-mode-forwards hover:scale-110 uppercase text-center md:text-left border-t border-zinc-800 pt-6 w-full" 
                          style={{animationDelay: `${navLinks.length * 0.08}s` }}
                        >
                          BOOK NOW
                        </a>
                    </div>
                </div>

                {/* Decorative Center Line */}
                <div className="hidden md:flex flex-col items-center absolute left-1/2 top-0 -translate-x-1/2 h-full pointer-events-none opacity-20">
                    <div className="w-px h-full bg-gradient-to-b from-pink-500 via-white to-transparent"></div>
                    <div className="w-4 h-4 rounded-full bg-pink-500 blur-sm animate-pulse absolute top-1/4"></div>
                </div>
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;
