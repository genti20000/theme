import React from 'react';
import { useData } from '../contexts/DataContext';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC = () => {
  const { footerData, headerData } = useData();

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="w-24 h-24 mb-6">
              <img 
                src={headerData.logoUrl} 
                alt="London Karaoke Club Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/150x150?text=LKC";
                }}
              />
            </div>
            <p className="text-gray-400">
              The ultimate karaoke experience in the heart of London's Soho. Luxury private booths, 80,000+ songs, and premium cocktails.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => window.open('https://squareup.com/appointments/book/aijx16oiq683tl/LCK48B0G6CF51/services', '_blank')}
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                >
                  Book Online
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.open('tel:+442071234567', '_self')}
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                >
                  Call Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.open('mailto:info@londonkaraoke.club', '_blank')}
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                >
                  Email Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.open('https://maps.google.com/?q=London+Karaoke+Club', '_blank')}
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                >
                  Find Us
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wider">
              Contact Info
            </h3>
            <address className="not-italic text-gray-400 space-y-2">
              <p>123 Old Compton Street</p>
              <p>Soho, London W1D 4TF</p>
              <p className="mt-4">Open 7 days a week</p>
              <p>5PM - 3AM (Sun-Thu) | 5PM - 4AM (Fri-Sat)</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 mt-12 pt-8 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} {headerData.siteTitle}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;