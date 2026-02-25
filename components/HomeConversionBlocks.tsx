import React from 'react';
import { SUMUP_BOOKING_URL, WHATSAPP_URL } from '../lib/nav';
import Button from './ui/Button';
import Card from './ui/Card';
import Section from './ui/Section';

const RoomIcon = () => (
  <svg className="h-4 w-4 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 10h18M5 10V6a2 2 0 012-2h10a2 2 0 012 2v4M4 10v8m16-8v8M8 18h8" />
  </svg>
);

const spaces = [
  { name: 'Terrace Bar', capacity: '20–40 guests' },
  { name: 'Vox Room', capacity: '10–20 guests' },
  { name: 'Attic', capacity: '30–50+ guests' }
];

const HomeConversionBlocks: React.FC = () => {
  return (
    <Section className="border-t border-white/10 bg-[#0A0A0A]" containerClassName="space-y-16 md:space-y-20 lg:space-y-28">
      <section id="spaces" className="space-y-6">
        <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">Our Private Karaoke Spaces</h2>
        <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-12 lg:gap-10">
          {spaces.map((space) => (
            <Card key={space.name} className="group p-6 transition-all duration-200 hover:-translate-y-1 hover:border-yellow-300/40 md:col-span-3 lg:col-span-4">
              <div className="mb-3 flex items-center gap-2">
                <RoomIcon />
                <h3 className="text-xl font-bold text-white">{space.name}</h3>
              </div>
              <ul className="mb-5 space-y-2 text-sm text-zinc-300">
                <li>Capacity: {space.capacity}</li>
                <li>Open until 3am</li>
                <li>Minimum 2 hour booking</li>
              </ul>
              <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="w-full">Book {space.name}</Button>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing">
        <Card className="p-6 md:p-8">
          <h2 className="mb-3 text-2xl font-black leading-tight text-white md:text-3xl">Simple Pricing</h2>
          <p className="mb-5 text-base leading-6 text-zinc-300 md:text-lg md:leading-7">Prices vary by group size and day.</p>
          <ul className="mb-6 space-y-2 text-sm text-zinc-200">
            <li>Weekdays from £X/hr</li>
            <li>Fridays & Saturdays from £X/hr</li>
            <li>Min 2 hours</li>
          </ul>
          <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer">Check Availability</Button>
        </Card>
      </section>

      <section className="rounded-2xl border border-yellow-300/30 bg-white/[0.03] p-6 text-center md:p-8">
        <h3 className="mb-3 text-2xl font-black text-white">Ready to lock in your date?</h3>
        <p className="mb-5 text-zinc-300">Fridays & Saturdays sell out 1–2 weeks in advance.</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer">Book Now</Button>
          <Button href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" variant="secondary">Plan via WhatsApp</Button>
        </div>
      </section>

      <section id="seo-birthday" className="space-y-4">
        <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">Private Karaoke Birthday Parties in Soho</h2>
        <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          Planning a celebration that feels genuinely personal? London Karaoke Club is a leading choice for private karaoke Soho birthday nights with dedicated spaces for 10 to 50+ guests. If you are searching karaoke room hire Soho options, our setup gives your group privacy, premium sound, and a central location that is easy for everyone to reach. For planners comparing karaoke birthday London venues, we combine atmosphere, clear booking flow, and service that keeps the night moving. With 80,000+ songs, updated monthly, your group has the variety to satisfy every generation and genre preference. Prebook early to secure preferred times.
        </p>
      </section>

      <section id="seo-corporate" className="space-y-4">
        <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">Corporate Karaoke Events in Central London</h2>
        <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          For teams and clients, our private karaoke Soho venue offers a polished nightlife setting without the friction of shared public spaces. Businesses evaluating karaoke room hire Soho locations choose London Karaoke Club for smooth hosting, private layouts, and flexible room formats for 10 to 50+ guests. If you are shortlisting corporate karaoke London venues, we deliver the right balance of fun, quality, and event control. 80,000+ songs, updated monthly, helps mixed teams engage quickly, while central Soho access keeps logistics simple for after-work gatherings, launches, and celebrations.
        </p>
      </section>

      <section id="seo-hen-stag" className="space-y-4">
        <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">Hen & Stag Karaoke Nights in Soho</h2>
        <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          Hen and stag plans need high energy with minimal stress. Our private karaoke Soho experience gives your group a dedicated setting, strong service, and a premium party feel from arrival to final song. If you are comparing karaoke room hire Soho venues, London Karaoke Club supports 10 to 50+ guests with clear prebooking and layouts built for celebration. Many groups searching karaoke birthday London and pre-wedding party options choose us because the experience feels exclusive and effortless. With 80,000+ songs, updated monthly, your playlist stays broad and current, from classics to modern chart tracks.
        </p>
      </section>

      <section className="text-center">
        <Card className="p-6 md:p-8">
          <p className="mb-4 text-zinc-300">Need availability before you decide?</p>
          <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer">Check Availability</Button>
        </Card>
      </section>
    </Section>
  );
};

export default HomeConversionBlocks;
