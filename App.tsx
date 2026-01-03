
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Features from './components/Features';
import Menu from './components/Menu';
import Fitness from './components/Fitness';
import Battery from './components/Battery';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import DrinksMenu from './components/DrinksMenu';
import WhatsAppButton from './components/WhatsAppButton';
import AdminDashboard from './components/AdminDashboard';
import InfoSection from './components/InfoSection';
import FAQ from './components/FAQ';
import Terms from './components/Terms';
import Gallery from './components/Gallery';
import SongLibrary from './components/SongLibrary';
import EventsPage from './components/EventsPage';
import BlogPage from './components/BlogPage';
import Chatbot from './components/Chatbot';
import VisualEffects from './components/VisualEffects';
import ImageEditor from './components/ImageEditor';
import { DataProvider, useData } from './context/DataContext';

// Added 'imageEditor' and new page types to the Page type to resolve navigation type mismatch
type Page = 'home' | 'menu' | 'drinks' | 'gallery' | 'imageEditor' | 'admin' | 'terms' | 'songs' | 'events' | 'blog' | 'about' | 'contact' | 'careers';

const MainContent: React.FC<{ currentPage: Page; navigateTo: (p: Page) => void }> = ({ currentPage, navigateTo }) => {
  const { 
    galleryData, highlightsData, featuresData, vibeData, batteryData, 
    testimonialsData, infoSectionData, faqData 
  } = useData();

  return (
    <main>
      {currentPage === 'home' && (
        <>
          <Hero />
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
      {/* Added ImageEditor to the main content routing */}
      {currentPage === 'imageEditor' && <ImageEditor />}
      {currentPage === 'songs' && <SongLibrary />}
      {currentPage === 'events' && <EventsPage />}
      {currentPage === 'blog' && <BlogPage />}
      {currentPage === 'admin' && <AdminDashboard />}
      {currentPage === 'terms' && <Terms />}
      {/* Placeholder pages for About, Contact, and Careers - these will render the home page content but could be customized later */}
      {(currentPage === 'about' || currentPage === 'contact' || currentPage === 'careers') && (
        <>
          <Hero />
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
            {currentPage !== 'admin' && <Chatbot />}
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
