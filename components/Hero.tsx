import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { SUMUP_BOOKING_URL } from '../lib/nav';
import Button from './ui/Button';

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
    <section className="relative isolate flex min-h-[calc(100svh-64px)] items-end overflow-hidden bg-black pb-16 md:min-h-[calc(100svh-84px)] md:pb-20">
      <div className="absolute inset-x-0 bottom-0 top-16 z-0 md:top-0">
        {slides.length > 0 ? slides.map((slide, index) => {
          const active = index === currentSlide;
          const mobileSlide = heroData.mobileSlides?.[index] || slide;
          return (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0'}`}>
              <div className="hidden md:block h-full w-full">
                {isVideo(slide) ? (
                  <video src={slide} autoPlay muted loop playsInline className="h-full w-full object-contain bg-black" />
                ) : (
                  <img src={slide} alt="London Karaoke Club Soho" width={1920} height={1080} className="h-full w-full object-contain bg-black" loading={index === 0 ? 'eager' : 'lazy'} />
                )}
              </div>
              <div className="md:hidden block h-full w-full bg-black">
                {isVideo(mobileSlide) ? (
                  <video src={mobileSlide} autoPlay muted loop playsInline className="h-full w-full object-cover object-center" />
                ) : (
                  <img src={mobileSlide} alt="London Karaoke Club Soho" width={1080} height={1920} className="h-full w-full object-cover object-center" loading={index === 0 ? 'eager' : 'lazy'} />
                )}
              </div>
            </div>
          );
        }) : <div className="absolute inset-0 bg-zinc-950" />}
      </div>

      <div className="absolute inset-x-0 bottom-0 top-16 z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.75)_100%)] md:top-0" />

      <div className="relative z-20 mx-auto w-full max-w-[1200px] px-5 md:px-8">
        <div className="mx-auto max-w-[720px] text-center">
          <h1 className="mb-4 text-4xl font-black leading-[1.1] tracking-[-0.02em] text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-pink-300 md:text-5xl md:leading-[1.05]">
            Private Karaoke in Soho
            <span className="block text-yellow-300">Open Until 3am</span>
          </h1>

          <p className="mb-5 text-base leading-6 text-zinc-200 md:text-lg md:leading-7">
            80,000+ songs, updated monthly. Private spaces for 10–50+ guests.
            No chains. No boxes. Just your own club.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer">Book Your Private Room</Button>
            <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer" variant="secondary">Check Availability</Button>
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
