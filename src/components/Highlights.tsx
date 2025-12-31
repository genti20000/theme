import React from 'react';
import { useData } from '../contexts/DataContext';

const Highlights: React.FC = () => {
  const { highlightsData } = useData();

  if (highlightsData.enabled === false) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-zinc-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-4">
            {highlightsData.heading}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {highlightsData.subtext}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border-2 border-zinc-800 shadow-2xl">
                <img 
                  src={highlightsData.mainImageUrl} 
                  alt="London Karaoke Club main area" 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/600x400?text=Karaoke+Venue";
                  }}
                />
              </div>
              
              {/* Side circle image */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden lg:block hidden">
                <img 
                  src={highlightsData.sideImageUrl} 
                  alt="Karaoke booth detail" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/128x128?text=LKC";
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h3 className="text-2xl font-black text-pink-500 mb-6 uppercase tracking-widest">
              {highlightsData.featureListTitle}
            </h3>
            
            <ul className="space-y-4">
              {highlightsData.featureList.map((feature, index) => (
                <li 
                  key={index} 
                  className="flex items-start text-lg font-medium text-gray-200 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:border-pink-500/30 transition-all"
                >
                  <span className="text-pink-500 mr-3 text-xl">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-2xl border border-pink-500/20">
              <p className="text-gray-300 italic">
                "London Karaoke Club has completely transformed our night out experience. The private booths, extensive song library, and top-notch sound system make it the best karaoke venue in the city!"
              </p>
              <div className="mt-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div className="ml-3">
                  <p className="font-bold text-white">John D.</p>
                  <p className="text-sm text-gray-400">Regular Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Highlights;