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
import { DataProvider } from './context/DataContext';

type Page = 'home' | 'menu' | 'drinks' | 'gallery' | 'admin' | 'terms' | 'songs' | 'events' | 'blog';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateTo = (page: any) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <DataProvider>
      <div className="bg-black text-white min-h-screen relative selection:bg-pink-500 selection:text-white">
        {currentPage !== 'admin' && <Header onNavigate={navigateTo} />}
        <main>
          {currentPage === 'home' && (
            <>
              <Hero />
              <Highlights />
              <div id="special-offers" className="h-0 overflow-hidden" aria-hidden="true"></div>
              <Features />
              <Fitness />
              <Gallery isHomePreview={true} onNavigate={navigateTo} />
              <Battery />
              <Testimonials />
              <InfoSection />
              <FAQ />
            </>
          )}
          {currentPage === 'menu' && <Menu />}
          {currentPage === 'drinks' && <DrinksMenu />}
          {currentPage === 'gallery' && <Gallery />}
          {currentPage === 'songs' && <SongLibrary />}
          {currentPage === 'events' && <EventsPage />}
          {currentPage === 'blog' && <BlogPage />}
          {currentPage === 'admin' && <AdminDashboard />}
          {currentPage === 'terms' && <Terms />}
        </main>
        {currentPage !== 'admin' && <Footer onNavigate={navigateTo} />}
        {currentPage !== 'admin' && <WhatsAppButton />}
      </div>
    </DataProvider>
  );
};

export default App;
