import React from 'react';
import { useData } from '../context/DataContext';

const InfoSection: React.FC = () => {
  const { infoSectionData } = useData();

  if (infoSectionData.enabled === false) return null;

  return (
    <section className="bg-zinc-900 py-16 text-gray-300 relative overflow-hidden">
      {/* Decorative blurred background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-12 text-center drop-shadow-sm">
          {infoSectionData.heading || 'Private Karaoke in Soho | London Karaoke Club'}
        </h2>
        
        <div className="space-y-12 text-lg leading-relaxed">
          {(infoSectionData.sections && infoSectionData.sections.length > 0) ? (
            infoSectionData.sections.map((section, index) => (
              <div key={index} className="bg-zinc-800/40 p-8 rounded-3xl border border-zinc-700/50 backdrop-blur-sm">
                <h3 className={`text-3xl font-bold mb-4 drop-shadow-md ${section.color === 'pink' ? 'text-pink-500' : section.color === 'purple' ? 'text-purple-500' : section.color === 'cyan' ? 'text-cyan-500' : 'text-yellow-500'}`}>
                  {section.title}
                </h3>
                <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            ))
          ) : (
            <>
              <div className="bg-zinc-800/40 p-8 rounded-3xl border border-zinc-700/50 backdrop-blur-sm">
                <p className="mb-6">
                  Welcome to <span className="text-white font-bold">London Karaoke Club</span>, Soho's premier destination for private karaoke, open daily from <span className="text-yellow-400 font-bold">2pm to 3am</span>. 
                  Steps from Oxford Street, Bond Street, Tottenham Court Road, and minutes from London Bridge, Victoria, Marylebone, 
                  and the West End, we're at the heart of London's nightlife.
                </p>
                <p>
                  Say goodbye to chain karaoke's claustrophobic, padded boxes. Our entire private spaces with dedicated <span className="text-pink-500 font-bold">private entrances</span> host groups of 10 to 50+ for hen dos, birthdays, weddings, or corporate events, delivering <span className="text-cyan-400 font-bold">60,000+ songs</span> through studio-quality sound equipment. Advance prebooking is essential—no walk-ins allowed. 
                  Prebook your private karaoke night and sing until <span className="text-yellow-400 font-bold">3am</span> in Soho's open, electric spaces!
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-pink-500 mb-4 drop-shadow-md">No Boxes, Just Epic Sound</h3>
                <p>
                  We're not a franchise. No imprisoned, padded rooms or lifeless playlists. Our entire private spaces are your 
                  personal club: velvet drapes, fairy lights, open layouts, and <span className="text-white font-semibold">studio-quality sound equipment</span> that delivers 
                  crystal-clear audio, outshining most London venues. With 60,000+ songs, guests use the Remote Controller 
                  to browse via smartphones and add tracks to the Queue. Customize with <span className="text-purple-400 font-semibold">Custom Key & Tempo</span>, tweak Customizable 
                  Vocals for lead or backup, and enjoy 400+ new songs monthly via Daily Updates. Explore our song catalogue 
                  for 10 to 50+ guests in a vibrant, unconfined space, secured by prebooking.
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-purple-500 mb-4 drop-shadow-md">Soho's Premier Locations</h3>
                <p>
                  Our venues are <span className="text-white font-semibold">Soho's pulse</span>, surrounded by Mayfair, Marylebone, and the West End. Hidden in plain sight, 
                  our spaces open into electric, open areas with private entrances, perfect for groups of 10 to 50+. Open <span className="text-yellow-400">2pm to 3am daily</span>, we outlast competitors, hosting late-night cast parties, tour wrap-ups, or work celebrations. 
                  Prebook in advance—no walk-ins ensures your exclusive space. Our <span className="text-green-400 font-semibold">5-star service</span> delivers better value than 
                  pricy chains, and if you're lost, we'll guide you to your private entrance.
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-cyan-500 mb-4 drop-shadow-md">Gourmet Treats, Vibrant Nights</h3>
                <p>
                  Indulge in delicious sharing platters, gourmet snacks, and <span className="text-green-400 font-semibold">reasonably priced cocktails</span>, crafted for groups 
                  of 10 to 50+ at hen parties, birthdays, or corporate events. Our menu, paired with studio-quality sound in 
                  open spaces, elevates your late-night karaoke until 3am. See our event packages to plan a prebooked night 
                  that surpasses Soho's boxed venues.
                </p>
              </div>

              <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-8 rounded-3xl border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.15)] text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h3 className="text-3xl font-bold text-yellow-400 mb-6 relative z-10">Prebook Your Exclusive Space</h3>
                <p className="mb-6 relative z-10">
                  Advance prebooking is required—<span className="text-red-500 font-bold">no walk-ins allowed</span>, ensuring your group of 10 to 50+ enjoys an exclusive, 
                  open space with a private entrance Soho venues. Use our instant online booking or WhatsApp for tailored planning. 
                  Open 2pm to 3am daily, we deliver flawless execution. Missing a song? Contact us to add it!
                </p>
                <p className="font-extrabold text-white text-xl tracking-wide relative z-10">
                  Prebook Now | <span className="text-green-400">Plan via WhatsApp</span>. No chains, no boxes—just your private, spectacular night in Soho.
                </p>
              </div>
            </>
          )}

          {/* About Us Section */}
          <div id="about-section" className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl border border-gray-600 shadow-[0_0_20px_rgba(100,100,100,0.2)]">
            <h3 className="text-3xl font-bold text-white mb-6 text-center">About Us</h3>
            <div className="space-y-4">
              <p className="text-gray-200">
                London Karaoke Club is the premier destination for private karaoke experiences in the heart of Soho. 
                We've revolutionized the traditional karaoke experience by offering spacious, private rooms with 
                premium sound equipment and an extensive library of over 80,000 songs.
              </p>
              <p className="text-gray-200">
                Our mission is to provide unforgettable entertainment experiences for all occasions, 
                from intimate gatherings to large celebrations. We pride ourselves on our state-of-the-art 
                equipment, personalized service, and vibrant atmosphere that keeps guests coming back.
              </p>
            </div>
          </div>

          {/* Contact & Location Section */}
          <div id="contact-section" className="bg-gradient-to-br from-blue-900 to-indigo-900 p-8 rounded-3xl border border-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <h3 className="text-3xl font-bold text-blue-300 mb-6 text-center">Contact & Location</h3>
            <div className="space-y-4 text-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Address</h4>
                  <p>London Karaoke Club</p>
                  <p>12-14 Berwick Street</p>
                  <p>Soho, London W1F 0LE</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Contact Info</h4>
                  <p>Phone: +44 20 7437 0000</p>
                  <p>Email: info@londonkaraoke.club</p>
                  <p>WhatsApp: +44 7761 383514</p>
                </div>
              </div>
              <div className="pt-4">
                <h4 className="text-xl font-bold text-white mb-2">Opening Hours</h4>
                <p>Monday - Sunday: 2:00 PM - 3:00 AM</p>
              </div>
            </div>
          </div>

          {/* Careers Section */}
          <div id="careers-section" className="bg-gradient-to-br from-green-900 to-emerald-900 p-8 rounded-3xl border border-green-600 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <h3 className="text-3xl font-bold text-green-300 mb-6 text-center">Careers</h3>
            <div className="space-y-4 text-gray-200">
              <p>
                Join our team at London Karaoke Club and be part of London's most vibrant entertainment venue. 
                We're always looking for passionate individuals who love music, hospitality, and creating 
                unforgettable experiences for our guests.
              </p>
              <h4 className="text-xl font-bold text-white">Available Positions</h4>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Event Hosts</li>
                <li>Technical Support</li>
                <li>Customer Service Representatives</li>
                <li>Bar Staff</li>
                <li>Security Personnel</li>
              </ul>
              <p className="pt-2">
                To apply, please send your CV and a cover letter to: careers@londonkaraoke.club
              </p>
            </div>
          </div>

          {/* Footer section from original content */}
          {infoSectionData.footerTitle && (
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-8 rounded-3xl border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.15)] text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-3xl font-bold text-yellow-400 mb-6 relative z-10">{infoSectionData.footerTitle}</h3>
              <p className="mb-6 relative z-10">
                {infoSectionData.footerText}
              </p>
              <p className="font-extrabold text-white text-xl tracking-wide relative z-10">
                {infoSectionData.footerHighlight}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
