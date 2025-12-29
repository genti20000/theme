
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

// Christmas Icons
const SnowflakeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17 12L21.41 16.41L20 17.83L16.17 14H14V16.17L17.83 20L16.41 21.41L12 17L7.59 21.41L6.17 20L10 16.17V14H7.83L4 17.83L2.59 16.41L7 12L2.59 7.59L4 6.17L7.83 10H10V7.83L6.17 4L7.59 2.59L12 7L16.41 2.59L17.83 4L14 7.83V10H16.17L20 6.17L21.41 7.59L17 12Z"/></svg>
);

const snowflakes = Array.from({ length: 50 }).map((_, i) => {
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
                            <img src={slide} alt="" className="w-full h-full object-cover object-center animate-zoom-slow" />
                        )}
                    </div>
                    {/* Mobile Version */}
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
        <div className="mb-4 inline-block">
           <span className="py-1 px-4 rounded-full bg-red-600/80 backdrop-blur-sm border border-red-400 text-white text-xs md:text-sm font-bold tracking-wider uppercase animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.6)]">
             🎄 {heroData.badgeText} 🎄
           </span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-green-100 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
          {heroData.headingText}
        </h1>
        <p className="mt-6 text-base md:text-xl max-w-2xl mx-auto text-gray-200 font-medium drop-shadow-md">
          {heroData.subText}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-3 px-10 rounded-full border-2 border-white transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.6)]">
            {heroData.buttonText}
            </a>
            <button onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})} className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold py-3 px-10 rounded-full border border-white/20 transition-all">
                Explore LKC
            </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
