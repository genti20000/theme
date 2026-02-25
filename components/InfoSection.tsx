import React from 'react';
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
            Say goodbye to chain karaoke’s claustrophobic, padded boxes. Our private spaces with dedicated <span className="font-semibold text-white">private entrances</span> host groups of 10 to 50+ for hen dos, birthdays, weddings, and corporate events, powered by <span className="font-semibold text-yellow-300">80,000+ songs, updated monthly</span>, through studio-quality sound equipment. Advance prebooking is essential — no walk-ins allowed.
          </p>
        </Card>

        <div className="space-y-8">
          <article>
            <h3 className="mb-3 text-2xl font-black text-white md:text-3xl">No Boxes, Just Epic Sound</h3>
            <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
              We’re not a franchise. No imprisoned, padded rooms or lifeless playlists. Our private spaces feel like your personal club: velvet drapes, fairy lights, open layouts, and studio-quality sound equipment that delivers crystal-clear audio. Guests browse and queue tracks from their phones, tune key and tempo, and keep the energy high all night.
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
              Enjoy sharing platters, gourmet snacks, and reasonably priced cocktails tailored for birthdays, hen and stag nights, and corporate events. Great food, strong sound, and private space make every booking feel premium.
            </p>
          </article>
        </div>
      </div>
    </Section>
  );
};

export default InfoSection;
