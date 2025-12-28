import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const Gallery: React.FC = () => {
  const { galleryData, isDataLoading } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const images = galleryData.images || [];

  const handleImageLoad = (id: string) => {
      setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    if (viewMode === 'carousel' && images.length > 0) {
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }
  }, [viewMode, images.length]);

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
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-gallery-item { animation: fadeInScale 0.6s ease-out forwards; }
        .shimmer-placeholder {
          background: linear-gradient(90deg, #18181b 25%, #27272a 50%, #18181b 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase italic">{galleryData.heading}</h2>
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
                        className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 animate-gallery-item group shadow-2xl"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                        {!loadedImages[img.id] && <div className="absolute inset-0 shimmer-placeholder"></div>}
                        <img 
                            src={img.url} 
                            alt={img.caption} 
                            loading="lazy"
                            onLoad={() => handleImageLoad(img.id)}
                            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${loadedImages[img.id] ? 'opacity-100' : 'opacity-0'}`} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end pointer-events-none">
                            <p className="text-white font-bold text-sm tracking-wide uppercase">{img.caption || "London Karaoke Club"}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
        
        {viewMode === 'carousel' && images.length > 0 && (
             <div className="max-w-5xl mx-auto group animate-gallery-item">
                 <div className="relative aspect-video md:aspect-[21/9] bg-zinc-900 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(250,204,21,0.1)] border border-zinc-800">
                     <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                         {images.map((img, i) => (
                             <img 
                                key={i} 
                                src={img.url} 
                                loading={i === currentIndex ? 'eager' : 'lazy'}
                                className="w-full h-full object-cover flex-shrink-0" 
                                alt=""
                             />
                         ))}
                     </div>
                     
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                     
                     <button 
                        onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)} 
                        className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-yellow-400 hover:text-black border border-white/10 z-10"
                     >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                     </button>
                     <button 
                        onClick={() => setCurrentIndex((currentIndex + 1) % images.length)} 
                        className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-yellow-400 hover:text-black border border-white/10 z-10"
                     >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                     </button>

                     <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {images.map((_, i) => (
                            <button 
                                key={i} 
                                onClick={() => setCurrentIndex(i)}
                                className={`h-1.5 rounded-full transition-all ${currentIndex === i ? 'w-8 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 'w-2 bg-white/30 hover:bg-white/50'}`} 
                            />
                        ))}
                     </div>
                 </div>
                 <div className="mt-8 text-center">
                    <p className="text-yellow-400 font-black tracking-widest uppercase text-[10px] mb-2">Atmosphere Preview</p>
                    <h4 className="text-2xl font-bold italic uppercase tracking-tighter">{images[currentIndex]?.caption || "Vibrant Soho Nights"}</h4>
                 </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
