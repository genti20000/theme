import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { SUMUP_BOOKING_URL } from '../lib/nav';
import Button from './ui/Button';
import Badge from './ui/Badge';

const Hero: React.FC = () => {
  const { heroData } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = (heroData.slides && heroData.slides.length > 0 ? heroData.slides : [heroData.backgroundImageUrl]).filter(Boolean);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const isVideo = (url: string) => /\.(mp4|webm|mov)(\?|$)/i.test(url || '');

  return (
    <section className="relative isolate min-h-[88svh] md:min-h-screen flex items-end pb-16 md:pb-20 overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        {slides.length > 0 ? slides.map((slide, index) => {
          const active = index === currentSlide;
          const mobileSlide = heroData.mobileSlides?.[index] || slide;
          return (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0'}`}>
              <div className="hidden md:block h-full w-full">
                {isVideo(slide) ? (
                  <video src={slide} autoPlay muted loop playsInline className="h-full w-full object-cover" />
                ) : (
                  <img src={slide} alt="London Karaoke Club Soho" width={1920} height={1080} className="h-full w-full object-cover" loading={index === 0 ? 'eager' : 'lazy'} />
                )}
              </div>
              <div className="md:hidden block h-full w-full bg-black">
                {isVideo(mobileSlide) ? (
                  <video src={mobileSlide} autoPlay muted loop playsInline className="h-full w-full object-cover" />
                ) : (
                  <img src={mobileSlide} alt="London Karaoke Club Soho" width={1080} height={1920} className="h-full w-full object-cover" loading={index === 0 ? 'eager' : 'lazy'} />
                )}
              </div>
            </div>
          );
        }) : <div className="absolute inset-0 bg-zinc-950" />}
      </div>

      <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(10,10,10,0.35)_0%,rgba(10,10,10,0.75)_52%,rgba(10,10,10,0.95)_100%)]" />

      <div className="relative z-20 container mx-auto px-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.94] tracking-tight text-white">
            Private Karaoke in Soho
            <span className="block text-yellow-300">Open Until 3am</span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm md:text-lg leading-relaxed text-zinc-200">
            80,000+ songs, updated monthly. Private spaces for 10–50+ guests.
            No chains. No boxes. Just your own club.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:items-center">
            <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer">Book Your Private Room</Button>
            <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer" variant="secondary">Check Availability</Button>
            <Badge className="sm:ml-2">★★★★★ 4.9 (128 Google Reviews)</Badge>
          </div>

          <p className="mt-4 text-xs md:text-sm font-semibold text-yellow-200/90 tracking-[0.03em]">
            Fridays & Saturdays sell out 1–2 weeks in advance.
          </p>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 text-zinc-300/80 flex flex-col items-center gap-1 pointer-events-none">
        <span className="text-[10px] uppercase tracking-[0.12em]">Scroll</span>
        <span className="w-px h-6 bg-zinc-300/60" />
      </div>
    </section>
  );
};

export default Hero;
