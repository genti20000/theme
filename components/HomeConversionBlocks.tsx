import React from 'react';
import { Link } from 'react-router-dom';
import { SUMUP_BOOKING_URL, WHATSAPP_URL } from '../lib/nav';
import Button from './ui/Button';
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
          Planning a birthday that feels more special than a standard bar booking? London Karaoke Club gives your group a private Soho space, strong sound, late trading, and a booking process that is easy to manage. For planners comparing birthday karaoke London venues, the difference is privacy, atmosphere, and a setup that works for both close groups and bigger celebrations. With 80,000+ songs, updated monthly, your guests can move from singalong classics to current chart tracks without the night losing momentum.
        </p>
        <p className="text-sm leading-6 text-zinc-400">
          Start with the <Link to="/birthday-karaoke-soho" className="text-yellow-300 hover:text-white">birthday karaoke Soho page</Link>, then review the <Link to="/gallery" className="text-yellow-300 hover:text-white">gallery</Link> and <Link to="/drinks" className="text-yellow-300 hover:text-white">drinks menu</Link> before booking.
        </p>
      </section>

      <section id="seo-corporate" className="space-y-4">
        <h2 className="text-2xl font-black leading-tight text-cyan-300 md:text-3xl">Corporate Karaoke Events in Central London</h2>
        <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          For team socials, client entertainment, and wrap parties, our Soho venue offers a private setting that feels more polished than a shared karaoke bar. Groups can settle in quickly, control the room, and keep the schedule simple in a central London location that works well after work. If you are weighing up corporate karaoke London options, this is designed for easy hosting, clear logistics, and broad appeal. The 80,000+ song library, updated monthly, helps mixed groups get involved fast without the awkward start that often slows down event nights.
        </p>
        <p className="text-sm leading-6 text-zinc-400">
          Compare <Link to="/events" className="text-cyan-300 hover:text-white">corporate karaoke events</Link> with the <Link to="/songs" className="text-cyan-300 hover:text-white">song library</Link> and recent <Link to="/blog" className="text-cyan-300 hover:text-white">planning guides</Link>.
        </p>
      </section>

      <section id="seo-hen-stag" className="space-y-4">
        <h2 className="text-2xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-yellow-300 md:text-3xl">Hen & Stag Karaoke Nights in Soho</h2>
        <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          Hen and stag nights work best when the group has its own space, strong drinks service, and no friction on the night. That is exactly what London Karaoke Club is built for. Instead of competing with strangers for attention in a public venue, your group gets a private room, late finish, and a playlist that keeps the energy up from arrival to final song. For Soho pre-wedding parties, the appeal is simple: central location, premium atmosphere, and enough flexibility to suit both relaxed groups and full-scale celebrations.
        </p>
        <p className="text-sm leading-6 text-zinc-400">
          See the full <Link to="/hen-do-karaoke-soho" className="text-fuchsia-300 hover:text-white">hen do karaoke Soho guide</Link>, browse the <Link to="/gallery" className="text-fuchsia-300 hover:text-white">party gallery</Link>, and check <Link to="/food" className="text-fuchsia-300 hover:text-white">food options</Link> for group planning.
        </p>
      </section>

      <section className="text-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <p className="mb-4 text-zinc-300">Need availability before you decide?</p>
          <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer">Check Availability</Button>
        </div>
      </section>

      <section className="rounded-2xl border border-fuchsia-300/20 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[760px]">
            <h2 className="mb-3 text-2xl font-black leading-tight text-fuchsia-300 md:text-3xl">Planning a Soho hen party?</h2>
            <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
              If the group is comparing bars, brunches, and private karaoke, go straight to the
              {' '}
              <Link to="/hen-do-karaoke-soho" className="text-yellow-300 hover:text-white">hen do karaoke Soho page</Link>
              {' '}
              for the clearest overview of how the night works, what to book, and what to check before you lock a date.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/hen-do-karaoke-soho" variant="secondary">Hen Do Karaoke Soho</Button>
            <Button href="/gallery" variant="ghost">View Party Gallery</Button>
          </div>
        </div>
      </section>
    </Section>
  );
};

export default HomeConversionBlocks;
