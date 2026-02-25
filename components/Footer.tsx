import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { NAV, SUMUP_BOOKING_URL, WHATSAPP_URL } from '../lib/nav';
import Button from './ui/Button';

const Footer: React.FC = () => {
  const { footerData } = useData();

  const sections = ['Explore', 'Book', 'Events', 'LKC', 'Connect'] as const;

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400">
      <div className="container mx-auto px-6 py-14">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 md:p-8 text-center mb-12">
          <h4 className="text-2xl md:text-4xl font-black text-white mb-3">{footerData.ctaHeading}</h4>
          <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">{footerData.ctaText}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer">{footerData.ctaButtonText}</Button>
            <Button href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" variant="secondary">Plan via WhatsApp</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {sections.map((section) => (
            <div key={section}>
              <h5 className="font-black text-white text-xs uppercase tracking-[0.1em] mb-4">{section}</h5>
              <ul className="space-y-2">
                {NAV.filter((n) => n.section === section).map((item, idx) => (
                  <li key={`${section}-${idx}`}>
                    {item.external ? (
                      <a href={item.href} className="text-sm hover:text-white" target="_blank" rel="noopener noreferrer">{item.label}</a>
                    ) : (
                      <Link to={item.href} className="text-sm hover:text-white">{item.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-zinc-800 text-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <p>Copyright © {new Date().getFullYear()} London Karaoke Club. All rights reserved.</p>
            <p>Soho, London · +44 7761 383514 · Open until 3am</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Use</Link>
            <Link to="/booking-policy" className="hover:text-white">Booking Policy</Link>
            <Link to="/sitemap" className="hover:text-white">Site Map</Link>
            <Link to="/admin" className="text-zinc-600 hover:text-zinc-400">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
