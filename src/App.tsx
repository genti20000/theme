import React, { useState, lazy, Suspense, useEffect } from 'react';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Header';
import { Page } from './types';

// Lazy load components for better performance
const Hero = lazy(() => import('./components/Hero'));
const Highlights = lazy(() => import('./components/Highlights'));
const Features = lazy(() => import('./components/Features'));
const Menu = lazy(() => import('./components/Menu'));
const Fitness = lazy(() => import('./components/Fitness'));
const Battery = lazy(() => import('./components/Battery'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Footer = lazy(() => import('./components/Footer'));
const DrinksMenu = lazy(() => import('./components/DrinksMenu'));
const WhatsAppButton = lazy(() => import('./components/WhatsAppButton'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const InfoSection = lazy(() => import('./components/InfoSection'));
const FAQ = lazy(() => import('./components/FAQ'));
const Terms = lazy(() => import('./components/Terms'));
const Gallery = lazy(() => import('./components/Gallery'));
const SongLibrary = lazy(() => import('./components/SongLibrary'));
const EventsPage = lazy(() => import('./components/EventsPage'));
const BlogPage = lazy(() => import('./components/BlogPage'));

// Loading component for lazy loaded components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoading, setIsLoading] = useState(false);

  const navigateTo = (page: Page) => {
    // Show loading indicator when navigating to new page
    setIsLoading(true);
    setCurrentPage(page);
    window.scrollTo(0, 0);
    
    // Hide loading indicator after a short delay
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <DataProvider>
      <div className="bg-black text-white min-h-screen relative selection:bg-pink-500 selection:text-white">
        {currentPage !== 'admin' && <Header currentPage={currentPage} onNavigate={navigateTo} />}
        
        <main>
          {isLoading && (
            <div className="flex items-center justify-center min-h-screen">
              <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {!isLoading && currentPage === 'home' && (
            <Suspense fallback={<LoadingSpinner />}>
              <Hero />
              <Highlights />
              <div id="special-offers" className="h-0 overflow-hidden" aria-hidden="true"></div>
              <Features />
              <Fitness />
              <Battery />
              <Testimonials />
              <InfoSection />
              <FAQ />
            </Suspense>
          )}
          
          {!isLoading && currentPage === 'menu' && (
            <Suspense fallback={<LoadingSpinner />}>
              <Menu />
            </Suspense>
          )}
          
          {!isLoading && currentPage === 'drinks' && (
            <Suspense fallback={<LoadingSpinner />}>
              <DrinksMenu />
            </Suspense>
          )}
          
          {!isLoading && currentPage === 'gallery' && (
            <Suspense fallback={<LoadingSpinner />}>
              <Gallery />
            </Suspense>
          )}
          
          {!isLoading && currentPage === 'songs' && (
            <Suspense fallback={<LoadingSpinner />}>
              <SongLibrary />
            </Suspense>
          )}
          
          {!isLoading && currentPage === 'events' && (
            <Suspense fallback={<LoadingSpinner />}>
              <EventsPage />
            </Suspense>
          )}
          
          {!isLoading && currentPage === 'blog' && (
            <Suspense fallback={<LoadingSpinner />}>
              <BlogPage />
            </Suspense>
          )}
          
          {!isLoading && currentPage === 'admin' && (
            <Suspense fallback={<LoadingSpinner />}>
              <AdminDashboard />
            </Suspense>
          )}
          
          {!isLoading && currentPage === 'terms' && (
            <Suspense fallback={<LoadingSpinner />}>
              <Terms />
            </Suspense>
          )}
        </main>
        
        {currentPage !== 'admin' && (
          <Suspense fallback={null}>
            <Footer onNavigate={navigateTo} />
            <WhatsAppButton />
          </Suspense>
        )}
      </div>
    </DataProvider>
  );
};

export default App;