import React from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import Section from './ui/Section';
import { SUMUP_BOOKING_URL } from '../lib/nav';

const NotFoundPage: React.FC = () => {
  return (
    <Section className="bg-black" containerClassName="max-w-[760px] text-center py-24">
      <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">404</p>
      <h1 className="mb-4 text-4xl font-black leading-tight text-white md:text-5xl">Page not found</h1>
      <p className="mx-auto mb-8 max-w-[620px] text-base leading-7 text-zinc-300 md:text-lg">
        The page you requested does not exist, may have been moved, or is no longer part of the live London Karaoke Club site.
      </p>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button href="/">Go Home</Button>
        <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer" variant="secondary">Book Now</Button>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-400">
        <Link to="/gallery" className="hover:text-white">Gallery</Link>
        <Link to="/guides" className="hover:text-white">Guides</Link>
        <Link to="/events" className="hover:text-white">Events</Link>
        <Link to="/terms" className="hover:text-white">Terms</Link>
      </div>
    </Section>
  );
};

export default NotFoundPage;
