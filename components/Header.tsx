
import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface HeaderProps {
  onNavigate: (page: 'home' | 'menu' | 'drinks' | 'gallery' | 'imageEditor' | 'admin' | 'terms') => void;
}

// Compact Menu Icon for inside the button
const MenuIcon = () => (
  <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
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

  const handleMobileNav = (page: 'home' | 'menu' | 'drinks' | 'gallery' | 'imageEditor') => {
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
              className="relative bg-zinc-900 hover:bg-zinc-800 rounded-full px-5 py-2 md:px-8 md:py-3 border border-zinc-700 transition-all duration-300 hover:border-pink-500 group shadow-[0_0_10px_rgba(0,0,0,0.5)] min-w-[90px] flex justify-center text-decoration-none"
            >
                <span className="text-[10px] md:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 group-hover:text-white transition-colors uppercase tracking-widest whitespace-nowrap">
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
             {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
                <button onClick={() => onNavigate('menu')} className="text-sm font-bold text-gray-300 hover:text-white bg-transparent border-none p-0 tracking-widest transition-colors uppercase">Food Menu</button>
                <button onClick={() => onNavigate('drinks')} className="text-sm font-bold text-gray-300 hover:text-white bg-transparent border-none p-0 tracking-widest transition-colors uppercase">Drinks Menu</button>
                <button onClick={() => onNavigate('gallery')} className="text-sm font-bold text-gray-300 hover:text-white bg-transparent border-none p-0 tracking-widest transition-colors uppercase">Gallery</button>
                <button onClick={handleScrollToFAQ} className="text-sm font-bold text-gray-300 hover:text-white bg-transparent border-none p-0 tracking-widest transition-colors uppercase">FAQs</button>
            </div>

            {/* Mobile Menu Button - Styled exactly like Book Now for symmetry */}
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="md:hidden relative bg-zinc-900 hover:bg-zinc-800 rounded-full px-5 py-2 border border-zinc-700 transition-all duration-300 hover:border-pink-500 group shadow-[0_0_10px_rgba(0,0,0,0.5)] min-w-[90px] flex items-center justify-center"
                aria-label="Menu"
            >
                 <div className={`transition-all duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}>
                    {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                 </div>
            </button>
        </div>
      </div>
      
      {/* Mobile Menu Wings */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] pointer-events-none overflow-hidden z-40">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-500" onClick={() => setIsMenuOpen(false)}></div>
            
            <div className="relative w-full px-4 pt-8 flex justify-between gap-4 pointer-events-none">
                {/* Left Wing */}
                <div className="w-1/2 bg-gradient-to-br from-zinc-900 to-purple-900 border-2 border-white rounded-tl-2xl rounded-tr-sm rounded-bl-[60px] rounded-br-3xl p-6 shadow-[0_0_30px_rgba(147,51,234,0.6)] flex flex-col items-center gap-6 animate-wing-left origin-top-right pointer-events-auto">
                    <button onClick={() => handleMobileNav('menu')} className="text-xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors border-b-2 border-transparent hover:border-pink-500 pb-1 animate-item-stagger-1">FOOD MENU</button>
                    <button onClick={() => handleMobileNav('gallery')} className="text-xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors border-b-2 border-transparent hover:border-pink-500 pb-1 animate-item-stagger-2">GALLERY</button>
                    <button onClick={handleScrollToFAQ} className="text-xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors border-b-2 border-transparent hover:border-pink-500 pb-1 animate-item-stagger-3">FAQs</button>
                </div>

                {/* Right Wing */}
                <div className="w-1/2 bg-gradient-to-bl from-zinc-900 to-purple-900 border-2 border-white rounded-tr-2xl rounded-tl-sm rounded-br-[60px] rounded-bl-3xl p-6 shadow-[0_0_30px_rgba(147,51,234,0.6)] flex flex-col items-center gap-6 animate-wing-right origin-top-left pointer-events-auto">
                    <button onClick={() => handleMobileNav('drinks')} className="text-xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors border-b-2 border-transparent hover:border-pink-500 pb-1 animate-item-stagger-1">DRINKS MENU</button>
                    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-xl font-black tracking-wider text-yellow-400 hover:text-yellow-300 transition-colors border-b-2 border-transparent hover:border-yellow-400 pb-1 animate-item-stagger-2">BOOK NOW</a>
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
