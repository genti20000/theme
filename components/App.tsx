import React, { useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import Highlights from './Highlights';
import Features from './Features';
import Menu from './Menu';
import Fitness from './Fitness';
import Battery from './Battery';
import Testimonials from './Testimonials';
import Footer from './Footer';
import DrinksMenu from './DrinksMenu';
import WhatsAppButton from './WhatsAppButton';
import AdminDashboard from './AdminDashboard';
import InfoSection from './InfoSection';
import FAQ from './FAQ';
import Terms from './Terms';
import Gallery from './Gallery';
import SongLibrary from './SongLibrary';
import EventsPage from './EventsPage';
import BlogPage from './BlogPage';
import VisualEffects from './VisualEffects';
import ImageEditor from './ImageEditor';
import InstagramHighlights from './InstagramHighlights';
import InstagramPage from './InstagramPage';
import SitemapPage from './SitemapPage';
import { DataProvider, useData } from '../context/DataContext';

type Page = 'home' | 'menu' | 'drinks' | 'gallery' | 'imageEditor' | 'admin' | 'terms' | 'songs' | 'events' | 'blog' | 'instagram' | 'sitemap';

const MainContent: React.FC<{ currentPage: Page; navigateTo: (p: Page) => void }> = ({ currentPage, navigateTo }) => {
  const { 
    galleryData, highlightsData, featuresData, vibeData, batteryData, 
    testimonialsData, infoSectionData, faqData, instagramHighlightsData
  } = useData();

  return (
    <main>
      {currentPage === 'home' && (
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
          {galleryData.showOnHome && <div className="mt-20"><Gallery /></div>}
        </>
      )}
      {currentPage === 'menu' && <Menu />}
      {currentPage === 'drinks' && <DrinksMenu />}
      {currentPage === 'gallery' && <Gallery />}
      {currentPage === 'imageEditor' && <ImageEditor />}
      {currentPage === 'songs' && <SongLibrary />}
      {currentPage === 'events' && <EventsPage />}
      {currentPage === 'blog' && <BlogPage />}
      {currentPage === 'admin' && <AdminDashboard />}
      {currentPage === 'terms' && <Terms />}
      {currentPage === 'instagram' && <InstagramPage />}
      {currentPage === 'sitemap' && <SitemapPage onNavigate={navigateTo} />}
    </main>
  );
};

const AppShell: React.FC<{ currentPage: Page; navigateTo: (p: Page) => void }> = ({ currentPage, navigateTo }) => {
    return (
        <>
            {currentPage !== 'admin' && <VisualEffects />}
            {currentPage !== 'admin' && <Header onNavigate={navigateTo} />}
            <MainContent currentPage={currentPage} navigateTo={navigateTo} />
            {currentPage !== 'admin' && <Footer onNavigate={navigateTo} />}
            {currentPage !== 'admin' && <WhatsAppButton />}
        </>
    );
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <DataProvider>
      <div className="bg-black text-white min-h-screen relative selection:bg-pink-500 selection:text-white">
        <AppShell currentPage={currentPage} navigateTo={navigateTo} />
      </div>
    </DataProvider>
  );
};

export default App;