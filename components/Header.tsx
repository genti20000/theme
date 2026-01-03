
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

  const handleMobileNav = (page: any) => {
    onNavigate(page);
    setIsMenuOpen(false);
  }

  // Define menu structure based on user request
  const menuStructure = {
    explore: [
      { key: 'home', label: 'HOME', action: () => onNavigate('home') },
      { key: 'gallery', label: 'GALLERY', action: () => onNavigate('gallery') },
      { key: 'blog', label: 'BLOG', action: () => onNavigate('blog') },
      { key: 'menu', label: 'FOOD MENU', action: () => onNavigate('menu') },
      { key: 'drinks', label: 'DRINKS MENU', action: () => onNavigate('drinks') },
    ],
    book: [
      { key: 'book-room', label: 'BOOK A ROOM', action: () => window.open(BOOKING_URL, '_blank') },
      { key: 'special-offers', label: 'SPECIAL OFFERS', action: () => {
          onNavigate('home');
          setTimeout(() => {
            const section = document.getElementById('special-offers');
            if (section) {
              section.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      },
      { key: 'faqs', label: 'FAQS', action: () => {
          // Scroll to FAQ section on home page
          onNavigate('home');
          setTimeout(() => {
            const faqSection = document.querySelector('#faq');
            if (faqSection) {
              faqSection.scrollIntoView({ behavior: 'smooth' });
            } else {
              // If FAQ section is not found on home page, navigate to FAQ component
              onNavigate('home');
            }
          }, 100);
        }
      },
    ],
    events: [
      { key: 'birthday', label: 'BIRTHDAY PARTIES', action: () => onNavigate('events') },
      { key: 'hen-stag', label: 'HEN & STAG DOS', action: () => onNavigate('events') },
      { key: 'corporate', label: 'CORPORATE EVENTS', action: () => onNavigate('events') },
    ],
    lkc: [
      { key: 'about', label: 'ABOUT US', action: () => {
          onNavigate('home');
          // Scroll to About Us section after navigation
          setTimeout(() => {
            const section = document.getElementById('about-section');
            if (section) {
              section.scrollIntoView({ behavior: 'smooth' });
            } else {
              // If the section doesn't exist, just ensure we're on the home page
              window.scrollTo(0, 0);
            }
          }, 100);
        }
      },
      { key: 'contact', label: 'CONTACT & LOCATION', action: () => {
          onNavigate('home');
          // Scroll to Contact section after navigation
          setTimeout(() => {
            const section = document.getElementById('contact-section');
            if (section) {
              section.scrollIntoView({ behavior: 'smooth' });
            } else {
              // If the section doesn't exist, just ensure we're on the home page
              window.scrollTo(0, 0);
            }
          }, 100);
        }
      },
      { key: 'careers', label: 'CAREERS', action: () => {
          onNavigate('home');
          // Scroll to Careers section after navigation
          setTimeout(() => {
            const section = document.getElementById('careers-section');
            if (section) {
              section.scrollIntoView({ behavior: 'smooth' });
            } else {
              // If the section doesn't exist, just ensure we're on the home page
              window.scrollTo(0, 0);
            }
          }, 100);
        }
      },
    ],
    connect: [
      { key: 'instagram', label: 'INSTAGRAM', action: () => window.open('https://instagram.com', '_blank') },
      { key: 'tiktok', label: 'TIKTOK', action: () => window.open('https://tiktok.com', '_blank') },
      { key: 'facebook', label: 'FACEBOOK', action: () => window.open('https://facebook.com', '_blank') },
    ]
  };

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
        .animate-wing-left { animation: wing-enter-left 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-wing-right { animation: wing-enter-right 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
      <div className="container mx-auto px-4 py-4 grid grid-cols-[1fr_auto_1fr] items-center">
        <div className="flex justify-start items-center">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="relative bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-300 hover:to-pink-400 rounded-full px-6 py-2 md:px-8 md:py-3 transition-all duration-300 shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] min-w-[80px] flex justify-center group">
                <span className="text-[12px] md:text-sm font-black text-black uppercase tracking-widest whitespace-nowrap">Book Now</span>
            </a>
        </div>
        <div className="flex justify-center items-center">
            <button onClick={() => onNavigate('home')} className="focus:outline-none z-10 transition-transform duration-300 hover:scale-105">
                <div className="w-16 h-16 md:w-24 md:h-24 relative flex items-center justify-center">
                    <img src={headerData.logoUrl} alt="London Karaoke Club Logo" className="w-full h-full object-contain drop-shadow-lg" />
                </div>
            </button>
        </div>
        <div className="flex justify-end items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative bg-zinc-900 hover:bg-zinc-800 rounded-full px-6 py-2 border border-zinc-700 transition-all duration-300 hover:border-pink-500 group shadow-[0_0_10px_rgba(0,0,0,0.5)] min-w-[80px] flex items-center justify-center h-[42px] md:h-[50px]">
                 <div className={`transition-all duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}>
                    {isMenuOpen ? <CloseIcon /> : <div className="w-8 h-8 flex items-center justify-center"><MenuIcon /></div>}
                 </div>
            </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] pointer-events-none overflow-hidden z-40">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-500" onClick={() => setIsMenuOpen(false)}></div>
            <div className="relative w-full px-4 pt-8 flex justify-between gap-4 pointer-events-none">
                <div className="w-1/2 bg-gradient-to-br from-zinc-900 to-purple-900 border-2 border-white rounded-tl-2xl rounded-tr-sm rounded-bl-[60px] rounded-br-3xl p-6 shadow-[0_0_30px_rgba(147,51,234,0.6)] flex flex-col items-center gap-6 animate-wing-left origin-top-right pointer-events-auto">
                    <h3 className="text-xl md:text-2xl font-black tracking-wider text-pink-400 border-b border-pink-400 w-full text-center pb-2">EXPLORE</h3>
                    {menuStructure.explore.map((item, idx) => (
                        <button 
                            key={item.key} 
                            onClick={() => {
                                item.action();
                                setIsMenuOpen(false);
                            }} 
                            style={{animationDelay: `${0.3 + idx*0.1}s`}} 
                            className="text-xl md:text-2xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors animate-item-slide-up opacity-0 fill-mode-forwards"
                        >
                            {item.label}
                        </button>
                    ))}
                    <h3 className="text-xl md:text-2xl font-black tracking-wider text-pink-400 border-b border-pink-400 w-full text-center pb-2 mt-4">LKC</h3>
                    {menuStructure.lkc.map((item, idx) => (
                        <button 
                            key={item.key} 
                            onClick={() => {
                                item.action();
                                setIsMenuOpen(false);
                            }} 
                            style={{animationDelay: `${0.3 + (menuStructure.explore.length + idx)*0.1}s`}} 
                            className="text-xl md:text-2xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors animate-item-slide-up opacity-0 fill-mode-forwards"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
                <div className="w-1/2 bg-gradient-to-bl from-zinc-900 to-purple-900 border-2 border-white rounded-tr-2xl rounded-tl-sm rounded-br-[60px] rounded-bl-3xl p-6 shadow-[0_0_30px_rgba(147,51,234,0.6)] flex flex-col items-center gap-6 animate-wing-right origin-top-left pointer-events-auto">
                    <h3 className="text-xl md:text-2xl font-black tracking-wider text-pink-400 border-b border-pink-400 w-full text-center pb-2">BOOK</h3>
                    {menuStructure.book.map((item, idx) => (
                        <button 
                            key={item.key} 
                            onClick={() => {
                                item.action();
                                setIsMenuOpen(false);
                            }} 
                            style={{animationDelay: `${0.3 + idx*0.1}s`}} 
                            className="text-xl md:text-2xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors animate-item-slide-up opacity-0 fill-mode-forwards"
                        >
                            {item.label}
                        </button>
                    ))}
                    <h3 className="text-xl md:text-2xl font-black tracking-wider text-pink-400 border-b border-pink-400 w-full text-center pb-2 mt-4">EVENTS</h3>
                    {menuStructure.events.map((item, idx) => (
                        <button 
                            key={item.key} 
                            onClick={() => {
                                item.action();
                                setIsMenuOpen(false);
                            }} 
                            style={{animationDelay: `${0.3 + idx*0.1}s`}} 
                            className="text-xl md:text-2xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors animate-item-slide-up opacity-0 fill-mode-forwards"
                        >
                            {item.label}
                        </button>
                    ))}
                    <h3 className="text-xl md:text-2xl font-black tracking-wider text-pink-400 border-b border-pink-400 w-full text-center pb-2 mt-4">CONNECT</h3>
                    {menuStructure.connect.map((item, idx) => (
                        <button 
                            key={item.key} 
                            onClick={() => {
                                item.action();
                                setIsMenuOpen(false);
                            }} 
                            style={{animationDelay: `${0.3 + (menuStructure.book.length + menuStructure.events.length + idx)*0.1}s`}} 
                            className="text-xl md:text-2xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors animate-item-slide-up opacity-0 fill-mode-forwards"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-white animate-pulse"></div>
        </div>
      )}
    </header>
  );
};

export default Header;
