import React from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Section from './ui/Section';

const InfoSection: React.FC = () => {
  return (
    <Section className="border-t border-white/10 bg-[#0A0A0A]">
      <div className="mx-auto max-w-[980px] space-y-8">
        <Card className="p-6 md:p-8">
          <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
            Welcome to <span className="font-bold text-white">London Karaoke Club</span>, Soho’s premier destination for private karaoke, <span className="font-semibold text-yellow-300">open until 3am</span>. Steps from Oxford Street, Bond Street, Tottenham Court Road, and minutes from London Bridge, Victoria, Marylebone, and the West End, we’re at the heart of London nightlife.
          </p>
          <p className="mt-5 text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
            Our private spaces with dedicated <span className="font-semibold text-white">private entrances</span> host groups of 10 to 50+ for hen dos, birthdays, weddings, and corporate events, powered by <span className="font-semibold text-yellow-300">80,000+ songs, updated monthly</span>, and studio-quality sound equipment. Advance prebooking is essential and we do not accept walk-ins. Browse the <Link to="/songs" className="text-yellow-300 hover:text-white">song library</Link>, see the <Link to="/gallery" className="text-yellow-300 hover:text-white">gallery</Link>, or review the <Link to="/drinks" className="text-yellow-300 hover:text-white">drinks menu</Link> while planning.
          </p>
        </Card>

        <div className="space-y-8">
          <article>
            <h3 className="mb-3 text-2xl font-black text-white md:text-3xl">No Boxes, Just Epic Sound</h3>
            <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
              This is private karaoke built for people who want more than a standard booth. Expect velvet drapes, fairy lights, open layouts, and clean, high-volume sound that still feels sharp. Guests browse and queue tracks from their phones, tune key and tempo, and keep the night moving without losing control of the room.
            </p>
          </article>

          <article>
            <h3 className="mb-3 text-2xl font-black text-white md:text-3xl">Soho’s Premier Locations</h3>
            <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
              Our venues are in the pulse of Soho, close to Mayfair, Marylebone, and the West End. Hidden entrances open into electric private spaces for groups of 10 to 50+, and we stay open until 3am. Prebook in advance to secure your room.
            </p>
          </article>

          <article>
            <h3 className="mb-3 text-2xl font-black text-white md:text-3xl">Gourmet Treats, Vibrant Nights</h3>
            <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
              Enjoy sharing platters, gourmet snacks, and reasonably priced cocktails tailored for birthdays, hen and stag nights, and corporate events. Explore the <Link to="/food" className="text-yellow-300 hover:text-white">food menu</Link> and <Link to="/drinks" className="text-yellow-300 hover:text-white">cocktails and drinks list</Link> before you book.
            </p>
          </article>
        </div>
      </div>
    </Section>
  );
};

export default InfoSection;
