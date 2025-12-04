
import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface HeaderProps {
  onNavigate: (page: 'home' | 'menu' | 'drinks' | 'gallery' | 'imageEditor' | 'admin' | 'terms' | 'songs') => void;
}

// Stylized Musical Note Menu Icon (Three lines forming a note)
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

  const handleMobileNav = (page: 'home' | 'menu' | 'drinks' | 'gallery' | 'imageEditor' | 'songs') => {
    onNavigate(page);
    setIsMenuOpen(false);
  }

  const handleScrollToFAQ = () => {
    onNavigate('home');
    setIsMenuOpen(false);
    // Small delay to ensure route change/render if needed before scrolling
    setTimeout(() => {
        const faqSection = document.getElementById('faq');
        if (faqSection) {
            faqSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-50 bg-black shadow-2xl border-b border-zinc-900">
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
        .animate-wing-left {
          animation: wing-enter-left 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-wing-right {
          animation: wing-enter-right 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-item-stagger-1 {
          animation: item-slide-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s forwards;
          opacity: 0;
        }
        .animate-item-stagger-2 {
          animation: item-slide-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s forwards;
          opacity: 0;
        }
        .animate-item-stagger-3 {
          animation: item-slide-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s forwards;
          opacity: 0;
        }
        .animate-item-stagger-4 {
          animation: item-slide-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s forwards;
          opacity: 0;
        }
      `}</style>
      <div className="container mx-auto px-4 py-4 grid grid-cols-[1fr_auto_1fr] items-center">
        
        {/* Left Section - Book Now Button */}
        <div className="flex justify-start items-center">
            <a 
              href={BOOKING_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-300 hover:to-pink-400 rounded-full px-6 py-2 md:px-8 md:py-3 transition-all duration-300 shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] min-w-[80px] flex justify-center group"
            >
                <span className="text-[12px] md:text-sm font-black text-black uppercase tracking-widest whitespace-nowrap">
                    Book Now
                </span>
            </a>
        </div>

        {/* Center Section - Logo */}
        <div className="flex justify-center items-center">
            <button onClick={() => onNavigate('home')} className="focus:outline-none z-10 transition-transform duration-300 hover:scale-105">
                <div className="w-16 h-16 md:w-24 md:h-24 relative flex items-center justify-center">
                    <img 
                    src={headerData.logoUrl} 
                    alt="London Karaoke Club Logo" 
                    className="w-full h-full object-contain drop-shadow-lg" 
                    />
                </div>
            </button>
        </div>
        
        {/* Right Section - Menu */}
        <div className="flex justify-end items-center">
            {/* Menu Button - Visible on ALL screens now */}
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="relative bg-zinc-900 hover:bg-zinc-800 rounded-full px-6 py-2 border border-zinc-700 transition-all duration-300 hover:border-pink-500 group shadow-[0_0_10px_rgba(0,0,0,0.5)] min-w-[80px] flex items-center justify-center h-[42px] md:h-[50px]"
                aria-label="Menu"
            >
                 <div className={`transition-all duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}>
                    {isMenuOpen ? <CloseIcon /> : <div className="w-8 h-8 flex items-center justify-center"><MenuIcon /></div>}
                 </div>
            </button>
        </div>
      </div>
      
      {/* Menu Wings - Visible on ALL screens now */}
      {isMenuOpen && (
        <div className="fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] pointer-events-none overflow-hidden z-40">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-500" onClick={() => setIsMenuOpen(false)}></div>
            
            <div className="relative w-full px-4 pt-8 flex justify-between gap-4 pointer-events-none">
                {/* Left Wing */}
                <div className="w-1/2 bg-gradient-to-br from-zinc-900 to-purple-900 border-2 border-white rounded-tl-2xl rounded-tr-sm rounded-bl-[60px] rounded-br-3xl p-6 shadow-[0_0_30px_rgba(147,51,234,0.6)] flex flex-col items-center gap-6 animate-wing-left origin-top-right pointer-events-auto">
                    <button onClick={() => handleMobileNav('menu')} className="text-xl md:text-3xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors border-b-2 border-transparent hover:border-pink-500 pb-1 animate-item-stagger-1">FOOD MENU</button>
                    <button onClick={() => handleMobileNav('gallery')} className="text-xl md:text-3xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors border-b-2 border-transparent hover:border-pink-500 pb-1 animate-item-stagger-2">GALLERY</button>
                    <button onClick={() => handleMobileNav('songs')} className="text-xl md:text-3xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors border-b-2 border-transparent hover:border-pink-500 pb-1 animate-item-stagger-3">SONGS</button>
                </div>

                {/* Right Wing */}
                <div className="w-1/2 bg-gradient-to-bl from-zinc-900 to-purple-900 border-2 border-white rounded-tr-2xl rounded-tl-sm rounded-br-[60px] rounded-bl-3xl p-6 shadow-[0_0_30px_rgba(147,51,234,0.6)] flex flex-col items-center gap-6 animate-wing-right origin-top-left pointer-events-auto">
                    <button onClick={() => handleMobileNav('drinks')} className="text-xl md:text-3xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors border-b-2 border-transparent hover:border-pink-500 pb-1 animate-item-stagger-1">DRINKS MENU</button>
                    <button onClick={handleScrollToFAQ} className="text-xl md:text-3xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors border-b-2 border-transparent hover:border-pink-500 pb-1 animate-item-stagger-2">FAQs</button>
                    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-xl md:text-3xl font-black tracking-wider text-yellow-400 hover:text-yellow-300 transition-colors border-b-2 border-transparent hover:border-yellow-400 pb-1 animate-item-stagger-3">BOOK NOW</a>
                </div>
            </div>
            
             {/* Central Decorative Tail */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] animate-pulse"></div>
        </div>
      )}
    </header>
  );
};

export default Header;
