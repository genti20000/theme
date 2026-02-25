import React from 'react';

const InfoSection: React.FC = () => {
  return (
    <section className="bg-zinc-900 py-16 text-gray-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-12 text-center drop-shadow-sm">
          Private Karaoke in Soho | London Karaoke Club
        </h2>

        <div className="space-y-10 text-lg leading-relaxed">
          <div className="bg-zinc-800/40 p-8 rounded-3xl border border-zinc-700/50 backdrop-blur-sm">
            <p className="mb-6">
              Welcome to <span className="text-white font-bold">London Karaoke Club</span>, Soho’s premier destination for private karaoke, <span className="text-yellow-400 font-bold">open until 3am</span>. Steps from Oxford Street, Bond Street, Tottenham Court Road, and minutes from London Bridge, Victoria, Marylebone, and the West End, we’re at the heart of London nightlife.
            </p>
            <p>
              Say goodbye to chain karaoke’s claustrophobic, padded boxes. Our private spaces with dedicated <span className="text-pink-500 font-bold">private entrances</span> host groups of 10 to 50+ for hen dos, birthdays, weddings, and corporate events, powered by <span className="text-cyan-400 font-bold">80,000+ songs, updated monthly</span>, through studio-quality sound equipment. Advance prebooking is essential — no walk-ins allowed.
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-pink-500 mb-4 drop-shadow-md">No Boxes, Just Epic Sound</h3>
            <p>
              We’re not a franchise. No imprisoned, padded rooms or lifeless playlists. Our private spaces feel like your personal club: velvet drapes, fairy lights, open layouts, and <span className="text-white font-semibold">studio-quality sound equipment</span> that delivers crystal-clear audio. Guests browse and queue tracks from their phones, tune key and tempo, and keep the energy high all night.
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-purple-500 mb-4 drop-shadow-md">Soho’s Premier Locations</h3>
            <p>
              Our venues are in the pulse of Soho, close to Mayfair, Marylebone, and the West End. Hidden entrances open into electric private spaces for groups of 10 to 50+, and we stay <span className="text-yellow-400">open until 3am</span>. Prebook in advance to secure your room.
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-cyan-500 mb-4 drop-shadow-md">Gourmet Treats, Vibrant Nights</h3>
            <p>
              Enjoy sharing platters, gourmet snacks, and <span className="text-green-400 font-semibold">reasonably priced cocktails</span> tailored for birthdays, hen and stag nights, and corporate events. Great food, strong sound, and private space make every booking feel premium.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
