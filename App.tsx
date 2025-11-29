
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
import { DataProvider } from './context/DataContext';

type Page = 'home' | 'menu' | 'drinks' | 'gallery' | 'admin' | 'terms';

const PageBorder: React.FC = () => (
  <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
    <style>{`
      @keyframes border-top {
        0% { left: -100%; }
        50%, 100% { left: 100%; }
      }
      @keyframes border-right {
        0% { top: -100%; }
        50%, 100% { top: 100%; }
      }
      @keyframes border-bottom {
        0% { right: -100%; }
        50%, 100% { right: 100%; }
      }
      @keyframes border-left {
        0% { bottom: -100%; }
        50%, 100% { bottom: 100%; }
      }
      .neon-border-line {
        position: absolute;
        opacity: 0.8;
        border-radius: 4px;
        box-shadow: 0 0 10px currentColor;
      }
    `}</style>
    {/* Top Line - Pink/Yellow */}
    <div className="neon-border-line top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-pink-500 to-transparent text-pink-500 animate-[border-top_4s_linear_infinite]"></div>
    
    {/* Right Line - Purple */}
    <div className="neon-border-line top-0 right-0 w-[3px] h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent text-purple-500 animate-[border-right_4s_linear_infinite_1s]"></div>
    
    {/* Bottom Line - Blue */}
    <div className="neon-border-line bottom-0 right-0 w-full h-[3px] bg-gradient-to-l from-transparent via-blue-500 to-transparent text-blue-500 animate-[border-bottom_4s_linear_infinite_2s]"></div>
    
    {/* Left Line - Yellow */}
    <div className="neon-border-line bottom-0 left-0 w-[3px] h-full bg-gradient-to-t from-transparent via-yellow-400 to-transparent text-yellow-400 animate-[border-left_4s_linear_infinite_3s]"></div>
  </div>
);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateTo = (page: any) => {
    // If imageEditor is requested (legacy), redirect to home
    if (page === 'imageEditor') {
        setCurrentPage('home');
    } else {
        setCurrentPage(page);
    }
    window.scrollTo(0, 0);
  };

  return (
    <DataProvider>
      <div className="bg-black text-white min-h-screen relative">
        <PageBorder />
        {currentPage !== 'admin' && <Header onNavigate={navigateTo} />}
        <main>
          {currentPage === 'home' && (
            <>
              <Hero />
              <Highlights />
              <Features />
              <Fitness />
              <Battery />
              <Testimonials />
              <InfoSection />
              <FAQ />
            </>
          )}
          {currentPage === 'menu' && <Menu />}
          {currentPage === 'drinks' && <DrinksMenu />}
          {currentPage === 'gallery' && <Gallery />}
          {currentPage === 'admin' && <AdminDashboard />}
          {currentPage === 'terms' && <Terms />}
        </main>
        {currentPage !== 'admin' && <Footer onNavigate={navigateTo} />}
        {currentPage !== 'admin' && (
            <>
                <WhatsAppButton />
            </>
        )}
      </div>
    </DataProvider>
  );
};

export default App;
