
import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../context/DataContext';

const FadeInScrollSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const { current } = domRef;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`${className} transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {children}
    </div>
  );
};

const EventsPage: React.FC = () => {
  const { eventsData } = useData();
  const BOOKING_URL = "https://www.sumupbookings.com/londonkaraokeclub";

  if (!eventsData || !eventsData.hero) return null;

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img src={eventsData.hero.image} alt="Events Hero" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
        </div>
        <div className="relative z-10 text-center px-6">
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-6 drop-shadow-lg animate-fade-in-up">
                {eventsData.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light animate-fade-in-up delay-100">
                {eventsData.hero.subtitle}
            </p>
        </div>
      </div>

      {/* Sections */}
      <div className="container mx-auto px-6 py-12">
        {eventsData.sections && eventsData.sections.map((section, index) => (
            <FadeInScrollSection key={section.id} className={`flex flex-col md:flex-row gap-12 items-center mb-32 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                {/* Image Side */}
                <div className="w-full md:w-1/2">
                    <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-zinc-900">
                        <img 
                            src={section.imageUrl} 
                            alt={section.title} 
                            className="w-full h-[350px] md:h-[500px] object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                </div>

                {/* Text Side */}
                <div className="w-full md:w-1/2 space-y-6">
                    <span className="text-sm font-bold tracking-[0.3em] text-pink-500 uppercase">{section.subtitle}</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">{section.title}</h2>
                    <p className="text-gray-300 text-lg leading-relaxed font-light">
                        {section.description}
                    </p>
                    
                    {/* Features List */}
                    <ul className="space-y-4 pt-4">
                        {section.features && section.features.map((feature, i) => (
                            <li key={i} className="flex items-center text-gray-400 group">
                                <div className="w-6 h-6 rounded-full bg-pink-500/10 flex items-center justify-center mr-4 group-hover:bg-pink-500/20 transition-colors">
                                  <svg className="w-3 h-3 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <div className="pt-8">
                        <a 
                            href={BOOKING_URL} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-block bg-white text-black font-black uppercase tracking-widest text-xs py-4 px-10 rounded-full hover:bg-yellow-400 transition-all shadow-lg hover:scale-105 active:scale-95"
                        >
                            Enquire Now
                        </a>
                    </div>
                </div>
            </FadeInScrollSection>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
