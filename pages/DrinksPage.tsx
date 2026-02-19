import React from 'react';
import DrinksMenu from '../components/DrinksMenu';
import PageGallerySection from '../components/PageGallerySection';

const DrinksPage: React.FC = () => {
  return (
    <div className="bg-black text-white">
      <div className="container mx-auto px-6 pt-16 md:pt-20">
        <h1 className="text-4xl md:text-6xl font-bold">Drinks Menu</h1>
      </div>
      <DrinksMenu />
      <PageGallerySection pageKey="drinks" />
    </div>
  );
};

export default DrinksPage;
