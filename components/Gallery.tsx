
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useData } from '../context/DataContext';

const Gallery: React.FC = () => {
  const { galleryData } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  // Using 'any' to avoid type issues between NodeJS.Timeout and number in different environments
  const timeoutRef = useRef<any>(null);

  // Combine Images and Videos into a single Media List
  const mediaItems = useMemo(() => {
      const imgs = galleryData.images.map(img => ({ ...img, type: 'image' as const, thumbnail: img.url }));
      const vids = (galleryData.videos || []).map(vid => ({ 
          id: vid.id, 
          url: vid.url, 
          caption: vid.title, 
          type: 'video' as const, 
          thumbnail: vid.thumbnail || 'https://via.placeholder.com/800x450?text=Video+Thumbnail' // Fallback
      }));
      return [...imgs, ...vids];
  }, [galleryData]);

  // Reset index if media items change and index is out of bounds
  useEffect(() => {
      if (mediaItems.length > 0 && currentIndex >= mediaItems.length) {
          setCurrentIndex(0);
      }
  }, [mediaItems.length]);

  // Auto-play logic
  useEffect(() => {
    const currentItem = mediaItems[currentIndex];
    // Don't auto-advance if it's a video (let user watch) or if paused/grid/lightbox
    if (isPaused || isLightboxOpen || viewMode === 'grid' || currentItem?.type === 'video') return;
    
    timeoutRef.current = setTimeout(() => {
        handleNext();
    }, 5000);

    return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isPaused, isLightboxOpen, viewMode, mediaItems]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mediaItems.length]);

  const handleNext = () => {
    if (mediaItems.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrev = () => {
    if (mediaItems.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
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

  if (!mediaItems || mediaItems.length === 0) return null;

  const currentItem = mediaItems[currentIndex];

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
                    {/* Main Viewer */}
                    <div className="relative aspect-video md:aspect-[16/9] w-full bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center bg-black">
                        
                        {currentItem.type === 'video' ? (
                            <video 
                                src={currentItem.url} 
                                controls 
                                className="w-full h-full object-contain"
                                poster={currentItem.thumbnail}
                            >
                                <source src={currentItem.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img 
                                src={currentItem.url} 
                                alt={currentItem.caption} 
                                className="w-full h-full object-cover transition-transform duration-700"
                            />
                        )}
                        
                        {/* Overlay Caption (Only show for images or when video controls aren't active/hovered) */}
                        {currentItem.type === 'image' && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12 pointer-events-none">
                                <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 animate-fade-in-up">{currentItem.caption}</h3>
                                <p className="text-gray-400 text-sm md:text-base">
                                    {currentIndex + 1} / {mediaItems.length}
                                </p>
                            </div>
                        )}

                        {/* Fullscreen Trigger */}
                        <button 
                            onClick={() => setIsLightboxOpen(true)}
                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm z-20"
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
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-yellow-400 hover:text-black text-white p-3 md:p-4 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 z-20"
                        aria-label="Previous Slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    
                    <button 
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-yellow-400 hover:text-black text-white p-3 md:p-4 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 z-20"
                        aria-label="Next Slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Thumbnails */}
                <div className="max-w-5xl mx-auto mt-6">
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {mediaItems.map((item, index) => (
                            <button 
                                key={item.id} 
                                onClick={() => goToSlide(index)}
                                className={`relative flex-shrink-0 w-24 h-16 md:w-32 md:h-20 rounded-lg overflow-hidden transition-all duration-300 ${index === currentIndex ? 'ring-2 ring-yellow-400 scale-105' : 'opacity-60 hover:opacity-100'}`}
                            >
                                <img src={item.thumbnail} alt={item.caption} className="w-full h-full object-cover" />
                                {item.type === 'video' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <div className="bg-black/50 rounded-full p-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </>
        ) : (
            /* Grid View */
            <div className="max-w-7xl mx-auto columns-1 md:columns-3 gap-6 space-y-6">
                {mediaItems.map((item, index) => (
                    <div key={item.id} className="break-inside-avoid bg-zinc-900 rounded-2xl overflow-hidden shadow-lg border border-zinc-800 hover:border-yellow-400 transition-all duration-300 group cursor-pointer" onClick={() => { setViewMode('carousel'); goToSlide(index); }}>
                        <div className="relative">
                            <img src={item.thumbnail} alt={item.caption} className="w-full h-auto object-cover" />
                            {item.type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                <p className="text-white font-bold">{item.caption}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && currentItem && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setIsLightboxOpen(false)}>
            <div className="relative max-w-7xl w-full max-h-[90vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                {currentItem.type === 'video' ? (
                    <video controls autoPlay className="max-w-full max-h-[85vh] rounded-lg shadow-2xl">
                        <source src={currentItem.url} type="video/mp4" />
                    </video>
                ) : (
                    <img src={currentItem.url} alt={currentItem.caption} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
                )}
                <p className="text-white text-xl mt-4 font-bold">{currentItem.caption}</p>
                
                <button 
                    onClick={() => setIsLightboxOpen(false)}
                    className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
