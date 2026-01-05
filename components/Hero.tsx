
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

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

  // Defaults for visibility if not set
  const showBadge = heroData.showBadge !== false;
  const showButtons = heroData.showButtons !== false;

  return (
    <section className="relative h-[90vh] md:h-screen flex flex-col items-center justify-end pb-12 md:pb-24 text-center text-white overflow-hidden bg-black" aria-label="Welcome to London Karaoke Club">
      <style>{`
        @keyframes zoom-slow {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
        }
        .animate-zoom-slow { animation: zoom-slow 20s ease-in-out infinite alternate; }
      `}</style>
      
      <div 
        className="absolute w-full h-[140%] -top-[20%] left-0 z-0 will-change-transform motion-reduce:transform-none" 
        style={{ transform: `translateY(${scrollY * 0.25}px)` }}
      >
        {slides.map((slide, index) => {
             const active = index === currentSlide;
             const mobileSlide = heroData.mobileSlides?.[index] || slide;
             return (
                <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${active ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Desktop Version */}
                    <div className="hidden md:block w-full h-full">
                        {isVideo(slide) ? (
                            <video src={slide} autoPlay muted loop playsInline className="w-full h-full object-cover animate-zoom-slow" />
                        ) : (
                            <img src={slide} alt="LKC Soho Interior" className="w-full h-full object-cover object-center animate-zoom-slow" />
                        )}
                    </div>
                    {/* Mobile Version */}
                    <div className="md:hidden block w-full h-full">
                         {isVideo(mobileSlide) ? (
                            <video src={mobileSlide} autoPlay muted loop playsInline className="w-full h-full object-cover animate-zoom-slow" />
                        ) : (
                            <img src={mobileSlide} alt="LKC Soho Interior Mobile" className="w-full h-full object-cover object-center animate-zoom-slow" />
                        )}
                    </div>
                </div>
             );
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black"></div>
      </div>
      
      <div className="relative z-10 p-6 max-w-5xl mx-auto">
        {showBadge && heroData.badgeText && (
          <div className="mb-4 inline-block">
            <span className="py-1 px-4 rounded-full bg-red-600/80 backdrop-blur-sm border border-red-400 text-white text-xs md:text-sm font-bold tracking-wider uppercase animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.6)]">
              {heroData.badgeText}
            </span>
          </div>
        )}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-green-100 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
          {heroData.headingText}
        </h1>
        <p className="mt-6 text-base md:text-xl max-w-2xl mx-auto text-gray-200 font-medium drop-shadow-md">
          {heroData.subText}
        </p>
        
        {showButtons && (
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" title="Book your Soho Karaoke Room" className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-3 px-10 rounded-full border-2 border-white transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.6)]">
              {heroData.buttonText}
              </a>
              <button onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})} className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold py-3 px-10 rounded-full border border-white/20 transition-all">
                  Explore LKC Soho
              </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
