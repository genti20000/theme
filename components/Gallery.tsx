
import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';

const Gallery: React.FC = () => {
  const { galleryData } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  // Using 'any' to avoid type issues between NodeJS.Timeout and number in different environments
  const timeoutRef = useRef<any>(null);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  const images = galleryData.images;
  const videos = galleryData.videos || [];

  // Auto-play logic
  useEffect(() => {
    if (isPaused || isLightboxOpen || viewMode === 'grid') return;
    
    timeoutRef.current = setTimeout(() => {
        handleNext();
    }, 5000);

    return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isPaused, isLightboxOpen, viewMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) handleNext(); // Swipe Left
    if (diff < -50) handlePrev(); // Swipe Right
    setTouchStart(null);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="bg-black min-h-screen text-white pt-20 pb-24 relative select-none">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-6">
            {galleryData.heading}
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            {galleryData.subtext}
          </p>
          
          <div className="flex justify-center mt-8 gap-4">
              <button 
                onClick={() => setViewMode('carousel')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${viewMode === 'carousel' ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-gray-400 hover:text-white'}`}
              >
                  Carousel View
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-gray-400 hover:text-white'}`}
              >
                  Grid View
              </button>
          </div>
        </div>

        {viewMode === 'carousel' ? (
            <>
                {/* Carousel Container */}
                <div 
                    className="max-w-5xl mx-auto relative group"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Main Image Viewer */}
                    <div className="relative aspect-video md:aspect-[16/9] w-full bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        {/* Image */}
                        <img 
                            src={images[currentIndex].url} 
                            alt={images[currentIndex].caption} 
                            className="w-full h-full object-cover transition-transform duration-700"
                        />
                        
                        {/* Overlay Caption */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12">
                            <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 animate-fade-in-up">{images[currentIndex].caption}</h3>
                            <p className="text-gray-400 text-sm md:text-base">
                                {currentIndex + 1} / {images.length}
                            </p>
                        </div>

                        {/* Fullscreen Trigger */}
                        <button 
                            onClick={() => setIsLightboxOpen(true)}
                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm"
                            title="View Fullscreen"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Arrows */}
                    <button 
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-yellow-400 hover:text-black text-white p-3 md:p-4 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                        aria-label="Previous Slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    
                    <button 
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-yellow-400 hover:text-black text-white p-3 md:p-4 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                        aria-label="Next Slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Thumbnails */}
                <div className="max-w-5xl mx-auto mt-6">
                    <div className="flex gap-4 overflow-x-auto pb-4 px-2 snap-x no-scrollbar justify-start md:justify-center">
                        {images.map((img, idx) => (
                            <button 
                                key={img.id}
                                onClick={() => goToSlide(idx)}
                                className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 snap-center ${
                                    currentIndex === idx 
                                    ? 'border-yellow-400 scale-105 shadow-[0_0_15px_rgba(250,204,21,0.5)]' 
                                    : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                            >
                                <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            </>
        ) : (
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((img, idx) => (
                    <div 
                        key={img.id} 
                        className="relative group aspect-square rounded-2xl overflow-hidden cursor-pointer"
                        onClick={() => {
                            setCurrentIndex(idx);
                            setViewMode('carousel');
                            setIsLightboxOpen(true);
                        }}
                    >
                        <img src={img.url} alt={img.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                            <p className="font-bold text-white">{img.caption}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* Video Section */}
        {videos.length > 0 && (
            <div className="mt-24 max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-zinc-800 flex-1"></div>
                    <h3 className="text-3xl font-bold text-white">Karaoke in Action</h3>
                    <div className="h-px bg-zinc-800 flex-1"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {videos.map((video) => (
                        <div key={video.id} className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-lg group">
                            <div className="relative aspect-video">
                                {video.url.includes('youtube') || video.url.includes('vimeo') ? (
                                     <div className="w-full h-full flex items-center justify-center bg-black">
                                         <p className="text-gray-500 text-sm">External video embedding not supported in this preview.</p>
                                     </div>
                                ) : (
                                    <video 
                                        src={video.url} 
                                        controls 
                                        poster={video.thumbnail}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div className="p-6">
                                <h4 className="font-bold text-xl text-white mb-2">{video.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in-up"
            onClick={() => setIsLightboxOpen(false)}
        >
            <button 
                className="absolute top-6 right-6 text-white hover:text-yellow-400 transition-colors z-50"
                onClick={() => setIsLightboxOpen(false)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            <div className="relative w-full max-w-7xl h-full flex flex-col justify-center items-center" onClick={e => e.stopPropagation()}>
                <img 
                    src={images[currentIndex].url} 
                    alt={images[currentIndex].caption} 
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
                 <p className="text-white mt-4 text-xl font-bold">{images[currentIndex].caption}</p>
                 
                 {/* Lightbox Navigation */}
                 <button 
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-4 text-white hover:text-yellow-400 transition-colors"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-white hover:text-yellow-400 transition-colors"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
