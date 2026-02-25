import React from 'react';
import Hero from '../components/Hero';
import Highlights from '../components/Highlights';
import Features from '../components/Features';
import Fitness from '../components/Fitness';
import Battery from '../components/Battery';
import Testimonials from '../components/Testimonials';
import InfoSection from '../components/InfoSection';
import FAQ from '../components/FAQ';
import InstagramHighlights from '../components/InstagramHighlights';
import DrinksMenu from '../components/DrinksMenu';
import PageGallerySection from '../components/PageGallerySection';
import HomeConversionBlocks from '../components/HomeConversionBlocks';
import { useData } from '../context/DataContext';

const HomePage: React.FC = () => {
  const {
    homeSections,
    highlightsData,
    featuresData,
    vibeData,
    batteryData,
    testimonialsData,
    infoSectionData,
    faqData,
    instagramHighlightsData,
  } = useData();

  const orderedSections = Array.isArray(homeSections) && homeSections.length > 0
    ? homeSections
    : [
        { id: 'fallback-hero', type: 'hero', title: 'Hero', enabled: true },
        { id: 'fallback-instagram', type: 'instagramHighlights', title: 'Instagram Highlights', enabled: instagramHighlightsData.enabled !== false },
        { id: 'fallback-highlights', type: 'highlights', title: 'Highlights', enabled: highlightsData.enabled !== false },
        { id: 'fallback-features', type: 'features', title: 'Features', enabled: featuresData.enabled !== false },
        { id: 'fallback-vibe', type: 'vibe', title: 'Vibe', enabled: vibeData.enabled !== false },
        { id: 'fallback-battery', type: 'battery', title: 'Stats', enabled: batteryData.enabled !== false },
        { id: 'fallback-testimonials', type: 'testimonials', title: 'Testimonials', enabled: testimonialsData.enabled !== false },
        { id: 'fallback-info', type: 'info', title: 'Info', enabled: infoSectionData.enabled !== false },
        { id: 'fallback-faq', type: 'faq', title: 'FAQ', enabled: faqData.enabled !== false },
        { id: 'fallback-drinks', type: 'drinks', title: 'Drinks', enabled: true },
        { id: 'fallback-gallery', type: 'gallery', title: 'Gallery', enabled: true }
      ];

  return (
    <>
      {orderedSections.map((section, index) => {
        if (!section.enabled) return null;
        if (section.type === 'hero') return <Hero key={section.id} />;
        if (section.type === 'instagramHighlights') return instagramHighlightsData.enabled !== false ? <InstagramHighlights key={section.id} /> : null;
        if (section.type === 'highlights') return highlightsData.enabled !== false ? <Highlights key={section.id} /> : null;
        if (section.type === 'features') return featuresData.enabled !== false ? <Features key={section.id} /> : null;
        if (section.type === 'vibe') return vibeData.enabled !== false ? <Fitness key={section.id} /> : null;
        if (section.type === 'battery') return batteryData.enabled !== false ? <Battery key={section.id} /> : null;
        if (section.type === 'testimonials') return testimonialsData.enabled !== false ? <Testimonials key={section.id} /> : null;
        if (section.type === 'info') return infoSectionData.enabled !== false ? <InfoSection key={section.id} /> : null;
        if (section.type === 'faq') {
          if (faqData.enabled === false) return null;
          return (
            <React.Fragment key={section.id}>
              <HomeConversionBlocks />
              <FAQ />
            </React.Fragment>
          );
        }
        if (section.type === 'drinks') {
          return (
            <section id={index === 0 ? "drinks" : undefined} key={section.id}>
              <DrinksMenu />
            </section>
          );
        }
        if (section.type === 'gallery') return <PageGallerySection pageKey="home" className="mt-20" key={section.id} />;
        return null;
      })}
    </>
  );
};

export default HomePage;
