import React from 'react';
import Gallery from './Gallery';
import { PageGalleryKey, useData } from '../context/DataContext';

interface PageGallerySectionProps {
  pageKey: PageGalleryKey;
  className?: string;
}

const PageGallerySection: React.FC<PageGallerySectionProps> = ({ pageKey, className = '' }) => {
  const { pageGallerySettings, galleryData } = useData();
  const setting = pageGallerySettings[pageKey];

  if (!setting?.enabled) return null;

  const collections = (galleryData.collections && galleryData.collections.length > 0)
    ? galleryData.collections
    : [{ id: 'default', name: 'Main Gallery', subtext: galleryData.subtext, images: galleryData.images || [], defaultViewMode: 'carousel' as const }];

  const selected = collections.find(c => c.id === setting.collectionId) || collections[0];
  if (!selected) return null;

  return (
    <section className={className}>
      <Gallery embedded forcedCollectionId={selected.id} forcedViewMode={setting.viewMode} />
    </section>
  );
};

export default PageGallerySection;
