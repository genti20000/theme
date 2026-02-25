import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ROUTES } from '../lib/nav';

const SitemapPage: React.FC = () => {
  const { blogData, eventsData } = useData();

  const sections = [
    {
      title: "Main Site",
      links: [
        { label: "Home", to: ROUTES.home },
        { label: "Food Menu", to: ROUTES.menu },
        { label: "Drinks Menu", to: ROUTES.drinks },
        { label: "Gallery", to: ROUTES.gallery },
        { label: "Song Library", to: ROUTES.songs },
        { label: "Events & Occasions", to: ROUTES.events },
        { label: "Hen Do Karaoke Soho", to: ROUTES["hen-do-karaoke-soho"] },
        { label: "Nightlife Blog", to: ROUTES.blog },
        { label: "Social Hub", to: ROUTES.instagram },
      ]
    },
    {
      title: "Events",
      links: eventsData.sections.map(s => ({
        label: s.title,
        to: ROUTES.events,
      }))
    },
    {
      title: "Recent Blog Posts",
      links: blogData.posts.slice(0, 5).map(p => ({
        label: p.title,
        to: ROUTES.blog
      }))
    },
    {
      title: "Legal & Info",
      links: [
        { label: "Terms & Conditions", to: ROUTES.terms },
        { label: "Privacy Policy", to: ROUTES.privacy },
        { label: "Booking Policy", to: ROUTES["booking-policy"] },
        { label: "FAQ", to: ROUTES.faqs },
        { label: "Sitemap", to: ROUTES.sitemap },
      ]
    }
  ];

  return (
    <div className="bg-zinc-950 min-h-screen text-white pt-32 pb-24 selection:bg-pink-500">
      <div className="container mx-auto px-6 max-w-6xl">
        <header className="mb-16 border-b border-zinc-900 pb-12">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-4">
                Site<span className="text-yellow-400">Map</span>
            </h1>
            <p className="text-zinc-500 text-lg font-medium max-w-xl">
                A complete directory of the London Karaoke Club digital experience. 
                Find your way to the best private karaoke in Soho.
            </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {sections.map((section, idx) => (
                <div key={idx} className="space-y-6">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 border-l-2 border-pink-500 pl-4">
                        {section.title}
                    </h2>
                    <ul className="space-y-3">
                        {section.links.map((link, lIdx) => (
                            <li key={lIdx}>
                                <Link
                                    to={link.to}
                                    className="text-zinc-400 hover:text-white transition-all text-sm font-bold hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] flex items-center group"
                                >
                                    <span className="w-0 group-hover:w-3 transition-all h-[1px] bg-yellow-400 mr-0 group-hover:mr-2"></span>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>

        <div className="mt-24 p-12 bg-zinc-900/30 rounded-[3rem] border border-zinc-900 text-center">
            <h3 className="text-2xl font-bold mb-4 italic">Can't find what you're looking for?</h3>
            <p className="text-zinc-500 mb-8 max-w-md mx-auto">Our Soho team is available 2pm - 3am daily via WhatsApp for bespoke bookings and enquiries.</p>
            <a 
                href="https://wa.me/447761383514" 
                className="inline-block bg-white text-black font-black uppercase tracking-widest px-8 py-3 rounded-full hover:bg-yellow-400 transition-colors"
            >
                Contact Concierge
            </a>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
