import React from 'react';
import { Link } from 'react-router-dom';
import { SUMUP_BOOKING_URL, WHATSAPP_URL } from '../lib/nav';
import Button from './ui/Button';
import Card from './ui/Card';
import Section from './ui/Section';

const HomeConversionBlocks: React.FC = () => {
  return (
    <Section className="border-t border-white/10 bg-[#0A0A0A]" containerClassName="space-y-16 md:space-y-20 lg:space-y-28">
      <section className="rounded-2xl border border-yellow-300/30 bg-white/[0.03] p-6 text-center md:p-8">
        <h3 className="mb-3 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-200">Ready to lock in your date?</h3>
        <p className="mb-5 text-zinc-300">Fridays & Saturdays sell out 1–2 weeks in advance.</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer">Book Now</Button>
          <Button href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" variant="secondary">Plan via WhatsApp</Button>
        </div>
      </section>

      <section id="seo-birthday" className="space-y-4">
        <h2 className="text-2xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-300 to-yellow-300 md:text-3xl">Private Karaoke Birthday Parties in Soho</h2>
        <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          Planning a celebration that feels genuinely personal? London Karaoke Club is a leading choice for private karaoke Soho birthday nights with dedicated spaces for 10 to 50+ guests. If you are searching karaoke room hire Soho options, our setup gives your group privacy, premium sound, and a central location that is easy for everyone to reach. For planners comparing karaoke birthday London venues, we combine atmosphere, clear booking flow, and service that keeps the night moving. With 80,000+ songs, updated monthly, your group has the variety to satisfy every generation and genre preference. Prebook early to secure preferred times.
        </p>
        <p className="text-sm leading-6 text-zinc-400">
          Start with the <Link to="/birthday-karaoke-soho" className="text-yellow-300 hover:text-white">birthday karaoke Soho page</Link>, then review the <Link to="/gallery" className="text-yellow-300 hover:text-white">gallery</Link> and <Link to="/drinks" className="text-yellow-300 hover:text-white">drinks menu</Link> before booking.
        </p>
      </section>

      <section id="seo-corporate" className="space-y-4">
        <h2 className="text-2xl font-black leading-tight text-cyan-300 md:text-3xl">Corporate Karaoke Events in Central London</h2>
        <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          For teams and clients, our private karaoke Soho venue offers a polished nightlife setting without the friction of shared public spaces. Businesses evaluating karaoke room hire Soho locations choose London Karaoke Club for smooth hosting, private layouts, and flexible room formats for 10 to 50+ guests. If you are shortlisting corporate karaoke London venues, we deliver the right balance of fun, quality, and event control. 80,000+ songs, updated monthly, helps mixed teams engage quickly, while central Soho access keeps logistics simple for after-work gatherings, launches, and celebrations.
        </p>
        <p className="text-sm leading-6 text-zinc-400">
          Compare <Link to="/events" className="text-cyan-300 hover:text-white">corporate karaoke events</Link> with the <Link to="/songs" className="text-cyan-300 hover:text-white">song library</Link> and recent <Link to="/blog" className="text-cyan-300 hover:text-white">planning guides</Link>.
        </p>
      </section>

      <section id="seo-hen-stag" className="space-y-4">
        <h2 className="text-2xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-yellow-300 md:text-3xl">Hen & Stag Karaoke Nights in Soho</h2>
        <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          Hen and stag plans need high energy with minimal stress. Our private karaoke Soho experience gives your group a dedicated setting, strong service, and a premium party feel from arrival to final song. If you are comparing karaoke room hire Soho venues, London Karaoke Club supports 10 to 50+ guests with clear prebooking and layouts built for celebration. Many groups searching karaoke birthday London and pre-wedding party options choose us because the experience feels exclusive and effortless. With 80,000+ songs, updated monthly, your playlist stays broad and current, from classics to modern chart tracks.
        </p>
        <p className="text-sm leading-6 text-zinc-400">
          See the full <Link to="/hen-do-karaoke-soho" className="text-fuchsia-300 hover:text-white">hen do karaoke Soho guide</Link>, browse the <Link to="/gallery" className="text-fuchsia-300 hover:text-white">party gallery</Link>, and check <Link to="/food" className="text-fuchsia-300 hover:text-white">food options</Link> for group planning.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <h3 className="mb-2 text-lg font-bold text-white">High-intent pages</h3>
          <p className="text-sm leading-6 text-zinc-400">
            Use our strongest booking pages to compare birthdays, hen dos, and private event formats before choosing a date.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link to="/birthday-karaoke-soho" className="text-yellow-300 hover:text-white">Birthday karaoke Soho</Link>
            <Link to="/hen-do-karaoke-soho" className="text-yellow-300 hover:text-white">Hen do karaoke Soho</Link>
            <Link to="/events" className="text-yellow-300 hover:text-white">Corporate karaoke events</Link>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-2 text-lg font-bold text-white">Decision support</h3>
          <p className="text-sm leading-6 text-zinc-400">
            Gallery, menus, and songs help users validate the venue quickly and reduce booking hesitation.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link to="/gallery" className="text-cyan-300 hover:text-white">Gallery</Link>
            <Link to="/drinks" className="text-cyan-300 hover:text-white">Drinks menu</Link>
            <Link to="/songs" className="text-cyan-300 hover:text-white">Song library</Link>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-2 text-lg font-bold text-white">Planning content</h3>
          <p className="text-sm leading-6 text-zinc-400">
            Internal guides strengthen SEO coverage and keep planners moving deeper into the site instead of bouncing.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link to="/blog" className="text-fuchsia-300 hover:text-white">Blog</Link>
            <Link to="/instagram" className="text-fuchsia-300 hover:text-white">Instagram highlights</Link>
            <Link to="/sitemap" className="text-fuchsia-300 hover:text-white">Sitemap</Link>
          </div>
        </Card>
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
