import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { NAV, SUMUP_BOOKING_URL, WHATSAPP_URL } from '../lib/nav';
import Button from './ui/Button';
import Card from './ui/Card';

const Footer: React.FC = () => {
  const { footerData } = useData();

  const groups = [
    { title: 'Explore', items: NAV.filter((n) => n.section === 'Explore') },
    { title: 'Events', items: NAV.filter((n) => n.section === 'Events') },
    { title: 'LKC', items: NAV.filter((n) => n.section === 'LKC') },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#0A0A0A] text-zinc-400">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 md:px-8 md:py-20 lg:py-24">
        <Card className="mb-12 p-6 text-center md:p-8">
          <h4 className="mb-3 text-2xl font-black text-white md:text-3xl">{footerData.ctaHeading}</h4>
          <p className="mx-auto mb-6 max-w-2xl text-base leading-6 text-zinc-300 md:text-lg md:leading-7">{footerData.ctaText}</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer">{footerData.ctaButtonText}</Button>
            <Button href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" variant="secondary">Plan via WhatsApp</Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {groups.map((group) => (
            <div key={group.title}>
              <h5 className="mb-4 text-xs font-black uppercase tracking-[0.1em] text-white">{group.title}</h5>
              <ul className="space-y-2">
                {group.items.map((item, idx) => (
                  <li key={`${group.title}-${idx}`}>
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

          <Card className="p-5">
            <h5 className="mb-4 text-xs font-black uppercase tracking-[0.1em] text-white">Contact</h5>
            <div className="space-y-3 text-sm">
              <p>Soho, London</p>
              <p>
                <a href="tel:+447761383514" className="hover:text-white">+44 7761 383514</a>
              </p>
              <p>Open until 3am</p>
              <Button href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" variant="secondary" className="w-full">WhatsApp</Button>
            </div>
          </Card>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs md:flex-row md:items-center md:justify-between">
          <p>Copyright © {new Date().getFullYear()} London Karaoke Club. All rights reserved.</p>
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
