
import React from 'react';
import { useData } from '../context/DataContext';
import { AppLink } from './AppLink';
import { Page, NAV, SUMUP_BOOKING_URL } from '../lib/nav';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { footerData } = useData();

  const handleScrollToOffers = () => {
    onNavigate('home');
    setTimeout(() => {
        const section = document.getElementById('special-offers');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
  };

  const sections = ["Explore", "Book", "Events", "LKC", "Connect"] as const;

  return (
    <footer className="bg-zinc-900 text-gray-400 text-xs">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12 pb-12 border-b border-gray-700">
          <h4 className="text-3xl font-bold text-white mb-4">{footerData.ctaHeading}</h4>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto text-base">{footerData.ctaText}</p>
          <AppLink 
            href={SUMUP_BOOKING_URL} 
            external
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold py-3 px-6 rounded-full border-2 border-white transition-transform duration-300 ease-in-out hover:scale-105"
          >
            {footerData.ctaButtonText}
          </AppLink>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {sections.map(section => (
            <div key={section}>
              <h5 className="font-bold text-white mb-4 uppercase tracking-widest">{section}</h5>
              <ul className="space-y-2">
                {NAV.filter(n => n.section === section).map((item, idx) => (
                  <li key={`${section}-${idx}`}>
                    <AppLink 
                      href={item.href} 
                      external={item.external}
                      onNavigate={onNavigate}
                      className="text-gray-400 hover:text-white transition-colors"
                      onClick={() => {
                        if (item.label === "Special Offers") handleScrollToOffers();
                      }}
                    >
                      {item.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="mb-4">More ways to sing: find us in the heart of London. Or call +44 7761 383514.</p>
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-col md:flex-row gap-4">
                    <p>Copyright © {new Date().getFullYear()} London Karaoke Club. All rights reserved.</p>
                    <button onClick={() => onNavigate('admin')} className="text-gray-600 hover:text-gray-400 text-xs text-left md:ml-4">Admin Login</button>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <AppLink href="terms" onNavigate={onNavigate} className="text-gray-400 hover:text-white text-xs">Privacy Policy</AppLink>
                    <AppLink href="terms" onNavigate={onNavigate} className="text-gray-400 hover:text-white text-xs">Terms of Use</AppLink>
                    <AppLink href="terms" onNavigate={onNavigate} className="text-gray-400 hover:text-white text-xs">Booking Policy</AppLink>
                    <AppLink href="sitemap" onNavigate={onNavigate} className="text-gray-400 hover:text-white text-xs">Site Map</AppLink>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
