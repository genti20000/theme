
import React from 'react';
import { useData } from '../context/DataContext';

const InfoSection: React.FC = () => {
  const { infoSectionData } = useData();

  return (
    <section className="bg-zinc-900 py-16 text-gray-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-12 text-center drop-shadow-sm uppercase tracking-tighter">
          {infoSectionData.heading}
        </h2>
        
        <div className="space-y-12 text-lg leading-relaxed">
          {infoSectionData.sections.map((s, i) => (
              <div key={i} className={`bg-zinc-800/40 p-8 rounded-3xl border border-zinc-700/50 backdrop-blur-sm`}>
                <h3 className={`text-3xl font-bold mb-4 ${s.color === 'pink' ? 'text-pink-500' : 'text-purple-500'}`}>{s.title}</h3>
                <p className="whitespace-pre-line">{s.content}</p>
              </div>
          ))}

          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-8 rounded-3xl border border-pink-500/30 shadow-lg text-center group transition-all hover:border-pink-500/60">
            <h3 className="text-3xl font-bold text-pink-500 mb-6">{infoSectionData.footerTitle}</h3>
            <p className="mb-6">{infoSectionData.footerText}</p>
            <p className="font-extrabold text-white text-xl tracking-tighter">{infoSectionData.footerHighlight}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
