import React, { useState, useEffect } from 'react';
import { GalleryViewMode, useData } from '../context/DataContext';
import { getMediaUrl } from '../lib/media';

interface GalleryProps {
  embedded?: boolean;
  forcedCollectionId?: string;
  forcedViewMode?: GalleryViewMode;
}

const Gallery: React.FC<GalleryProps> = ({ embedded = false, forcedCollectionId, forcedViewMode }) => {
  const { galleryData, isDataLoading } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<GalleryViewMode>('carousel');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeCollectionId, setActiveCollectionId] = useState<string>('');

  const collections = (galleryData.collections && galleryData.collections.length > 0)
    ? galleryData.collections
    : [{ id: 'default', name: 'Main Gallery', subtext: galleryData.subtext, images: galleryData.images || [] }];
  const activeCollection = collections.find(c => c.id === forcedCollectionId)
    || collections.find(c => c.id === activeCollectionId)
    || collections.find(c => c.id === galleryData.activeCollectionId)
    || collections[0];

  const images = (activeCollection?.images || [])
    .map((img) => ({ ...img, url: getMediaUrl(img.url || '') }))
    .filter((img) => !!img.url);

  useEffect(() => {
    if (forcedCollectionId) return;
    if (!activeCollectionId && activeCollection?.id) setActiveCollectionId(activeCollection.id);
  }, [forcedCollectionId, activeCollectionId, activeCollection]);

  useEffect(() => {
    if (forcedViewMode) {
      setViewMode(forcedViewMode);
      return;
    }
    const nextMode = activeCollection?.defaultViewMode === 'grid' ? 'grid' : 'carousel';
    setViewMode(nextMode);
  }, [activeCollection?.id, activeCollection?.defaultViewMode, forcedViewMode]);

  useEffect(() => {
    if (embedded || viewMode !== 'carousel' || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [embedded, viewMode, images.length]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  useEffect(() => {
    setCurrentIndex(0);
    setLightboxIndex(null);
  }, [activeCollection?.id]);

  if (isDataLoading && images.length === 0) {
    return (
      <div className={`${embedded ? 'py-12' : 'min-h-screen'} flex flex-col items-center justify-center bg-black text-white`}>
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-yellow-400" />
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Loading Gallery...</p>
      </div>
    );
  }

  const featuredImage = images[0];
  const secondaryImages = images.slice(1, 5);

  return (
    <div className={`relative select-none bg-black text-white ${embedded ? 'py-16 md:py-20 lg:py-28' : 'min-h-screen pb-24 pt-24'}`}>
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12 backdrop-blur-xl" onClick={() => setLightboxIndex(null)}>
          <button className="absolute right-6 top-6 rounded-full bg-zinc-800/50 p-3 text-white transition-colors hover:bg-zinc-700" onClick={() => setLightboxIndex(null)}>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="relative max-h-[85vh] w-full max-w-5xl">
            <img src={getMediaUrl(images[lightboxIndex].url)} alt="" className="h-full w-full object-contain" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
        <div className="mx-auto mb-12 max-w-[720px] text-center">
          <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">{galleryData.heading}</h2>
          <p className="mt-3 text-base leading-6 text-gray-400 md:text-lg md:leading-7">{activeCollection?.subtext || galleryData.subtext}</p>
          {!forcedCollectionId && collections.length > 1 && (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => setActiveCollectionId(collection.id)}
                  className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeCollection?.id === collection.id
                      ? 'border-yellow-300/40 bg-yellow-400/15 text-yellow-200'
                      : 'border-white/15 bg-white/[0.03] text-zinc-400 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {collection.name}
                </button>
              ))}
            </div>
          )}

          {!embedded && (
            <div className="mx-auto mt-6 flex w-max gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
              <button
                onClick={() => setViewMode('carousel')}
                className={`rounded-full px-6 py-2 text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'carousel' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Carousel
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-full px-6 py-2 text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Grid
              </button>
            </div>
          )}
        </div>

        {embedded ? (
          <div className="space-y-4">
            {featuredImage && (
              <button
                type="button"
                onClick={() => setLightboxIndex(0)}
                className="group relative block overflow-hidden rounded-2xl border border-white/10"
              >
                <img src={getMediaUrl(featuredImage.url)} alt={featuredImage.caption || 'London Karaoke Club'} className="h-[340px] w-full object-cover md:h-[520px]" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent opacity-80 transition-opacity duration-200 group-hover:opacity-100" />
                <p className="absolute bottom-4 left-4 text-sm font-bold text-white">{featuredImage.caption || 'London Karaoke Club'}</p>
              </button>
            )}

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {secondaryImages.map((img, idx) => (
                <button
                  type="button"
                  key={img.id}
                  onClick={() => setLightboxIndex(idx + 1)}
                  className="group relative overflow-hidden rounded-2xl border border-white/10"
                >
                  <img src={getMediaUrl(img.url)} alt={img.caption || 'London Karaoke Club'} className="h-40 w-full object-cover md:h-48" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <p className="absolute bottom-3 left-3 text-xs font-semibold text-white">{img.caption || 'LKC Soho'}</p>
                </button>
              ))}
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {images.map((img, idx) => (
              <button
                type="button"
                key={img.id}
                onClick={() => setLightboxIndex(idx)}
                className="group relative overflow-hidden rounded-2xl border border-white/10"
              >
                <img src={getMediaUrl(img.url)} alt={img.caption || 'London Karaoke Club'} loading="lazy" className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60 transition-opacity duration-200 group-hover:opacity-100" />
                <p className="absolute bottom-3 left-3 truncate text-xs font-semibold text-white">{img.caption || 'London Karaoke Club'}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-5xl">
            <div className="relative aspect-video overflow-hidden rounded-[2rem] border border-white/10">
              <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {images.map((img, i) => (
                  <img key={i} src={getMediaUrl(img.url)} loading={i === currentIndex ? 'eager' : 'lazy'} className="h-full w-full flex-shrink-0 object-cover" alt="" />
                ))}
              </div>
              <button onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-3 text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={() => setCurrentIndex((currentIndex + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-3 text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
