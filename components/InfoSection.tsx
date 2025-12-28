
import React from 'react';
import { useData } from '../context/DataContext';

const InfoSection: React.FC = () => {
  const { infoSectionData } = useData();

  return (
    <section className="bg-zinc-900 py-20 text-gray-300 relative overflow-hidden">
      {/* Decorative blurred background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-8 text-center drop-shadow-sm">
          {infoSectionData.heading}
        </h2>
        
        {infoSectionData.intro && (
            <div className="bg-zinc-800/20 p-8 rounded-3xl border border-zinc-800 mb-16 backdrop-blur-sm shadow-xl">
                <p className="text-xl md:text-2xl text-gray-100 leading-relaxed italic whitespace-pre-line">
                    {infoSectionData.intro}
                </p>
            </div>
        )}
        
        <div className="space-y-16 text-lg leading-relaxed">
          {infoSectionData.sections.map((section, idx) => (
             <div key={idx} className={`${idx === 0 ? 'bg-zinc-800/40 p-10 rounded-[3rem] border border-zinc-700/50 backdrop-blur-sm shadow-xl' : 'px-4'}`}>
                <h3 className={`text-3xl font-bold mb-6 drop-shadow-md text-${section.color || 'white'}`}>{section.title}</h3>
                <div className="whitespace-pre-line text-gray-300">{section.content}</div>
             </div>
          ))}

          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-10 rounded-[3rem] border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.1)] text-center relative overflow-hidden group mt-12">
            <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-3xl font-black text-yellow-400 mb-8 relative z-10 uppercase tracking-tighter italic">
                {infoSectionData.footerTitle}
            </h3>
            <p className="mb-8 relative z-10 text-gray-200 text-lg leading-relaxed">
              {infoSectionData.footerText}
            </p>
            <div className="h-px w-24 bg-zinc-700 mx-auto mb-8"></div>
            <p className="font-black text-white text-xl tracking-wide relative z-10 italic uppercase">
              {infoSectionData.footerHighlight}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
