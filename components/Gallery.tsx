
import React, { useState, useEffect, useRef } from 'react';
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

  if (isDataLoading && images.length === 0) {
      return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Gallery...</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white pt-20 pb-24 relative select-none">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-5xl font-extrabold text-white mb-6">{galleryData.heading}</h2>
          <div className="flex justify-center mt-8 gap-4">
              <button onClick={() => setViewMode('carousel')} className={`px-4 py-2 rounded-full text-sm font-bold ${viewMode === 'carousel' ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-gray-400'}`}>Carousel</button>
              <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-full text-sm font-bold ${viewMode === 'grid' ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-gray-400'}`}>Grid</button>
          </div>
        </div>

        {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {images.map((img) => (
                    <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900">
                        {!loadedImages[img.id] && <div className="absolute inset-0 animate-pulse bg-zinc-800"></div>}
                        <img 
                            src={img.url} 
                            alt={img.caption} 
                            onLoad={() => handleImageLoad(img.id)}
                            className={`w-full h-full object-cover transition-opacity duration-500 ${loadedImages[img.id] ? 'opacity-100' : 'opacity-0'}`} 
                        />
                    </div>
                ))}
            </div>
        )}
        
        {viewMode === 'carousel' && images.length > 0 && (
             <div className="max-w-5xl mx-auto">
                 <div className="relative aspect-video bg-zinc-900 rounded-3xl overflow-hidden">
                     <img src={images[currentIndex].url} className="w-full h-full object-cover" />
                     <button onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-4 rounded-full">←</button>
                     <button onClick={() => setCurrentIndex((currentIndex + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-4 rounded-full">→</button>
                 </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
