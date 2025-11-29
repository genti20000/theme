
import React from 'react';
import { useData } from '../context/DataContext';

const Fitness: React.FC = () => {
  const { vibeData } = useData();

  return (
    <section className="bg-zinc-900 pt-16 md:pt-24 pb-0">
      <div className="container mx-auto px-6 pb-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-purple-400 font-semibold tracking-wider uppercase">{vibeData.label}</p>
          <h3 className="text-5xl md:text-6xl font-bold mt-4 mb-6">{vibeData.heading}</h3>
          <p className="text-xl text-gray-300 leading-relaxed">
            {vibeData.text}
          </p>
        </div>
        <div className="relative aspect-[2.35/1] max-w-6xl mx-auto">
            <img src={vibeData.image1} alt="Vibe Image 1" className="absolute top-0 right-1/2 translate-x-[20%] w-[45%] h-full object-cover rounded-full z-10 border-[10px] border-zinc-900 shadow-2xl"/>
            <img src={vibeData.image2} alt="Vibe Image 2" className="absolute bottom-0 left-1/2 -translate-x-[20%] w-[45%] h-full object-cover rounded-full border-[10px] border-zinc-900 shadow-2xl"/>
        </div>
      </div>

      {/* Full Width Bottom Image */}
      {/* Mobile: Stacked. Desktop: Overlay. */}
      <div className="flex flex-col md:block relative md:py-48 md:min-h-[80vh] md:overflow-hidden">
            
            {/* Image Section */}
            <div className="w-full h-[40vh] md:absolute md:inset-0 md:h-full z-0">
                <img 
                    src={vibeData.bigImage} 
                    alt="Party Atmosphere" 
                    className="w-full h-full object-cover md:opacity-60"
                />
                <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent"></div>
            </div>
            
            {/* Content Section */}
            <div className="relative z-10 bg-zinc-900 md:bg-transparent px-6 py-16 md:py-0 md:flex md:flex-col md:justify-end md:items-center md:h-full md:absolute md:inset-0 pointer-events-none text-center">
                <div className="max-w-4xl mx-auto md:pb-12 pointer-events-auto">
                    <h3 className="text-6xl md:text-8xl font-black text-white md:text-transparent md:bg-clip-text md:bg-gradient-to-b md:from-white md:to-gray-400 mb-8">{vibeData.bottomHeading}</h3>
                    <p className="text-2xl text-gray-300 md:text-gray-200 max-w-2xl mx-auto font-light">
                        {vibeData.bottomText}
                    </p>
                </div>
            </div>
      </div>
    </section>
  );
};

export default Fitness;
