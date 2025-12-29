
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const snowflakes = Array.from({ length: 40 }).map((_, i) => {
    const size = Math.random() * 8 + 4;
    const duration = Math.random() * 5 + 5;
    const delay = Math.random() * -10;
    return {
        id: `snow-${i}`,
        style: {
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: Math.random() * 0.5 + 0.3,
            animation: `fall ${duration}s ${delay}s linear infinite`,
        } as React.CSSProperties,
    }
});

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const { heroData } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const BOOKING_URL = "https://squareup.com/appointments/book/aijx16oiq683tl/LCK48B0G6CF51/services";
  const slides = heroData.slides && heroData.slides.length > 0 ? heroData.slides : [heroData.backgroundImageUrl];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const isVideo = (url: string) => url?.toLowerCase().match(/\.(mp4|webm|mov)$/);

  // Stricter visibility logic: toggle must be on AND text must exist
  const showBadge = heroData.showBadge !== false && heroData.badgeText && heroData.badgeText.trim() !== "";
  const showButtons = heroData.showButtons !== false;

  return (
    <section className="relative h-[90vh] md:h-screen flex flex-col items-center justify-end pb-12 md:pb-24 text-center text-white overflow-hidden bg-black" aria-label="Welcome">
      <style>{`
        @keyframes fall {
            0% { transform: translateY(-10vh) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translateY(110vh) translateX(20px); opacity: 0.3; }
        }
        @keyframes zoom-slow {
            0% { transform: scale(1); }
            100% { transform: scale(1.15); }
        }
        .animate-zoom-slow { animation: zoom-slow 20s ease-in-out infinite alternate; }
      `}</style>
      
      <div 
        className="absolute w-full h-[140%] -top-[20%] left-0 z-0 will-change-transform" 
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      >
        {slides.map((slide, index) => {
             const active = index === currentSlide;
             const mobileSlide = heroData.mobileSlides?.[index] || slide;
             return (
                <div key={index} className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${active ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Desktop Background Layer */}
                    <div className="hidden md:block w-full h-full">
                        {isVideo(slide) ? (
                            <video src={slide} autoPlay muted loop playsInline className="w-full h-full object-cover animate-zoom-slow" />
                        ) : (
                            <img src={slide} alt="" className="w-full h-full object-cover object-center animate-zoom-slow" />
                        )}
                    </div>
                    {/* Dedicated Mobile Background Layer */}
                    <div className="md:hidden block w-full h-full">
                         {isVideo(mobileSlide) ? (
                            <video src={mobileSlide} autoPlay muted loop playsInline className="w-full h-full object-cover animate-zoom-slow" />
                        ) : (
                            <img src={mobileSlide} alt="" className="w-full h-full object-cover object-center animate-zoom-slow" />
                        )}
                    </div>
                </div>
             );
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black"></div>
      </div>
      
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          {snowflakes.map(s => (
              <div key={s.id} style={s.style} className="absolute top-[-20px] bg-white rounded-full blur-[1px]" />
          ))}
      </div>

      <div className="relative z-10 p-6 max-w-5xl mx-auto">
        {showBadge && (
          <div className="mb-6 inline-block transform hover:scale-110 transition-transform duration-300">
            <span className="py-2 px-6 rounded-full bg-red-600/90 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm font-black tracking-widest uppercase animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.8)] flex items-center gap-2">
              <span className="text-lg">🎄</span>
              {heroData.badgeText}
              <span className="text-lg">🎄</span>
            </span>
          </div>
        )}
        
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] uppercase italic">
          {heroData.headingText}
        </h1>
        
        <p className="mt-6 text-base md:text-2xl max-w-2xl mx-auto text-gray-200 font-light drop-shadow-md tracking-tight leading-relaxed">
          {heroData.subText}
        </p>
        
        {showButtons && (
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-red-600 hover:bg-white hover:text-red-600 text-white text-lg font-black py-4 px-12 rounded-full border-2 border-white transition-all transform hover:-translate-y-1 shadow-[0_10px_40px_rgba(220,38,38,0.5)] uppercase tracking-widest">
              {heroData.buttonText}
              </a>
              <button 
                onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})} 
                className="w-full sm:w-auto bg-white/10 backdrop-blur-xl hover:bg-white hover:text-black text-white font-black py-4 px-12 rounded-full border border-white/20 transition-all uppercase tracking-widest text-sm"
              >
                  Discover Vibe
              </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
