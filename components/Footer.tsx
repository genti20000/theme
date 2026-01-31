
import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { NAV, SUMUP_BOOKING_URL } from '../lib/nav';

const Footer: React.FC = () => {
  const { footerData } = useData();

  const sections = ["Explore", "Book", "Events", "LKC", "Connect"] as const;

  return (
    <footer className="bg-zinc-900 text-gray-400 text-xs">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12 pb-12 border-b border-gray-700">
          <h4 className="text-3xl font-bold text-white mb-4">{footerData.ctaHeading}</h4>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto text-base">{footerData.ctaText}</p>
          <a
            href={SUMUP_BOOKING_URL}
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold py-3 px-6 rounded-full border-2 border-white transition-transform duration-300 ease-in-out hover:scale-105"
            target="_blank"
            rel="noopener noreferrer"
          >
            {footerData.ctaButtonText}
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {sections.map(section => (
            <div key={section}>
              <h5 className="font-bold text-white mb-4 uppercase tracking-widest">{section}</h5>
              <ul className="space-y-2">
                {NAV.filter(n => n.section === section).map((item, idx) => (
                  <li key={`${section}-${idx}`}>
                    {item.external ? (
                      <a
                        href={item.href}
                        className="text-gray-400 hover:text-white transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link to={item.href} className="text-gray-400 hover:text-white transition-colors">
                        {item.label}
                      </Link>
                    )}
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
                    <Link to="/admin" className="text-gray-600 hover:text-gray-400 text-xs text-left md:ml-4">Admin Login</Link>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <Link to="/privacy" className="text-gray-400 hover:text-white text-xs">Privacy Policy</Link>
                    <Link to="/terms" className="text-gray-400 hover:text-white text-xs">Terms of Use</Link>
                    <Link to="/booking-policy" className="text-gray-400 hover:text-white text-xs">Booking Policy</Link>
                    <Link to="/sitemap" className="text-gray-400 hover:text-white text-xs">Site Map</Link>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
