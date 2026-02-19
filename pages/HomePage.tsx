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
import { useData } from '../context/DataContext';

const HomePage: React.FC = () => {
  const {
    homeSectionRepeats,
    highlightsData,
    featuresData,
    vibeData,
    batteryData,
    testimonialsData,
    infoSectionData,
    faqData,
    instagramHighlightsData,
  } = useData();

  const repeatCount = (n: number) => Math.max(1, Math.floor(Number(n) || 1));
  const renderRepeated = (count: number, render: (index: number) => React.ReactNode) =>
    Array.from({ length: repeatCount(count) }, (_, index) => (
      <React.Fragment key={index}>{render(index)}</React.Fragment>
    ));

  return (
    <>
      {renderRepeated(homeSectionRepeats.hero, (i) => <Hero key={`hero-${i}`} />)}
      {instagramHighlightsData.enabled !== false &&
        renderRepeated(homeSectionRepeats.instagramHighlights, (i) => <InstagramHighlights key={`instagram-${i}`} />)}
      {highlightsData.enabled !== false &&
        renderRepeated(homeSectionRepeats.highlights, (i) => <Highlights key={`highlights-${i}`} />)}
      <div id="special-offers" className="h-0 overflow-hidden" aria-hidden="true"></div>
      {featuresData.enabled !== false &&
        renderRepeated(homeSectionRepeats.features, (i) => <Features key={`features-${i}`} />)}
      {vibeData.enabled !== false &&
        renderRepeated(homeSectionRepeats.vibe, (i) => <Fitness key={`vibe-${i}`} />)}
      {batteryData.enabled !== false &&
        renderRepeated(homeSectionRepeats.battery, (i) => <Battery key={`battery-${i}`} />)}
      {testimonialsData.enabled !== false &&
        renderRepeated(homeSectionRepeats.testimonials, (i) => <Testimonials key={`testimonials-${i}`} />)}
      {infoSectionData.enabled !== false &&
        renderRepeated(homeSectionRepeats.info, (i) => <InfoSection key={`info-${i}`} />)}
      {faqData.enabled !== false &&
        renderRepeated(homeSectionRepeats.faq, (i) => <FAQ key={`faq-${i}`} />)}
      {renderRepeated(homeSectionRepeats.drinks, (i) => (
        <section id={i === 0 ? "drinks" : undefined} key={`drinks-${i}`}>
          <DrinksMenu />
        </section>
      ))}
      {renderRepeated(homeSectionRepeats.gallery, (i) => (
        <PageGallerySection pageKey="home" className="mt-20" key={`gallery-${i}`} />
      ))}
    </>
  );
};

export default HomePage;
