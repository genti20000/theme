import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { NAV_LABELS, ROUTES, SUMUP_BOOKING_URL } from '../lib/nav';
import Button from './ui/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { headerData } = useData();

  const navLinks = (headerData.navOrder || ['menu', 'gallery', 'blog', 'drinks', 'events', 'songs']).filter(
    (link) => link in ROUTES
  );

  const getLabel = (key: string) => {
    const label = NAV_LABELS[key as keyof typeof NAV_LABELS];
    return label || key;
  };

  const getHref = (key: string) => ROUTES[key as keyof typeof ROUTES] ?? '/';

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-md">
      <div className="mx-auto grid h-16 w-full max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 md:h-[72px] md:px-8">
        <div className="hidden md:flex items-center gap-5">
          {navLinks.slice(0, 3).map((link) => (
            <Link key={link} to={getHref(link)} className="inline-flex h-10 items-center text-xs font-bold uppercase tracking-[0.08em] text-zinc-300 hover:text-white">
              {getLabel(link)}
            </Link>
          ))}
        </div>

        <Link to="/" className="justify-self-center inline-flex items-center">
          {headerData.logoUrl ? (
            <img src={headerData.logoUrl} alt="London Karaoke Club" width={48} height={48} className="h-10 w-auto max-h-12 md:h-12 object-contain" loading="eager" />
          ) : (
            <div className="h-10 w-10 rounded-full border border-zinc-700 bg-zinc-900 md:h-12 md:w-12" />
          )}
        </Link>

        <div className="justify-self-end flex items-center gap-2 md:gap-3">
          <div className="hidden md:block">
            <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="min-w-[136px]">Book Now</Button>
          </div>
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-zinc-200 hover:text-white"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950/98 backdrop-blur-md">
          <div className="mx-auto grid w-full max-w-[1200px] gap-2 px-5 py-4 md:px-8">
            <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="w-full">Book Now</Button>
            {navLinks.map((link) => (
              <Link
                key={link}
                to={getHref(link)}
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm font-bold uppercase tracking-[0.08em] text-zinc-200 hover:text-white"
              >
                {getLabel(link)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
