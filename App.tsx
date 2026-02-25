
import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AdminDashboard from './components/AdminDashboard';
import Terms from './components/Terms';
import Gallery from './components/Gallery';
import SongLibrary from './components/SongLibrary';
import EventsPage from './components/EventsPage';
import BlogPage from './components/BlogPage';
import VisualEffects from './components/VisualEffects';
import InstagramPage from './components/InstagramPage';
import Menu from './components/Menu';
import SitemapPage from './components/SitemapPage';
import HashScroll from './components/HashScroll';
import { DataProvider } from './context/DataContext';
import DrinksPage from './pages/DrinksPage';
import HomePage from './pages/HomePage';
import HenDoKaraokeSohoPage from './pages/HenDoKaraokeSohoPage';
import StubPage from './pages/StubPage';

const AppShell: React.FC = () => {
  return (
    <>
      <VisualEffects />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <div className="bg-black text-white min-h-screen relative selection:bg-pink-500 selection:text-white">
        <HashScroll />
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="drinks" element={<DrinksPage />} />
            <Route path="food" element={<Menu />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="songs" element={<SongLibrary />} />
            <Route path="faqs" element={<StubPage title="FAQs" />} />
            <Route path="about" element={<StubPage title="About Us" />} />
            <Route path="contact" element={<StubPage title="Contact & Location" />} />
            <Route path="careers" element={<StubPage title="Careers" />} />
            <Route path="privacy" element={<StubPage title="Privacy Policy" />} />
            <Route path="booking-policy" element={<StubPage title="Booking Policy" />} />
            <Route path="terms" element={<Terms />} />
            <Route path="sitemap" element={<SitemapPage />} />
            <Route path="instagram" element={<InstagramPage />} />
            <Route path="hen-do-karaoke-soho" element={<HenDoKaraokeSohoPage />} />
            <Route path="*" element={<StubPage title="Page Not Found" />} />
          </Route>
          <Route path="admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </DataProvider>
  );
};

export default App;
