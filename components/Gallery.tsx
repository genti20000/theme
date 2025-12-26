import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

interface GalleryProps {
    onNavigate?: (page: any) => void;
    isHomePreview?: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ onNavigate, isHomePreview = false }) => {
  const { galleryData, isDataLoading } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>(isHomePreview ? 'grid' : 'carousel');
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const images = galleryData.images || [];
  const displayImages = isHomePreview ? images.slice(0, 6) : images;

  const handleImageLoad = (id: string) => {
      setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    if (viewMode === 'carousel' && displayImages.length > 0 && !isHomePreview) {
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % displayImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }
  }, [viewMode, displayImages.length, isHomePreview]);

  if (isDataLoading && images.length === 0) {
      return (
        <div className="min-h-[400px] bg-black flex flex-col items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
            <p className="text-gray-400 font-black tracking-widest uppercase text-xs">Syncing Moments...</p>
        </div>
      );
  }

  return (
    <div className={`bg-black text-white ${isHomePreview ? 'py-24' : 'pt-32 pb-24'} relative select-none overflow-hidden`}>
      <style>{`
        @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-gallery-item { animation: fadeInScale 0.6s ease-out forwards; }
      `}</style>
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`font-black text-white mb-6 tracking-tighter ${isHomePreview ? 'text-4xl md:text-5xl' : 'text-5xl md:text-7xl'}`}>
            {isHomePreview ? "Inside LKC" : galleryData.heading}
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">{galleryData.subtext}</p>
          
          {!isHomePreview && (
              <div className="flex justify-center gap-4 bg-zinc-900/50 p-1.5 rounded-full w-max mx-auto border border-zinc-800 backdrop-blur-md">
                  <button 
                    onClick={() => setViewMode('carousel')} 
                    className={`px-8 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${viewMode === 'carousel' ? 'bg-yellow-400 text-black shadow-lg scale-105' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Carousel
                  </button>
                  <button 
                    onClick={() => setViewMode('grid')} 
                    className={`px-8 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${viewMode === 'grid' ? 'bg-yellow-400 text-black shadow-lg scale-105' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Grid
                  </button>
              </div>
          )}
        </div>

        {viewMode === 'grid' && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {displayImages.map((img, idx) => (
                    <div 
                        key={img.id} 
                        className="relative aspect-square rounded-[2rem] overflow-hidden bg-zinc-900 border border-zinc-800 animate-gallery-item group shadow-2xl transition-all hover:border-yellow-400/50"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                        {!loadedImages[img.id] && <div className="absolute inset-0 animate-pulse bg-zinc-800"></div>}
                        <img 
                            src={img.url} 
                            alt={img.caption} 
                            onLoad={() => handleImageLoad(img.id)}
                            className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${loadedImages[img.id] ? 'opacity-100' : 'opacity-0'}`} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex items-end">
                            <p className="text-white font-bold text-sm tracking-tight border-l-2 border-yellow-400 pl-4">{img.caption}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
        
        {viewMode === 'carousel' && displayImages.length > 0 && (
             <div className="max-w-5xl mx-auto group">
                 <div className="relative aspect-video md:aspect-[21/9] bg-zinc-900 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-zinc-800">
                     <div className="absolute inset-0 flex transition-transform duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1)" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                         {displayImages.map((img, i) => (
                             <img key={i} src={img.url} className="w-full h-full object-cover flex-shrink-0" alt="" />
                         ))}
                     </div>
                     
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                     
                     <button 
                        onClick={() => setCurrentIndex((currentIndex - 1 + displayImages.length) % displayImages.length)} 
                        className="absolute left-8 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl text-white p-5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-yellow-400 hover:text-black border border-white/10"
                     >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                     </button>
                     <button 
                        onClick={() => setCurrentIndex((currentIndex + 1) % displayImages.length)} 
                        className="absolute right-8 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl text-white p-5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-yellow-400 hover:text-black border border-white/10"
                     >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                     </button>

                     <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
                        {displayImages.map((_, i) => (
                            <button 
                                key={i} 
                                onClick={() => setCurrentIndex(i)}
                                className={`h-2 rounded-full transition-all duration-500 ${currentIndex === i ? 'w-12 bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)]' : 'w-2 bg-white/20 hover:bg-white/40'}`} 
                            />
                        ))}
                     </div>
                 </div>
                 <div className="mt-12 text-center animate-gallery-item">
                    <p className="text-yellow-400 font-black tracking-widest uppercase text-[10px] mb-2 drop-shadow-md">Exclusive Boutique Suite</p>
                    <h4 className="text-3xl font-black text-white">{displayImages[currentIndex].caption || "Atmospheric Soho Karaoke"}</h4>
                 </div>
             </div>
        )}

        {isHomePreview && onNavigate && (
            <div className="mt-20 text-center">
                <button 
                    onClick={() => onNavigate('gallery')}
                    className="group relative inline-flex items-center gap-4 bg-zinc-900 hover:bg-zinc-800 text-white font-black px-12 py-5 rounded-full border border-zinc-700 transition-all hover:border-yellow-400 overflow-hidden"
                >
                    <span className="relative z-10 uppercase tracking-widest text-xs">View Full Gallery</span>
                    <svg className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
