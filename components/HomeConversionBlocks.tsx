import React from 'react';
import { SUMUP_BOOKING_URL, WHATSAPP_URL } from '../lib/nav';

const spaces = [
  { name: 'Terrace Bar', capacity: '20–40 guests' },
  { name: 'Vox Room', capacity: '10–20 guests' },
  { name: 'Attic', capacity: '30–50+ guests' }
];

const HomeConversionBlocks: React.FC = () => {
  return (
    <section className="bg-zinc-950 border-t border-zinc-900 py-16 md:py-24">
      <div className="container mx-auto px-6 space-y-16">
        <section id="spaces" className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-black text-white">Our Private Karaoke Spaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spaces.map((space) => (
              <article key={space.name} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <h3 className="text-xl font-bold text-white mb-3">{space.name}</h3>
                <ul className="space-y-2 text-sm text-zinc-300 mb-5">
                  <li>Capacity: {space.capacity}</li>
                  <li>Open until 3am</li>
                  <li>Minimum 2 hour booking</li>
                </ul>
                <a
                  href={SUMUP_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-pink-600 hover:bg-pink-500 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full"
                >
                  Book {space.name}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Simple Pricing</h2>
          <p className="text-zinc-300 mb-4">Prices vary by group size and day.</p>
          <ul className="space-y-2 text-sm text-zinc-300 list-disc pl-5">
            <li>Weekdays: from £X per hour</li>
            <li>Fridays & Saturdays: from £X per hour</li>
            <li>Minimum 2 hours</li>
          </ul>
        </section>

        <section className="text-center rounded-2xl border border-yellow-500/30 bg-zinc-900 p-6">
          <h3 className="text-2xl font-black text-white mb-3">Ready to lock in your date?</h3>
          <p className="text-zinc-300 mb-5">Fridays & Saturdays sell out 1–2 weeks in advance.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="bg-yellow-400 hover:bg-yellow-500 text-black font-black uppercase text-sm px-6 py-3 rounded-full">Book Now</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase text-sm px-6 py-3 rounded-full border border-zinc-700">Plan via WhatsApp</a>
          </div>
        </section>

        <section id="seo-birthday" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-black text-white">Private Karaoke Birthday Parties in Soho</h2>
          <p className="text-zinc-300 leading-relaxed">
            Planning a celebration that feels genuinely personal? London Karaoke Club is a leading choice for private karaoke Soho birthday nights with dedicated spaces for 10 to 50+ guests. If you are searching karaoke room hire Soho options, our setup gives your group privacy, premium sound, and a central location that is easy for everyone to reach. For planners comparing karaoke birthday London venues, we combine atmosphere, clear booking flow, and service that keeps the night moving. With 80,000+ songs, updated monthly, your group has the variety to satisfy every generation and genre preference. Prebook early to secure preferred times.
          </p>
        </section>

        <section id="seo-corporate" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-black text-white">Corporate Karaoke Events in Central London</h2>
          <p className="text-zinc-300 leading-relaxed">
            For teams and clients, our private karaoke Soho venue offers a polished nightlife setting without the friction of shared public spaces. Businesses evaluating karaoke room hire Soho locations choose London Karaoke Club for smooth hosting, private layouts, and flexible room formats for 10 to 50+ guests. If you are shortlisting corporate karaoke London venues, we deliver the right balance of fun, quality, and event control. 80,000+ songs, updated monthly, helps mixed teams engage quickly, while central Soho access keeps logistics simple for after-work gatherings, launches, and celebrations.
          </p>
        </section>

        <section id="seo-hen-stag" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-black text-white">Hen & Stag Karaoke Nights in Soho</h2>
          <p className="text-zinc-300 leading-relaxed">
            Hen and stag plans need high energy with minimal stress. Our private karaoke Soho experience gives your group a dedicated setting, strong service, and a premium party feel from arrival to final song. If you are comparing karaoke room hire Soho venues, London Karaoke Club supports 10 to 50+ guests with clear prebooking and layouts built for celebration. Many groups searching karaoke birthday London and pre-wedding party options choose us because the experience feels exclusive and effortless. With 80,000+ songs, updated monthly, your playlist stays broad and current, from classics to modern chart tracks.
          </p>
        </section>

        <section className="text-center rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-300 mb-4">Need availability before you decide?</p>
          <a href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-block bg-pink-600 hover:bg-pink-500 text-white text-sm font-black uppercase tracking-widest px-6 py-3 rounded-full">Check Availability</a>
        </section>
      </div>
    </section>
  );
};

export default HomeConversionBlocks;
