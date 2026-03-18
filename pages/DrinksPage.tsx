import React from 'react';
import DrinksMenu from '../components/DrinksMenu';
import PageGallerySection from '../components/PageGallerySection';
import RelatedPlanningLinks from '../components/RelatedPlanningLinks';

const DrinksPage: React.FC = () => {
  return (
    <div className="bg-black text-white">
      <div className="container mx-auto px-6 pt-16 md:pt-20">
        <h1 className="text-4xl md:text-6xl font-bold">Drinks Menu</h1>
        <div className="mt-8 max-w-4xl">
          <RelatedPlanningLinks
            intro="If you are planning the full night, pair the drinks menu with the core booking pages:"
            links={[
              { to: '/hen-do-karaoke-soho', label: 'hen do karaoke Soho' },
              { to: '/birthday-karaoke-soho', label: 'birthday karaoke Soho' },
              { to: '/events', label: 'private events' },
              { to: '/gallery', label: 'gallery' },
            ]}
          />
        </div>
      </div>
      <DrinksMenu />
      <PageGallerySection pageKey="drinks" />
    </div>
  );
};

export default DrinksPage;
