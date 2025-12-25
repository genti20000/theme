
import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '../context/DataContext';

const Gallery: React.FC = () => {
  const { galleryData, isDataLoading } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const images = galleryData.images || [];

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    if (viewMode === 'carousel' && images.length > 0 && lightboxIndex === null) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [viewMode, images.length, lightboxIndex]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsZoomed(false);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    setIsZoomed(false);
    document.body.style.overflow = 'auto';
  }, []);

  const nextLightboxImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
      setIsZoomed(false);
    }
  }, [lightboxIndex, images.length]);

  const prevLightboxImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
      setIsZoomed(false);
    }
  }, [lightboxIndex, images.length]);

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, nextLightboxImage, prevLightboxImage]);

  if (isDataLoading && images.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
        <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Loading Gallery...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-24 relative select-none">
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-gallery-item { animation: fadeInScale 0.6s ease-out forwards; }
        
        .lightbox-overlay {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">{galleryData.heading}</h2>
          <p className="text-gray-400 text-lg mb-8">{galleryData.subtext}</p>
          <div className="flex justify-center gap-4 bg-zinc-900/50 p-1 rounded-full w-max mx-auto border border-zinc-800">
            <button 
              onClick={() => setViewMode('carousel')} 
              className={`px-8 py-2 rounded-full text-xs font-black tracking-widest uppercase transition-all ${viewMode === 'carousel' ? 'bg-yellow-400 text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Carousel
            </button>
            <button 
              onClick={() => setViewMode('grid')} 
              className={`px-8 py-2 rounded-full text-xs font-black tracking-widest uppercase transition-all ${viewMode === 'grid' ? 'bg-yellow-400 text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Grid
            </button>
          </div>
        </div>

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, idx) => (
              <div 
                key={img.id} 
                onClick={() => openLightbox(idx)}
                className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 animate-gallery-item group shadow-2xl cursor-pointer"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {!loadedImages[img.id] && <div className="absolute inset-0 animate-pulse bg-zinc-800"></div>}
                <img 
                  src={img.url} 
                  alt={img.caption} 
                  onLoad={() => handleImageLoad(img.id)}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${loadedImages[img.id] ? 'opacity-100' : 'opacity-0'}`} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
                  <p className="text-white font-bold text-sm tracking-wide">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {viewMode === 'carousel' && images.length > 0 && (
          <div className="max-w-5xl mx-auto group">
            <div className="relative aspect-video md:aspect-[21/9] bg-zinc-900 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(250,204,21,0.1)] border border-zinc-800 cursor-pointer" onClick={() => openLightbox(currentIndex)}>
              <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {images.map((img, i) => (
                  <img key={i} src={img.url} className="w-full h-full object-cover flex-shrink-0" alt="" />
                ))}
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentIndex((currentIndex - 1 + images.length) % images.length); }} 
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-yellow-400 hover:text-black border border-white/10"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentIndex((currentIndex + 1) % images.length); }} 
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-yellow-400 hover:text-black border border-white/10"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
              </button>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                    className={`h-1.5 rounded-full transition-all ${currentIndex === i ? 'w-8 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 'w-2 bg-white/30 hover:bg-white/50'}`} 
                  />
                ))}
              </div>
            </div>
            <div className="mt-8 text-center animate-gallery-item">
              <p className="text-yellow-400 font-black tracking-widest uppercase text-xs mb-2">Current Slide</p>
              <h4 className="text-2xl font-bold">{images[currentIndex].caption || "Atmospheric Soho Karaoke"}</h4>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col lightbox-overlay"
          onClick={closeLightbox}
        >
          {/* Top Controls */}
          <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-[110]">
            <div className="text-white/70 text-sm font-bold tracking-widest">
              {lightboxIndex + 1} / {images.length}
            </div>
            <div className="flex gap-4">
              <button 
                onClick={toggleZoom}
                className="bg-zinc-900/50 hover:bg-zinc-800 text-white p-3 rounded-full border border-white/10 transition-all"
                title="Toggle Zoom"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isZoomed ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  )}
                </svg>
              </button>
              <button 
                onClick={closeLightbox}
                className="bg-zinc-900/50 hover:bg-zinc-800 text-white p-3 rounded-full border border-white/10 transition-all"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            <button 
              onClick={prevLightboxImage}
              className="absolute left-6 z-[110] bg-white/5 hover:bg-yellow-400 hover:text-black text-white p-5 rounded-full transition-all border border-white/10 hidden md:block"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div 
              className={`relative transition-transform duration-500 ease-out flex items-center justify-center h-full w-full p-4 md:p-12 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              onClick={toggleZoom}
            >
              <img 
                src={images[lightboxIndex].url} 
                alt={images[lightboxIndex].caption} 
                className={`max-w-full max-h-full object-contain transition-transform duration-500 ${isZoomed ? 'scale-150 md:scale-[2]' : 'scale-100'}`}
                style={{ transformOrigin: 'center' }}
              />
            </div>

            <button 
              onClick={nextLightboxImage}
              className="absolute right-6 z-[110] bg-white/5 hover:bg-yellow-400 hover:text-black text-white p-5 rounded-full transition-all border border-white/10 hidden md:block"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Caption */}
          <div className="p-12 text-center z-[110] bg-gradient-to-t from-black via-black/80 to-transparent">
             <h4 className="text-xl md:text-3xl font-bold mb-2">{images[lightboxIndex].caption}</h4>
             <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">LKC Soho Experience</p>
          </div>

          {/* Mobile Navigation Bar */}
          <div className="md:hidden flex justify-center gap-12 pb-12 z-[110]">
              <button onClick={prevLightboxImage} className="text-white p-4"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg></button>
              <button onClick={nextLightboxImage} className="text-white p-4"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
