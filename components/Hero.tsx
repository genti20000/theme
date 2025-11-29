import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

// Icon Components
const MusicalNoteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4V7h4V3h-6Z"/></svg>
);
const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/></svg>
);
const ChampagneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13 1.07V1h-2v.07C7.67 1.56 5 4.73 5 8.5c0 2.53.94 4.79 2.44 6.44L5 23h14l-2.44-8.06C18.06 13.29 19 11.03 19 8.5c0-3.77-2.67-6.94-6-7.43zM7 9h10c-.17 3.03-1.44 5.3-3.05 6.57l-1.95.88-.02.01-1.93-.87C8.42 14.3 7.17 12.03 7 9z" /></svg>
);
const DiamondIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.16 3l-1.12 1.48L3 10.48l9 10.52l9-10.52l-8.04-6.01zM12 5.48l5.85 4.38L12 18.52L6.15 9.86L12 5.48z" /></svg>
);
const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27z" /></svg>
);
// Christmas Icons
const SnowflakeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17 12L21.41 16.41L20 17.83L16.17 14H14V16.17L17.83 20L16.41 21.41L12 17L7.59 21.41L6.17 20L10 16.17V14H7.83L4 17.83L2.59 16.41L7 12L2.59 7.59L4 6.17L7.83 10H10V7.83L6.17 4L7.59 2.59L12 7L16.41 2.59L17.83 4L14 7.83V10H16.17L20 6.17L21.41 7.59L17 12Z"/></svg>
);
const GiftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-2 .89-2 2v4c0 1.11.89 2 2 2v5c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-5c1.11 0 2-.89 2-2v-5c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15h-4v-2h4v2zm-6-5H8v-2h6v2zm-5 5H5v-2h4v2zm5-8v-2h4v2h-4zm-1-2V6c0-.55.45-1 1-1h1v3h-2zm-4 0h-2V5h1c.55 0 1 .45 1 1v2zm-1 2v2H4V8h4z"/></svg>
);

const particleElements = [
  { type: 'text', content: 'Ho Ho Ho' },
  { type: 'text', content: 'Merry Karaoke' },
  { type: 'text', content: 'Jingle Bells' },
  { type: 'text', content: 'Neon Nights' },
  { type: 'text', content: 'Let it Snow' },
  { type: 'text', content: 'Festive Vibes' },
  { type: 'icon', content: <MusicalNoteIcon className="w-full h-full" /> },
  { type: 'icon', content: <MicrophoneIcon className="w-full h-full" /> },
  { type: 'icon', content: <ChampagneIcon className="w-full h-full" /> },
  { type: 'icon', content: <SnowflakeIcon className="w-full h-full" /> },
  { type: 'icon', content: <GiftIcon className="w-full h-full" /> },
  { type: 'icon', content: <StarIcon className="w-full h-full" /> },
];

// Floating Particles (Rising)
const particles = Array.from({ length: 30 }).map((_, i) => {
    const element = particleElements[Math.floor(Math.random() * particleElements.length)];
    const isText = element.type === 'text';
    const size = isText ? Math.random() * 60 + 20 : Math.random() * 20 + 10;
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * -25;
    const drift = (Math.random() - 0.5) * 200;

    return {
        id: i,
        content: element.content,
        isText,
        style: {
            '--drift': `${drift}px`,
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: isText ? 'auto' : `${size}px`,
            animation: `float-up ${duration}s ${delay}s linear infinite`,
            fontSize: isText ? `${size * 0.4}px` : '0px',
            color: 'rgba(255, 255, 255, 0.6)',
            filter: 'blur(1px)',
        } as React.CSSProperties,
    };
});

// Snowfall Particles (Falling)
const snowflakes = Array.from({ length: 50 }).map((_, i) => {
    const size = Math.random() * 10 + 5;
    const duration = Math.random() * 5 + 5; // 5-10s fall duration
    const delay = Math.random() * -10; // start immediately spread out
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

  // Use slides if available, otherwise fallback to backgroundImageUrl
  const slides = heroData.slides && heroData.slides.length > 0 ? heroData.slides : [heroData.backgroundImageUrl];

  useEffect(() => {
    const handleScroll = () => {
      // Use requestAnimationFrame for smoother updates if needed, but direct state update is usually fine for simple parallax
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Slideshow Logic
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative h-screen flex flex-col items-center justify-end pb-8 md:pb-12 text-center text-white overflow-hidden bg-black">
      <style>{`
        @keyframes fade-in-scale {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fall {
            0% { transform: translateY(-10vh) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translateY(110vh) translateX(20px); opacity: 0.3; }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
      
      {/* Background with Enhanced Parallax 
          - Increased height to 140% and top offset to -20% to allow for larger movement without gaps.
          - Adjusted translate factor to 0.3 for a subtle 'slower than foreground' effect.
      */}
      <div 
        className="absolute w-full h-[140%] -top-[20%] left-0 z-0 will-change-transform" 
        style={{ transform: `translateY(${scrollY * 0.3}px) scale(1.1)` }}
      >
        {slides.map((slide, index) => (
             <img 
                key={index}
                src={slide}
                alt={`Hero Slide ${index + 1}`}
                // Using object-[center_20%] ensures faces (usually in upper 3rd) are preserved on mobile.
                className={`absolute inset-0 w-full h-full object-cover object-[center_20%] transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
             />
        ))}
        {/* Dark overlay with slight wintery tint */}
        <div className="absolute inset-0 bg-black/30"></div>
        {/* Stronger bottom gradient to text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90"></div>
      </div>
      
      {/* Snowfall Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          {snowflakes.map(s => (
              <div 
                key={s.id} 
                style={s.style} 
                className="absolute top-[-20px] bg-white rounded-full blur-[1px]" 
              />
          ))}
      </div>

      {/* Floating Party Particles (Icons & Text) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map(p => (
            <div key={p.id} style={p.style} className="absolute bottom-[-160px] opacity-0 z-0">
            {p.content}
            </div>
        ))}
      </div>

      <div className="relative z-10 p-6 max-w-5xl mx-auto">
        <div className="mb-4 inline-block">
           <span className="py-1 px-4 rounded-full bg-red-600/80 backdrop-blur-sm border border-red-400 text-white text-xs md:text-sm font-bold tracking-wider uppercase animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.6)]">
             🎄 {heroData.badgeText} 🎄
           </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight animate-fade-in-scale text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-green-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {heroData.headingText}
        </h1>
        <p className="mt-4 text-sm md:text-lg max-w-2xl mx-auto text-gray-200 animate-fade-in-up drop-shadow-md" style={{ animationDelay: '0.5s' }}>
          {heroData.subText}
        </p>
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-block mt-6 bg-red-600 hover:bg-red-700 text-white text-base font-bold py-2 px-6 rounded-full border-2 border-white transition-transform duration-300 ease-in-out hover:scale-105 animate-fade-in-up shadow-[0_0_20px_rgba(220,38,38,0.5)]" style={{ animationDelay: '0.8s' }}>
          {heroData.buttonText}
        </a>
      </div>
    </section>
  );
};

export default Hero;