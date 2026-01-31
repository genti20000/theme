import React from 'react';
import Hero from '../components/Hero';
import Highlights from '../components/Highlights';
import Features from '../components/Features';
import Fitness from '../components/Fitness';
import Battery from '../components/Battery';
import Testimonials from '../components/Testimonials';
import InfoSection from '../components/InfoSection';
import FAQ from '../components/FAQ';
import Gallery from '../components/Gallery';
import InstagramHighlights from '../components/InstagramHighlights';
import DrinksMenu from '../components/DrinksMenu';
import { useData } from '../context/DataContext';

const HomePage: React.FC = () => {
  const {
    galleryData,
    highlightsData,
    featuresData,
    vibeData,
    batteryData,
    testimonialsData,
    infoSectionData,
    faqData,
    instagramHighlightsData,
  } = useData();

  return (
    <>
      <Hero />
      {instagramHighlightsData.enabled !== false && <InstagramHighlights />}
      {highlightsData.enabled !== false && <Highlights />}
      <div id="special-offers" className="h-0 overflow-hidden" aria-hidden="true"></div>
      {featuresData.enabled !== false && <Features />}
      {vibeData.enabled !== false && <Fitness />}
      {batteryData.enabled !== false && <Battery />}
      {testimonialsData.enabled !== false && <Testimonials />}
      {infoSectionData.enabled !== false && <InfoSection />}
      {faqData.enabled !== false && <FAQ />}
      <section id="drinks">
        <DrinksMenu />
      </section>
      {galleryData.showOnHome && (
        <div className="mt-20">
          <Gallery />
        </div>
      )}
    </>
  );
};

export default HomePage;
