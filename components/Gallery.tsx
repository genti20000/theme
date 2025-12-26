
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const Gallery: React.FC = () => {
  const { galleryData, isDataLoading } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');

  const images = galleryData.images || [];

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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mb-4"></div>
            <p className="text-zinc-500 font-black tracking-widest uppercase text-xs">Accessing Visuals...</p>
        </div>
      );
  }

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pink-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase italic">{galleryData.heading}</h2>
          <p className="text-zinc-400 text-xl font-light mb-12">{galleryData.subtext}</p>
          
          <div className="flex justify-center gap-4 p-2 bg-zinc-900/50 backdrop-blur-md rounded-2xl w-max mx-auto border border-zinc-800">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`px-10 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${viewMode === 'grid' ? 'bg-pink-600 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Grid
              </button>
              <button 
                onClick={() => setViewMode('carousel')} 
                className={`px-10 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${viewMode === 'carousel' ? 'bg-pink-600 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Carousel
              </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {images.map((img, idx) => (
                    <div 
                        key={img.id} 
                        className="relative group aspect-square rounded-[2rem] overflow-hidden bg-zinc-900 border border-zinc-800 animate-fade-in-up shadow-2xl"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                        <img 
                            src={img.url} 
                            alt={img.caption} 
                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-125" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex items-end">
                            <p className="text-white font-black text-xs uppercase tracking-widest">{img.caption}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="max-w-6xl mx-auto relative group">
                <div className="aspect-video md:aspect-[21/9] bg-zinc-900 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(236,72,153,0.1)] border border-zinc-800 relative">
                     <div className="absolute inset-0 flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                         {images.map((img, i) => (
                             <img key={i} src={img.url} className="w-full h-full object-cover flex-shrink-0" />
                         ))}
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                     <div className="absolute bottom-12 left-12">
                         <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">{images[currentIndex]?.caption}</h4>
                     </div>
                </div>
                
                <button onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)} className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-pink-600 text-white p-5 rounded-full backdrop-blur-md transition-all">←</button>
                <button onClick={() => setCurrentIndex((currentIndex + 1) % images.length)} className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-pink-600 text-white p-5 rounded-full backdrop-blur-md transition-all">→</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
