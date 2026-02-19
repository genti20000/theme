
import React from 'react';
import { useData } from '../context/DataContext';

const InstagramHighlights: React.FC = () => {
  const { instagramHighlightsData } = useData();

  if (!instagramHighlightsData.enabled || !instagramHighlightsData.highlights || instagramHighlightsData.highlights.length === 0) {
    return null;
  }

  return (
    <section className="bg-black py-16 md:py-24 border-t border-zinc-900 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">
                {instagramHighlightsData.heading.split(' ').map((word, i) => (
                    <span key={i} className={i % 2 === 1 ? 'text-pink-500' : 'text-white'}>
                        {word}{' '}
                    </span>
                ))}
            </h3>
            <a 
                href={`https://instagram.com/${instagramHighlightsData.username.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs flex items-center gap-2"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                {instagramHighlightsData.username}
            </a>
        </div>

        <div className="flex gap-6 md:gap-10 overflow-x-auto pb-8 scrollbar-hide px-2">
          {instagramHighlightsData.highlights.map((h) => (
            <a 
              key={h.id}
              href={h.link || `https://instagram.com/${instagramHighlightsData.username.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-4 flex-shrink-0 group"
            >
              <div className="relative p-1 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 transition-transform duration-300 group-hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-black overflow-hidden bg-zinc-900">
                  {h.imageUrl ? (
                    <img 
                      src={h.imageUrl}
                      alt={h.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                      No Image
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                {h.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramHighlights;
